import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const agendamento = await prisma.agendamento.findUnique({
      where: { id },
    })

    if (!agendamento) {
      return NextResponse.json({ error: 'Agendamento não encontrado' }, { status: 404 })
    }

    return NextResponse.json(agendamento)
  } catch (error) {
    console.error('Erro ao buscar agendamento:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}