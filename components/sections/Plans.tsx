'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { Crown, Check } from 'lucide-react'
import GlowText from '@/components/ui/GlowText'
import { PLANS } from '@/lib/constants'

export default function Plans() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section
      id="planos"
      ref={sectionRef}
      className="relative py-32 overflow-hidden bg-gradient-to-b from-white via-bg-secondary/50 to-white"
    >
      <div className="relative z-10 container-custom">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block text-accent-primary text-sm font-mono tracking-widest uppercase mb-4 font-semibold">
            Assinaturas
          </span>

          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6 text-text-primary">
            <span className="text-text-primary">Nossos</span> <GlowText>Planos</GlowText>
          </h2>

          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Assine um plano mensal e economize em cada visita.
          </p>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {PLANS.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.12 }}
              whileHover={{ y: -6 }}
              className={`relative flex flex-col p-8 rounded-3xl border transition-shadow duration-500 ${
                plan.popular
                  ? 'bg-gradient-to-b from-accent-primary/5 to-white border-accent-primary/40 shadow-glow-sm'
                  : 'bg-white border-accent-primary/15 shadow-card-light hover:shadow-card-light-hover'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-accent-tertiary to-accent-primary rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-glow-sm">
                  <Crown className="w-3.5 h-3.5" />
                  Mais Popular
                </div>
              )}

              <span className="text-xs font-bold tracking-widest uppercase text-accent-primary mb-2">
                Plano
              </span>
              <h3 className="font-display text-2xl lg:text-3xl font-bold text-text-primary mb-4">
                {plan.name}
              </h3>

              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-display text-3xl lg:text-4xl font-bold gradient-text">
                  R$ {plan.price.toFixed(2).replace('.', ',')}
                </span>
              </div>
              <span className="text-text-muted text-sm mb-6">/mês</span>

              <div className="space-y-2 mb-6 flex-1">
                {plan.inclui.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-accent-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-accent-primary" />
                    </div>
                    <span className="text-text-secondary text-sm leading-relaxed">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-text-muted text-xs mb-6">{plan.validity}</p>

              <Link
                href={`/agendar?tipo=plano&nome=${encodeURIComponent(plan.name)}&preco=${plan.price}&cortes=${plan.numeroCortes}&desc=${encodeURIComponent(plan.description)}`}
                className={`inline-flex items-center justify-center w-full px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                  plan.popular ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                Assinar
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
