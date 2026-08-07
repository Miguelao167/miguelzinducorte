import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST - Cria os 4 planos padrão se não existirem
export async function POST() {
  try {
    const planosDefault = [
      { nome: 'Bronze', preco: 84.9, numeroCortes: 4, validadeDias: 30 },
      { nome: 'Prata', preco: 109.9, numeroCortes: 4, validadeDias: 30 },
      { nome: 'Ouro', preco: 134.9, numeroCortes: 999, validadeDias: 30 },
      { nome: 'Prime', preco: 159.9, numeroCortes: 999, validadeDias: 30 },
    ]

    const criados = []
    const jaExistentes = []

    for (const p of planosDefault) {
      // Match exato case-insensitive pra evitar duplicar
      const existe = await prisma.plano.findFirst({
        where: { nome: { equals: p.nome, mode: 'insensitive' } }
      })
      if (existe) {
        jaExistentes.push(existe.nome)
        continue
      }
      const novo = await prisma.plano.create({ data: { ...p, ativo: true } })
      criados.push(novo.nome)
    }

    const todos = await prisma.plano.findMany({ orderBy: { preco: 'asc' } })

    return NextResponse.json({
      criados,
      jaExistentes,
      total: todos.length,
      planos: todos.map(p => ({ id: p.id, nome: p.nome, preco: p.preco, numeroCortes: p.numeroCortes })),
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
