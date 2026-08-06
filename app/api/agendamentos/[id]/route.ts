import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helper'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { status } = body

    if (!status || !['pendente', 'confirmado', 'cancelado', 'concluido'].includes(status)) {
      return NextResponse.json({ error: 'Status inválido' }, { status: 400 })
    }

    const { id } = await params
    const agendamentoAtual = await prisma.agendamento.findUnique({ where: { id } })

    const agendamento = await prisma.agendamento.update({
      where: { id },
      data: { status }
    })

    // Se mudou para concluido e o cliente tem plano ativo, decrementa 1 corte
    if (status === 'concluido' && agendamentoAtual?.status !== 'concluido' && agendamento.clienteId) {
      const assinaturaAtiva = await prisma.assinatura.findFirst({
        where: {
          clienteId: agendamento.clienteId,
          ativa: true,
          dataExpiracao: { gte: new Date() },
          cortesRestantes: { gt: 0 },
        },
      })

      if (assinaturaAtiva) {
        await prisma.assinatura.update({
          where: { id: assinaturaAtiva.id },
          data: {
            cortesRestantes: { decrement: 1 },
            cortesUsados: { increment: 1 },
          },
        })
      }
    }

    return NextResponse.json(agendamento)
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    await prisma.agendamento.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar agendamento:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}