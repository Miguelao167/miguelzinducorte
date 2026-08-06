import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// POST /api/setup-admin
// Cria o primeiro usuário owner se ainda não existir nenhum.
// É seguro chamar várias vezes — só cria se o banco estiver vazio.
// Pode ser removido depois do setup inicial.
export async function POST(request: NextRequest) {
  try {
    const count = await prisma.user.count()

    if (count > 0) {
      return NextResponse.json(
        { error: 'Já existe um usuário cadastrado. Setup não permitido.' },
        { status: 403 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const email = body.email || 'owner@miguelzinducorte.com'
    const password = body.password || 'senha123'
    const name = body.name || 'Miguelzin'

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'owner',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Owner criado com sucesso!',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      credentials: {
        email,
        password,
      },
    })
  } catch (error: any) {
    console.error('Erro no setup-admin:', error)
    return NextResponse.json(
      { error: 'Erro ao criar admin: ' + (error.message || 'desconhecido') },
      { status: 500 }
    )
  }
}

// GET - Status do setup
export async function GET() {
  try {
    const count = await prisma.user.count()
    return NextResponse.json({
      needsSetup: count === 0,
      userCount: count,
    })
  } catch (error) {
    return NextResponse.json({ needsSetup: true, userCount: 0 })
  }
}