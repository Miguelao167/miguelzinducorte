import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Configuração de serviços inclusos por plano
function getServicosPlano(planoNome: string): { tipo: string; limite: number }[] {
  const n = planoNome.toLowerCase()
  if (n.includes('bronze')) {
    return [
      { tipo: 'corte', limite: 4 },
      { tipo: 'barba', limite: 4 },
    ]
  }
  if (n.includes('prata')) {
    return [
      { tipo: 'corte', limite: 4 },
      { tipo: 'sobrancelha', limite: 4 },
    ]
  }
  if (n.includes('ouro') || n.includes('gold')) {
    return [
      { tipo: 'corte', limite: 999 }, // ilimitado
      { tipo: 'barba', limite: 4 },
    ]
  }
  if (n.includes('prime')) {
    return [
      { tipo: 'corte', limite: 999 }, // ilimitado
      { tipo: 'barba', limite: 999 }, // ilimitado
      { tipo: 'sobrancelha', limite: 999 }, // ilimitado
      { tipo: 'pigmentacao', limite: 4 },
    ]
  }
  // padrão: só cortes
  return [{ tipo: 'corte', limite: 4 }]
}

export async function GET() {
  try {
    const todas = await prisma.assinatura.findMany({
      include: {
        cliente: true,
        plano: true,
        servicos: true,
      },
      orderBy: { dataExpiracao: 'asc' },
    })

    return NextResponse.json({ assinaturas: todas })
  } catch (error) {
    console.error('Erro ao buscar assinaturas:', error)
    return NextResponse.json({ error: 'Erro ao buscar assinaturas' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { assinaturaId, tipo } = body

    if (!assinaturaId) {
      return NextResponse.json({ error: 'assinaturaId é obrigatório' }, { status: 400 })
    }

    if (!tipo) {
      return NextResponse.json({ error: 'tipo de serviço é obrigatório' }, { status: 400 })
    }

    // Busca o contador desse serviço
    const contador = await prisma.servicoContador.findUnique({
      where: { assinaturaId_tipo: { assinaturaId, tipo } }
    })

    if (!contador) {
      return NextResponse.json({ error: `Serviço "${tipo}" não está incluído neste plano` }, { status: 400 })
    }

    if (contador.limite !== 999 && contador.usados >= contador.limite) {
      return NextResponse.json({ error: `Sem ${tipo} restantes neste plano` }, { status: 400 })
    }

    // Incrementa o uso
    await prisma.servicoContador.update({
      where: { id: contador.id },
      data: { usados: contador.usados + 1 }
    })

    // Mantém compatibilidade: também decrementa cortesRestantes se for corte
    let atualizada
    if (tipo === 'corte') {
      const ass = await prisma.assinatura.findUnique({ where: { id: assinaturaId } })
      if (ass) {
        atualizada = await prisma.assinatura.update({
          where: { id: assinaturaId },
          data: {
            cortesRestantes: Math.max(0, ass.cortesRestantes - 1),
            cortesUsados: ass.cortesUsados + 1,
          },
          include: { cliente: true, plano: true, servicos: true },
        })
      }
    }

    const assinaturaFinal = await prisma.assinatura.findUnique({
      where: { id: assinaturaId },
      include: { cliente: true, plano: true, servicos: true }
    })

    return NextResponse.json({ assinatura: atualizada || assinaturaFinal })
  } catch (error) {
    console.error('Erro ao registrar serviço:', error)
    return NextResponse.json({ error: 'Erro ao registrar serviço' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clienteId, planoId } = body

    if (!clienteId || !planoId) {
      return NextResponse.json({ error: 'clienteId e planoId são obrigatórios' }, { status: 400 })
    }

    const plano = await prisma.plano.findUnique({ where: { id: planoId } })
    if (!plano) {
      return NextResponse.json({ error: 'Plano não encontrado' }, { status: 404 })
    }

    // Desativa assinaturas anteriores ativas do mesmo cliente
    await prisma.assinatura.updateMany({
      where: { clienteId, ativa: true },
      data: { ativa: false },
    })

    const dataInicio = new Date()
    const dataExpiracao = new Date()
    dataExpiracao.setDate(dataExpiracao.getDate() + plano.validadeDias)

    const servicos = getServicosPlano(plano.nome)

    const assinatura = await prisma.assinatura.create({
      data: {
        clienteId,
        planoId,
        dataInicio,
        dataExpiracao,
        cortesRestantes: plano.numeroCortes,
        servicos: {
          create: servicos.map(s => ({
            tipo: s.tipo,
            limite: s.limite,
            usados: 0,
          }))
        }
      },
      include: { cliente: true, plano: true, servicos: true },
    })

    return NextResponse.json({ assinatura })
  } catch (error) {
    console.error('Erro ao criar assinatura:', error)
    return NextResponse.json({ error: 'Erro ao criar assinatura' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { assinaturaId } = body

    if (!assinaturaId) {
      return NextResponse.json({ error: 'assinaturaId é obrigatório' }, { status: 400 })
    }

    await prisma.assinatura.delete({
      where: { id: assinaturaId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao excluir assinatura:', error)
    return NextResponse.json({ error: 'Erro ao excluir assinatura' }, { status: 500 })
  }
}