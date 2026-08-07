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

    // Limpa o telefone mantendo só dígitos pra evitar duplicar por formatação
    const telefoneLimpo = telefone.replace(/\D/g, '')

    // Auto-cadastra o cliente se não existir (match por telefone)
    const clienteExistente = await prisma.cliente.findUnique({
      where: { telefone: telefoneLimpo }
    })

    if (!clienteExistente) {
      await prisma.cliente.create({
        data: {
          nome: nomeCliente,
          telefone: telefoneLimpo,
        }
      })
    } else if (clienteExistente.nome !== nomeCliente) {
      // Atualiza o nome caso o cliente tenha informado um diferente
      await prisma.cliente.update({
        where: { id: clienteExistente.id },
        data: { nome: nomeCliente }
      })
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