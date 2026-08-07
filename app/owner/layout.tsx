import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Painel | Miguelzin Du Corte',
}

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen bg-gradient-to-br from-bg-secondary via-white to-bg-tertiary">{children}</div>
}
