import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Busca todas as assinaturas ativas ou não (pra mostrar tudo)
    const todas = await prisma.assinatura.findMany({
      include: {
        cliente: true,
        plano: true,
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
    const { assinaturaId } = body

    if (!assinaturaId) {
      return NextResponse.json({ error: 'assinaturaId é obrigatório' }, { status: 400 })
    }

    const assinatura = await prisma.assinatura.findUnique({ where: { id: assinaturaId } })
    if (!assinatura) {
      return NextResponse.json({ error: 'Assinatura não encontrada' }, { status: 404 })
    }

    if (assinatura.cortesRestantes <= 0) {
      return NextResponse.json({ error: 'Sem cortes restantes' }, { status: 400 })
    }

    const atualizada = await prisma.assinatura.update({
      where: { id: assinaturaId },
      data: {
        cortesRestantes: assinatura.cortesRestantes - 1,
        cortesUsados: assinatura.cortesUsados + 1,
      },
      include: { cliente: true, plano: true },
    })

    return NextResponse.json({ assinatura: atualizada })
  } catch (error) {
    console.error('Erro ao registrar corte:', error)
    return NextResponse.json({ error: 'Erro ao registrar corte' }, { status: 500 })
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

    const assinatura = await prisma.assinatura.create({
      data: {
        clienteId,
        planoId,
        dataInicio,
        dataExpiracao,
        cortesRestantes: plano.numeroCortes,
      },
      include: { cliente: true, plano: true },
    })

    return NextResponse.json({ assinatura })
  } catch (error) {
    console.error('Erro ao criar assinatura:', error)
    return NextResponse.json({ error: 'Erro ao criar assinatura' }, { status: 500 })
  }
}
