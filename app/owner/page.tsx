import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth-helper'
import OwnerDashboard from './OwnerDashboard'

export const metadata: Metadata = {
  title: 'Painel do Owner | Miguelzin Du Corte',
}

export const dynamic = 'force-dynamic'

export default async function OwnerPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/owner/login')
  }

  return <OwnerDashboard user={user} />
}