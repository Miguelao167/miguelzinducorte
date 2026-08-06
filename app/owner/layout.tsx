import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login | Miguelzin Du Corte',
}

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-secondary via-white to-bg-tertiary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}