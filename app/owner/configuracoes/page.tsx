import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth-helper'
import ConfiguracoesPainel from './ConfiguracoesPainel'

export const metadata: Metadata = {
  title: 'Configurações | Miguelzin Du Corte',
}

export const dynamic = 'force-dynamic'

export default async function ConfiguracoesPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/owner/login')
  }

  return <ConfiguracoesPainel user={user} />
}