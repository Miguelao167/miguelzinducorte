import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helper'

// POST - Solicitar saque
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { valor, chavePix, observacao } = body

    if (!valor || !chavePix) {
      return NextResponse.json(
        { error: 'Valor e chave PIX são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar saldo disponível
    const agendamentosPagos = await prisma.agendamento.findMany({
      where: { pago: true }
    })

    const saques = await prisma.saque.findMany({
      where: { status: 'concluido' }
    })

    const totalRecebido = agendamentosPagos.reduce((acc, a) => acc + (a.valorPago || 0), 0)
    const totalSacado = saques.reduce((acc, s) => acc + s.valor, 0)
    const saldoDisponivel = totalRecebido - totalSacado

    if (valor > saldoDisponivel) {
      return NextResponse.json(
        { error: `Saldo insuficiente. Disponível: R$ ${saldoDisponivel.toFixed(2)}` },
        { status: 400 }
      )
    }

    const saque = await prisma.saque.create({
      data: {
        valor: parseFloat(valor),
        chavePix,
        observacao: observacao || null,
        status: 'pendente'
      }
    })

    return NextResponse.json(saque, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar saque:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// PUT - Atualizar status do saque (concluir ou cancelar)
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID e status são obrigatórios' },
        { status: 400 }
      )
    }

    const saque = await prisma.saque.update({
      where: { id },
      data: { status }
    })

    return NextResponse.json(saque)
  } catch (error) {
    console.error('Erro ao atualizar saque:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}