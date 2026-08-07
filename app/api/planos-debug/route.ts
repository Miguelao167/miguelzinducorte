import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [planos, agendamentos] = await Promise.all([
      prisma.plano.findMany({ orderBy: { preco: 'asc' } }),
      prisma.agendamento.findMany({
        where: { pago: true },
        orderBy: { createdAt: 'desc' },
        take: 20
      }),
    ])

    const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim()

    const matches = agendamentos.map(ag => {
      const servicoNome = (ag.servico || '').trim()
      const sNorm = norm(servicoNome)

      let match = 'nenhum'
      if (servicoNome) {
        const exato = planos.find(p => norm(p.nome) === sNorm)
        if (exato) {
          match = `exato: ${exato.nome}`
        } else {
          const contem = planos.find(p => {
            const pN = norm(p.nome)
            if (pN.includes('importado') || pN.includes('geral')) return false
            return sNorm.includes(pN) || pN.includes(sNorm)
          })
          if (contem) match = `contem: ${contem.nome}`
        }
      }

      return {
        id: ag.id,
        nomeCliente: ag.nomeCliente,
        servico_bruto: ag.servico,
        servico_normalizado: sNorm,
        isPlano: ag.isPlano,
        match_encontrado: match,
      }
    })

    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      totalPlanos: planos.length,
      planos: planos.map(p => ({
        id: p.id,
        nome_bruto: p.nome,
        nome_normalizado: norm(p.nome),
        preco: p.preco,
        numeroCortes: p.numeroCortes,
      })),
      totalAgendamentosPagos: agendamentos.length,
      agendamentos: matches,
    })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }
}
