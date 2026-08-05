'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView, animate } from 'framer-motion'
import { Users, Clock, Star, Heart } from 'lucide-react'
import GlowText from '@/components/ui/GlowText'
import { STATS } from '@/lib/constants'

const ICONS = [Users, Clock, Star, Heart]

function AnimatedNumber({ 
  value, 
  suffix = '', 
  decimals = 0,
  inView 
}: { 
  value: number
  suffix?: string
  decimals?: number
  inView: boolean 
}) {
  const [displayValue, setDisplayValue] = useState(0)
  const previousValue = useRef(0)

  useEffect(() => {
    if (!inView) return

    const controls = animate(previousValue.current, value, {
      duration: 2,
      ease: 'easeOut',
      onUpdate: (latest) => {
        setDisplayValue(latest)
      },
    })

    previousValue.current = value

    return () => controls.stop()
  }, [inView, value])

  const formattedValue = decimals > 0 
    ? displayValue.toFixed(decimals)
    : Math.floor(displayValue).toLocaleString('pt-BR')

  return (
    <span className="tabular-nums">
      {formattedValue}{suffix}
    </span>
  )
}

export default function Stats() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden bg-gradient-to-b from-white via-bg-secondary/50 to-white">
      {/* Animated background lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-accent-primary/25 to-transparent w-full"
            style={{ top: `${20 + i * 15}%` }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
            transition={{ duration: 1.5, delay: i * 0.2 }}
          />
        ))}
      </div>

      <div className="relative z-10 container-custom">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block text-accent-primary text-sm font-mono tracking-widest uppercase mb-4 font-semibold">
            Números
          </span>
          
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6 text-text-primary">
            <span className="text-text-primary">Resultados que</span>{' '}
            <GlowText>Impressionam</GlowText>
          </h2>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, index) => {
            const Icon = ICONS[index] || Star
            
            return (
              <motion.div
                key={stat.label}
                className="relative group"
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                {/* Card */}
                <div className="relative p-8 rounded-3xl bg-white border border-accent-primary/15 overflow-hidden shadow-card-light hover:shadow-card-light-hover transition-shadow duration-500">
                  {/* Icon */}
                  <motion.div
                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center mb-6 shadow-glow-sm"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </motion.div>

                  {/* Number */}
                  <div className="font-display text-5xl md:text-6xl font-bold gradient-text mb-2">
                    <AnimatedNumber
                      value={stat.value}
                      suffix={stat.suffix}
                      inView={isInView}
                    />
                  </div>

                  {/* Label */}
                  <div className="text-text-secondary font-medium">
                    {stat.label}
                  </div>

                  {/* Hover glow */}
                  <div className="absolute -inset-1 rounded-3xl bg-accent-primary/0 group-hover:bg-accent-primary/5 blur-xl transition-colors duration-500 pointer-events-none" />
                </div>

                {/* Decorative number */}
                <div className="absolute -bottom-4 -right-4 font-display text-[120px] font-bold text-accent-primary/[0.04] select-none pointer-events-none">
                  {String(index + 1).padStart(2, '0')}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          <p className="text-text-secondary mb-6">
            Esses números representam nossa dedicação em oferecer o melhor serviço.
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-accent-primary/20 shadow-card-light">
            <motion.span
              className="w-2 h-2 rounded-full bg-green-500"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm text-text-secondary">
              Visitantes hoje: <span className="text-text-primary font-semibold">247</span>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
