import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helper'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const agendamentos = await prisma.agendamento.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(agendamentos)
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      nomeCliente,
      telefone,
      servico,
      preco,
      dataPreferida,
      horario,
      observacoes
    } = body

    if (!nomeCliente || !telefone) {
      return NextResponse.json(
        { error: 'Nome e telefone são obrigatórios' },
        { status: 400 }
      )
    }

    const agendamento = await prisma.agendamento.create({
      data: {
        nomeCliente,
        telefone,
        servico: servico || null,
        preco: preco || null,
        dataPreferida: dataPreferida || null,
        horario: horario || null,
        observacoes: observacoes || null,
        status: 'pendente'
      }
    })

    return NextResponse.json(agendamento, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar agendamento:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}