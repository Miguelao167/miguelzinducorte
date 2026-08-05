'use client'

import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useInView } from 'framer-motion'
import { Calendar, Clock, ArrowRight, MessageCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import GlowText from '@/components/ui/GlowText'
import { CONTACT_INFO } from '@/lib/constants'

export default function BookingCTA() {
  const router = useRouter()
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const goToBooking = () => {
    router.push('/agendar')
  }

  const openWhatsApp = () => {
    const message = encodeURIComponent('Olá! Gostaria de agendar um horário no Miguelzin Du Corte.')
    window.open(`https://wa.me/${CONTACT_INFO.whatsapp}?text=${message}`, '_blank')
  }

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden bg-gradient-to-br from-white via-bg-secondary/30 to-white">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating orbs */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 rounded-full bg-accent-primary/8 blur-[80px]"
            style={{
              left: `${15 + i * 30}%`,
              top: `${10 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [-30, 30, -30],
              x: [-20, 20, -20],
            }}
            transition={{
              duration: 12 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 102, 204, 1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(0, 102, 204, 1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Light rays from top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px]">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`ray-${i}`}
              className="absolute top-0 left-1/2 w-[2px] h-[400px] bg-gradient-to-b from-accent-primary/30 to-transparent origin-top"
              style={{ transform: `rotate(${i * 30}deg)` }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 container-custom">
        <motion.div
          className="relative max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="relative p-12 md:p-20 rounded-3xl bg-white border border-accent-primary/15 shadow-card-light-hover overflow-hidden">
            {/* Inner decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent-light/50 via-transparent to-accent-light/30" />
            
            {/* Badge */}
            <motion.div
              className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-accent-primary/30 shadow-card-light mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
            >
              <Calendar className="w-4 h-4 text-accent-primary" />
              <span className="text-sm font-medium text-text-secondary">Horários disponíveis esta semana</span>
            </motion.div>

            {/* Main CTA */}
            <motion.h2
              className="relative font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-text-primary"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
            >
              <span className="text-text-primary">Pronto para a</span>
              <br />
              <GlowText className="text-5xl md:text-7xl lg:text-8xl">Transformação?</GlowText>
            </motion.h2>

            <motion.p
              className="relative text-text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
            >
              Agende seu horário agora e experimente o que é verdadeira excelência.
              Seu novo visual está a um clique de distância.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="relative flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
            >
              {/* WhatsApp Button - Primary */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative"
              >
                <Button
                  size="xl"
                  onClick={openWhatsApp}
                  leftIcon={<MessageCircle className="w-6 h-6" />}
                  className="bg-green-600 hover:bg-green-500 shadow-[0_4px_20px_rgba(34,197,94,0.3)]"
                >
                  Agendar pelo WhatsApp
                </Button>
              </motion.div>

              {/* Regular Booking */}
              <Button
                variant="secondary"
                size="xl"
                onClick={goToBooking}
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Ver Horários
              </Button>
            </motion.div>

            {/* Info Cards */}
            <motion.div
              className="relative grid grid-cols-1 md:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
            >
              {[
                {
                  icon: Clock,
                  title: 'Horário Flexível',
                  description: 'Ter-Sáb 9h-20h\nDom 10h-18h',
                },
                {
                  icon: Calendar,
                  title: 'Agendamento Rápido',
                  description: 'Resposta em até 2h',
                },
                {
                  icon: MessageCircle,
                  title: 'Atendimento VIP',
                  description: 'Conta pessoal dedicada',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="p-4 rounded-xl bg-white border border-accent-primary/15 shadow-card-light"
                  whileHover={{ y: -5 }}
                  transition={{ type: 'spring' }}
                >
                  <item.icon className="w-6 h-6 text-accent-primary mx-auto mb-2" />
                  <div className="font-semibold text-text-primary text-sm mb-1">
                    {item.title}
                  </div>
                  <div className="text-xs text-text-muted whitespace-pre-line">
                    {item.description}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
