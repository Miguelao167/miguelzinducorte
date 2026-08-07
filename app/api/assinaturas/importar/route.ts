import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helper'

// POST - Importa agendamentos pagos como assinaturas
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Busca todos os agendamentos pagos (que ainda não viraram assinatura)
    const agendamentosPagos = await prisma.agendamento.findMany({
      where: { pago: true },
      orderBy: { createdAt: 'desc' }
    })

    // Busca todos os planos pra fazer o match (ativos ou não, pra não perder dados)
    const planos = await prisma.plano.findMany()

    // Se não tem plano, cria um genérico automaticamente
    if (planos.length === 0) {
      const novoPlano = await prisma.plano.create({
        data: {
          nome: 'Plano Importado',
          preco: 0,
          numeroCortes: 4,
          validadeDias: 30,
        }
      })
      planos.push(novoPlano)
    }

    let criadas = 0
    const jaVinculados = new Set<string>() // agendamentoId -> set

    // Pega todas as assinaturas existentes pra não duplicar
    const assinaturasExistentes = await prisma.assinatura.findMany({
      include: { cliente: true }
    })

    for (const ag of agendamentosPagos) {
      // Tenta achar um plano pelo servico OU assume que é plano se tiver isPlano=true
      let plano = null
      const servicoNome = (ag.servico || '').trim().toLowerCase()

      if (servicoNome) {
        // Match exato
        plano = planos.find(p => p.nome.toLowerCase() === servicoNome)
        // Match contém
        if (!plano) {
          plano = planos.find(p =>
            p.nome.toLowerCase().includes(servicoNome) ||
            servicoNome.includes(p.nome.toLowerCase())
          )
        }
      }

      // Se é plano e tem só 1 plano cadastrado, usa ele
      if (!plano && ag.isPlano && planos.length === 1) {
        plano = planos[0]
      }

      // Se ainda não achou mas é explicitamente plano OU o nome parece plano (Ouro, Prata, etc)
      if (!plano && (ag.isPlano || /ouro|prata|bronze|diamante|plano/i.test(servicoNome))) {
        // Usa o primeiro plano ativo como padrão
        plano = planos[0]
      }

      if (!plano) continue

      // Garante que o cliente existe
      const telefoneLimpo = ag.telefone.replace(/\D/g, '')
      let cliente = await prisma.cliente.findUnique({
        where: { telefone: telefoneLimpo }
      })

      if (!cliente) {
        cliente = await prisma.cliente.create({
          data: {
            nome: ag.nomeCliente,
            telefone: telefoneLimpo,
          }
        })
      }

      // Verifica se já existe assinatura ativa pra esse cliente com esse plano
      const assinaturaExistente = assinaturasExistentes.find(
        a => a.clienteId === cliente.id && a.planoId === plano.id
      )

      if (assinaturaExistente) continue

      // Desativa assinaturas anteriores ativas
      await prisma.assinatura.updateMany({
        where: { clienteId: cliente.id, ativa: true },
        data: { ativa: false },
      })

      // Cria a assinatura baseada na data do agendamento
      const dataInicio = new Date(ag.createdAt)
      const dataExpiracao = new Date(dataInicio)
      dataExpiracao.setDate(dataExpiracao.getDate() + plano.validadeDias)

      // Cortes restantes: se já usou o corte do agendamento, desconta
      const cortesRestantes = plano.numeroCortes - 1

      await prisma.assinatura.create({
        data: {
          clienteId: cliente.id,
          planoId: plano.id,
          dataInicio,
          dataExpiracao,
          cortesRestantes: cortesRestantes > 0 ? cortesRestantes : 0,
          cortesUsados: 1,
        }
      })

      criadas++
    }

    return NextResponse.json({ criadas, total: agendamentosPagos.length })
  } catch (error) {
    console.error('Erro ao importar:', error)
    return NextResponse.json({ error: 'Erro ao importar' }, { status: 500 })
  }
}