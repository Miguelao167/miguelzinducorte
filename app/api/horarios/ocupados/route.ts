import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar horários já agendados para uma data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const data = searchParams.get('data')

    if (!data) {
      return NextResponse.json({ error: 'Data é obrigatória' }, { status: 400 })
    }

    // Buscar agendamentos não cancelados dessa data
    const agendamentos = await prisma.agendamento.findMany({
      where: {
        dataPreferida: data,
        status: { not: 'cancelado' }
      },
      select: {
        id: true,
        horario: true,
        status: true,
      },
    })

    const horariosOcupados = agendamentos
      .filter(a => a.horario)
      .map(a => a.horario)

    return NextResponse.json({ horariosOcupados })
  } catch (error) {
    console.error('Erro ao buscar horários:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}