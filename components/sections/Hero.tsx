'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { ChevronDown, Play, Scissors, Sparkles } from 'lucide-react'
import Button from '@/components/ui/Button'
import GlowText from '@/components/ui/GlowText'
import { cn } from '@/lib/utils'

const SUBTITLES = [
  'Onde cada corte é uma obra-prima. Grooming elevado a um ritual de excelência.',
  'Cada movimento é calculado. Cada detalhe importa.',
  'Transformamos complexidade em simplicidade elegante.',
  'Mais que um corte. Uma experiência completa.',
]

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [titleIndex, setTitleIndex] = useState(0)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])
  
  const springY = useSpring(y, { stiffness: 100, damping: 30 })

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isLoaded) return
    
    const interval = setInterval(() => {
      setTitleIndex(prev => (prev + 1) % (SUBTITLES.length))
    }, 3000)
    
    return () => clearInterval(interval)
  }, [isLoaded])

  const scrollToServices = () => {
    document.getElementById('servicos')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToGallery = () => {
    document.getElementById('galeria')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-bg-secondary to-white"
      style={{ opacity, scale }}
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-accent-primary/8 blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent-tertiary/10 blur-[100px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 102, 204, 0.3) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(0, 102, 204, 0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating decorative shapes */}
        <motion.div
          className="absolute top-32 right-32 w-32 h-32 rounded-full border-2 border-accent-primary/15"
          animate={{ y: [-15, 15, -15], rotate: [0, 180, 360] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-32 left-32 w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-primary/10 to-accent-tertiary/10 backdrop-blur-sm"
          animate={{ y: [20, -20, 20], rotate: [0, -180, -360] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Content */}
      <motion.div
        style={{ y: springY }}
        className="relative z-10 container-custom text-center"
      >
        {/* Logo Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-accent-primary/20 shadow-card-light"
            whileHover={{ scale: 1.05 }}
          >
            <motion.span
              className="w-2 h-2 rounded-full bg-accent-tertiary"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm font-medium text-text-secondary">Barbearia em Patos de Minas</span>
          </motion.div>
        </motion.div>

        {/* Logo Grande */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 flex justify-center"
        >
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            {/* Glow behind logo */}
            <div className="absolute inset-0 bg-accent-primary/20 blur-3xl rounded-full" />
            
            {/* Big logo text */}
            <div className="relative flex flex-col items-center">
              <h1 className="font-display font-black text-6xl md:text-8xl lg:text-9xl tracking-tighter leading-none">
                <span className="block bg-gradient-to-br from-accent-tertiary via-accent-primary to-accent-secondary bg-clip-text text-transparent">
                  MIGUELZIN
                </span>
              </h1>
              <div className="relative mt-2">
                <span className="font-display font-black text-3xl md:text-5xl tracking-tight text-text-primary">
                  DU CORTE
                </span>
                <motion.span
                  className="absolute -right-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-accent-tertiary to-accent-primary flex items-center justify-center shadow-glow-md"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                >
                  <Scissors className="w-5 h-5 text-white" />
                </motion.span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Animated Subtitle */}
        <motion.div
          className="max-w-2xl mx-auto mb-12 h-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={titleIndex}
              initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              exit={{ opacity: 0, filter: 'blur(10px)', y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-lg md:text-xl text-text-secondary leading-relaxed"
            >
              {SUBTITLES[titleIndex]}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="relative group"
          >
            {/* Glow ring */}
            <span className="absolute -inset-1 bg-gradient-to-r from-accent-tertiary via-accent-primary to-accent-secondary rounded-lg opacity-30 blur-md group-hover:opacity-60 transition-opacity duration-500" />
            <Button size="xl" onClick={scrollToServices}>
              Agendar Agora
            </Button>
          </motion.div>
          
          <Button
            variant="secondary"
            size="xl"
            onClick={scrollToGallery}
            leftIcon={<Play className="w-5 h-5" />}
          >
            Ver Trabalhos
          </Button>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          className="mt-20 flex flex-wrap items-center justify-center gap-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          {[
            { value: '2+', label: 'Anos de experiência' },
            { value: '200+', label: 'Clientes satisfeitos' },
            { value: '100%', label: 'Satisfação garantida' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 + index * 0.1 }}
            >
              <div className="font-display text-3xl md:text-4xl font-bold gradient-text">
                {stat.value}
              </div>
              <div className="text-sm text-text-muted mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2 cursor-pointer"
          onClick={scrollToServices}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-xs text-text-muted uppercase tracking-widest font-medium">Scroll</span>
          <ChevronDown className="w-5 h-5 text-accent-primary" />
        </motion.div>
      </motion.div>

      {/* Decorative corner elements */}
      <div className="absolute top-20 left-10 w-20 h-20 border-l-2 border-t-2 border-accent-primary/25" />
      <div className="absolute top-20 right-10 w-20 h-20 border-r-2 border-t-2 border-accent-primary/25" />
      <div className="absolute bottom-20 left-10 w-20 h-20 border-l-2 border-b-2 border-accent-primary/25" />
      <div className="absolute bottom-20 right-10 w-20 h-20 border-r-2 border-b-2 border-accent-primary/25" />
    </motion.section>
  )
}
