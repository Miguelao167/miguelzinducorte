'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { Scissors, Sparkles, Eye, Syringe, Footprints } from 'lucide-react'
import GlowText from '@/components/ui/GlowText'
import Button from '@/components/ui/Button'
import { SERVICES } from '@/lib/constants'

const ICONS: Record<string, React.ElementType> = {
  scissors: Scissors,
  beard: Sparkles,
  combo: Sparkles,
  eyebrow: Eye,
  pigment: Syringe,
  footline: Footprints,
  comboEyebrow: Eye,
  comboPigment: Syringe,
}

export default function Services() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section
      id="servicos"
      ref={sectionRef}
      className="relative py-32 overflow-hidden bg-gradient-to-b from-white via-bg-secondary to-white"
    >
      {/* Decorative elements */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent-primary/5 rounded-full blur-[120px] pointer-events-none"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="relative z-10 container-custom">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            className="inline-block text-accent-primary text-sm font-mono tracking-widest uppercase mb-4 font-semibold"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            Nossos Serviços
          </motion.span>

          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6 text-text-primary">
            <GlowText>O que</GlowText>{' '}
            <span className="text-text-primary">Oferecemos</span>
          </h2>

          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Cada serviço é executado com precisão cirúrgica e atenção aos detalhes.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 lg:gap-6">
          {SERVICES.map((service, index) => {
            const Icon = ICONS[service.icon] || Scissors

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                whileHover={{ y: -6 }}
              >
                <Link
                  href={`/agendar?tipo=servico&nome=${encodeURIComponent(service.title)}&preco=${service.price}`}
                  className="group relative p-6 lg:p-7 rounded-3xl bg-white border border-accent-primary/15 shadow-card-light hover:shadow-card-light-hover transition-shadow duration-500 flex flex-col items-center text-center h-full"
                >
                  <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center shadow-glow-sm mb-5">
                    <Icon className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                  </div>

                  <h3 className="font-display text-base lg:text-xl font-bold text-text-primary mb-3">
                    {service.title}
                  </h3>

                  <span className="font-display text-xl lg:text-2xl font-bold gradient-text mb-4">
                    R$ {service.price.toFixed(2).replace('.', ',')}
                  </span>

                  <span className="mt-auto text-xs font-semibold text-accent-primary uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                    Agendar →
                  </span>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
        >
          <p className="text-text-secondary mb-6">
            Não tem certeza de qual serviço é o ideal para você?
          </p>
          <Button variant="ghost" size="lg">
            Fale Conosco
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
