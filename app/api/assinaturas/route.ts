import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const assinaturas = await prisma.assinatura.findMany({
      where: { ativa: true },
      include: {
        cliente: true,
        plano: true,
      },
      orderBy: { dataExpiracao: 'asc' },
    })

    // Marca expiradas automaticamente
    const agora = new Date()
    for (const ass of assinaturas) {
      if (ass.dataExpiracao < agora && ass.ativa) {
        await prisma.assinatura.update({
          where: { id: ass.id },
          data: { ativa: false },
        })
      }
    }

    const atualizadas = await prisma.assinatura.findMany({
      where: { ativa: true },
      include: { cliente: true, plano: true },
      orderBy: { dataExpiracao: 'asc' },
    })

    return NextResponse.json({ assinaturas: atualizadas })
  } catch (error) {
    console.error('Erro ao buscar assinaturas:', error)
    return NextResponse.json({ error: 'Erro ao buscar assinaturas' }, { status: 500 })
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
