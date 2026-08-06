import PlanosPainel from './PlanosPainel'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { jwtVerify } from 'jose'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'miguelzin-du-corte-secret-key-2024'

async function getUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
    })
    return user
  } catch {
    return null
  }
}

export default async function PlanosPage() {
  const user = await getUser()
  if (!user) redirect('/owner/login')

  return <PlanosPainel user={{ id: user.id, email: user.email, name: user.name || '' }} />
}
