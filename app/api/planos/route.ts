import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Não filtra por ativo pra não perder planos antigos sem o campo setado
    const planos = await prisma.plano.findMany({
      orderBy: { preco: 'asc' },
    })
    return NextResponse.json({ planos })
  } catch (error) {
    console.error('Erro ao buscar planos:', error)
    return NextResponse.json({ error: 'Erro ao buscar planos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nome, preco, numeroCortes, validadeDias } = body

    if (!nome || preco == null || !numeroCortes || !validadeDias) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios' }, { status: 400 })
    }

    const plano = await prisma.plano.create({
      data: {
        nome,
        preco: Number(preco),
        numeroCortes: Number(numeroCortes),
        validadeDias: Number(validadeDias),
      },
    })

    return NextResponse.json({ plano })
  } catch (error) {
    console.error('Erro ao criar plano:', error)
    return NextResponse.json({ error: 'Erro ao criar plano' }, { status: 500 })
  }
}
