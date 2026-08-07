import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Diagnóstico: mostra todos os planos e clientes e agendamentos
export async function GET(request: NextRequest) {
  try {
    const [planos, clientes, agendamentosPagos, assinaturas] = await Promise.all([
      prisma.plano.findMany(),
      prisma.cliente.findMany(),
      prisma.agendamento.findMany({ where: { pago: true } }),
      prisma.assinatura.findMany(),
    ])

    return NextResponse.json({
      totalPlanos: planos.length,
      planos: planos.map(p => ({ id: p.id, nome: p.nome, preco: p.preco, ativo: p.ativo })),
      totalClientes: clientes.length,
      clientes: clientes.map(c => ({ id: c.id, nome: c.nome, telefone: c.telefone })),
      totalAgendamentosPagos: agendamentosPagos.length,
      agendamentosPagos: agendamentosPagos.map(a => ({
        id: a.id,
        nomeCliente: a.nomeCliente,
        telefone: a.telefone,
        servico: a.servico,
        isPlano: a.isPlano,
      })),
      totalAssinaturas: assinaturas.length,
    })
  } catch (error: any) {
    console.error('Erro no diagnóstico:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}