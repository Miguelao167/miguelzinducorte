import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AnimationProvider } from '@/components/providers/AnimationProvider'
import CustomCursor from '@/components/effects/CustomCursor'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Miguelzin Du Corte | Barbearia em Patos de Minas',
  description: 'Onde precisão encontra arte. A melhor barbearia de Patos de Minas com mais de 2 anos de experiência. Cortes clássicos e modernos, barba completa e tratamento premium.',
  keywords: ['barbearia', 'corte masculino', 'barba', 'Patos de Minas', 'premium', 'barbeiro', 'estilo', 'corte clássico'],
  authors: [{ name: 'Miguelzin Du Corte' }],
  creator: 'Miguelzin Du Corte',
  openGraph: {
    title: 'Miguelzin Du Corte | Barbearia Premium',
    description: 'Onde precisão encontra arte. Agende seu horário.',
    siteName: 'Miguelzin Du Corte',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Miguelzin Du Corte | Barbearia Premium',
    description: 'Onde precisão encontra arte.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#050810',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="bg-bg-primary text-text-primary antialiased">
        <AnimationProvider>
          <CustomCursor />
          {children}
        </AnimationProvider>
      </body>
    </html>
  )
}
