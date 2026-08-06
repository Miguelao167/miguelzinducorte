import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const clientes = await prisma.cliente.findMany({
      include: {
        assinaturas: {
          where: { ativa: true },
          include: { plano: true },
        },
      },
      orderBy: { nome: 'asc' },
    })
    return NextResponse.json({ clientes })
  } catch (error) {
    console.error('Erro ao buscar clientes:', error)
    return NextResponse.json({ error: 'Erro ao buscar clientes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nome, telefone, observacoes } = body

    if (!nome || !telefone) {
      return NextResponse.json({ error: 'Nome e telefone são obrigatórios' }, { status: 400 })
    }

    const telefoneLimpo = telefone.replace(/\D/g, '')

    const cliente = await prisma.cliente.upsert({
      where: { telefone: telefoneLimpo },
      update: { nome, observacoes },
      create: { nome, telefone: telefoneLimpo, observacoes },
    })

    return NextResponse.json({ cliente })
  } catch (error) {
    console.error('Erro ao criar cliente:', error)
    return NextResponse.json({ error: 'Erro ao criar cliente' }, { status: 500 })
  }
}
