import { Hero, Services, Plans, Gallery, Stats, BookingCTA } from '@/components/sections'
import { Navbar, Footer } from '@/components/layout'
import { GradientMesh } from '@/components/effects'

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background Effects */}
      <GradientMesh />
      
      {/* Navigation */}
      <Navbar />
      
      {/* Sections */}
      <Hero />
      <Services />
      <Plans />
      <Gallery />
      <Stats />
      <BookingCTA />
      <Footer />
    </main>
  )
}
