import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth-helper'
import CobrancasDashboard from './CobrancasDashboard'

export const metadata: Metadata = {
  title: 'Cobranças | Miguelzin Du Corte',
}

export const dynamic = 'force-dynamic'

export default async function CobrancasPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/owner/login')
  }

  return <CobrancasDashboard user={user} />
}