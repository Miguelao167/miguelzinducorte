import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Painel | Miguelzin Du Corte',
}

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
