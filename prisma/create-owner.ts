import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2] || 'owner@miguelzinducorte.com'
  const password = process.argv[3] || 'senha123'
  const name = process.argv[4] || 'Miguelzin'

  console.log(`Criando usuário owner...`)
  console.log(`Email: ${email}`)
  console.log(`Nome: ${name}`)

  // Verificar se já existe
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    console.log('Usuário já existe! Atualizando senha...')
    const hashedPassword = await bcrypt.hash(password, 10)
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword, name }
    })
    console.log('Senha atualizada com sucesso!')
  } else {
    const hashedPassword = await bcrypt.hash(password, 10)
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'owner'
      }
    })
    console.log('Usuário criado com sucesso!')
  }
}

main()
  .catch((e) => {
    console.error('Erro:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
