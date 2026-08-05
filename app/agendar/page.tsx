import { Suspense } from 'react'
import { Navbar, Footer } from '@/components/layout'
import AgendarForm from '@/components/booking/AgendarForm'

export const metadata = {
  title: 'Agendar Horário | Miguelzin Du Corte',
  description: 'Preencha seus dados e horário de preferência para agendar seu atendimento na Miguelzin Du Corte.',
}

export default function AgendarPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white via-bg-secondary/50 to-white">
      <Navbar />
      <Suspense fallback={null}>
        <AgendarForm />
      </Suspense>
      <Footer />
    </main>
  )
}
