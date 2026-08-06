import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth-helper'
import FinanceiroDashboard from './FinanceiroDashboard'

export const metadata: Metadata = {
  title: 'Financeiro | Miguelzin Du Corte',
}

export const dynamic = 'force-dynamic'

export default async function FinanceiroPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/owner/login')
  }

  return <FinanceiroDashboard user={user} />
}