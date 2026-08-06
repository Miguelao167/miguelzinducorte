import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helper'

// GET - Listar todos os pagamentos (resumo financeiro)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Buscar agendamentos pagos
    const agendamentosPagos = await prisma.agendamento.findMany({
      where: { pago: true },
      orderBy: { createdAt: 'desc' }
    })

    // Buscar saques
    const saques = await prisma.saque.findMany({
      orderBy: { createdAt: 'desc' }
    })

    // Calcular saldo
    const totalRecebido = agendamentosPagos.reduce((acc, a) => acc + (a.valorPago || 0), 0)
    const totalSacado = saques
      .filter(s => s.status === 'concluido')
      .reduce((acc, s) => acc + s.valor, 0)
    const saldoDisponivel = totalRecebido - totalSacado

    return NextResponse.json({
      agendamentosPagos,
      saques,
      totalRecebido,
      totalSacado,
      saldoDisponivel,
    })
  } catch (error) {
    console.error('Erro ao buscar financeiro:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// POST - Marcar agendamento como pago
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { agendamentoId, valor, metodoPagamento } = body

    if (!agendamentoId || !valor) {
      return NextResponse.json(
        { error: 'ID do agendamento e valor são obrigatórios' },
        { status: 400 }
      )
    }

    const agendamento = await prisma.agendamento.update({
      where: { id: agendamentoId },
      data: {
        pago: true,
        valorPago: parseFloat(valor),
        metodoPagamento: metodoPagamento || 'manual',
      }
    })

    return NextResponse.json(agendamento)
  } catch (error) {
    console.error('Erro ao marcar como pago:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}