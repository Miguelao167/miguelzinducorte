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

    // Auto-criar assinatura: tenta achar um plano pelo nome do servico
    if (agendamento.servico || agendamento.isPlano) {
      const servicoNome = (agendamento.servico || '').trim()

      // Tenta match exato primeiro (case-insensitive)
      let plano = servicoNome ? await prisma.plano.findFirst({
        where: {
          nome: { equals: servicoNome, mode: 'insensitive' },
        }
      }) : null

      // Se não achou e é plano, tenta match pelo preco ou pega o primeiro plano ativo
      if (!plano && agendamento.isPlano) {
        const todosPlanos = await prisma.plano.findMany()
        plano = todosPlanos.find(p =>
          servicoNome && (
            servicoNome.toLowerCase().includes(p.nome.toLowerCase()) ||
            p.nome.toLowerCase().includes(servicoNome.toLowerCase())
          )
        ) || null
        // Se ainda não achou, usa o primeiro plano (só se for explicitamente plano)
        if (!plano && todosPlanos.length === 1) {
          plano = todosPlanos[0]
        }
      }

      if (plano) {
        const telefoneLimpo = agendamento.telefone.replace(/\D/g, '')

        // Garante que o cliente existe
        let cliente = await prisma.cliente.findUnique({
          where: { telefone: telefoneLimpo }
        })

        if (!cliente) {
          cliente = await prisma.cliente.create({
            data: {
              nome: agendamento.nomeCliente,
              telefone: telefoneLimpo,
            }
          })
        }

        // Desativa assinaturas anteriores ativas do mesmo cliente
        await prisma.assinatura.updateMany({
          where: { clienteId: cliente.id, ativa: true },
          data: { ativa: false },
        })

        // Cria a nova assinatura
        const dataInicio = new Date()
        const dataExpiracao = new Date()
        dataExpiracao.setDate(dataExpiracao.getDate() + plano.validadeDias)

        await prisma.assinatura.create({
          data: {
            clienteId: cliente.id,
            planoId: plano.id,
            dataInicio,
            dataExpiracao,
            cortesRestantes: plano.numeroCortes,
          }
        })
      }
    }

    return NextResponse.json(agendamento)
  } catch (error) {
    console.error('Erro ao marcar como pago:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}