'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin, Phone, Mail, Instagram, Clock, ArrowUp, MessageCircle } from 'lucide-react'
import { SOCIAL_LINKS, CONTACT_INFO } from '@/lib/constants'
import GlowText from '@/components/ui/GlowText'

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)
  const isInView = useInView(footerRef, { once: true, margin: '-50px' })
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openWhatsApp = () => {
    const message = encodeURIComponent('Olá! Vim pelo site e gostaria de mais informações.')
    window.open(`https://wa.me/${SOCIAL_LINKS.whatsapp}?text=${message}`, '_blank')
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer ref={footerRef} className="relative bg-gradient-to-b from-bg-secondary to-bg-primary pt-20 pb-8 overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-primary/30 to-transparent" />

      <div className="container-custom">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6">
              <img
                src="/brand/logo.png"
                alt="Miguelzin Du Corte"
                className="h-16 w-auto"
              />
            </div>
            <p className="text-text-secondary mb-6 leading-relaxed">
              Transformando visual e elevando a confiança masculina desde 2024.
              Especialistas em cortes modernos e clássicos.
            </p>
            <div className="flex gap-3">
              <motion.a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white border border-accent-primary/20 flex items-center justify-center text-accent-primary hover:bg-accent-primary hover:text-white hover:border-accent-primary transition-all duration-300 shadow-sm"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
              <motion.a
                href={`https://wa.me/${SOCIAL_LINKS.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white border border-accent-primary/20 flex items-center justify-center text-accent-primary hover:bg-accent-primary hover:text-white hover:border-accent-primary transition-all duration-300 shadow-sm"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h4 className="font-display text-lg font-bold text-text-primary mb-6">
              Links Rápidos
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Início', href: '#' },
                { label: 'Serviços', href: '#servicos' },
                { label: 'Galeria', href: '#galeria' },
                { label: 'Agendar', href: '/agendar' },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-text-secondary hover:text-accent-primary transition-colors duration-300 inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-accent-primary transition-all duration-300" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h4 className="font-display text-lg font-bold text-text-primary mb-6">
              Serviços
            </h4>
            <ul className="space-y-3">
              {[
                'Corte Clássico',
                'Degradê Navalhado',
                'Barba Completa',
                'Sobrancelha',
                'Pigmentação',
                'Tratamento Capilar'
              ].map((service) => (
                <li key={service}>
                  <span className="text-text-secondary flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-tertiary" />
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h4 className="font-display text-lg font-bold text-text-primary mb-6">
              Contato
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent-primary mt-0.5 flex-shrink-0" />
                <span className="text-text-secondary">
                  Centro<br />
                  Patos de Minas - MG
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent-primary flex-shrink-0" />
                <a
                  href={`https://wa.me/${SOCIAL_LINKS.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-accent-primary transition-colors"
                >
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent-primary flex-shrink-0" />
                <a
                  href={`mailto:${SOCIAL_LINKS.email}`}
                  className="text-text-secondary hover:text-accent-primary transition-colors"
                >
                  {SOCIAL_LINKS.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-accent-primary mt-0.5 flex-shrink-0" />
                <span className="text-text-secondary">
                  Seg - Sáb: 09h - 20h<br />
                  Domingo: Fechado
                </span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Newsletter */}
        <motion.div
          className="mb-12 p-8 rounded-3xl bg-white border border-accent-primary/15 shadow-card-light"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="font-display text-xl font-bold text-text-primary mb-2">
                Fique por dentro
              </h4>
              <p className="text-text-secondary">
                Receba promoções exclusivas e novidades diretamente no seu e-mail.
              </p>
            </div>
            <form className="flex w-full md:w-auto gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="seu@email.com"
                className="flex-1 md:w-64 px-4 py-3 rounded-xl border border-accent-primary/20 bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 transition-all"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-semibold hover:shadow-glow-md transition-all duration-300 whitespace-nowrap"
              >
                Inscrever
              </button>
            </form>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="relative pt-8 border-t border-accent-primary/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-text-muted text-sm text-center md:text-left">
              © {currentYear} <GlowText className="text-sm">Miguelzin Du Corte</GlowText>.
              Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <button
                onClick={openWhatsApp}
                className="text-text-muted hover:text-accent-primary transition-colors"
              >
                Fale Conosco
              </button>
              <a href="#" className="text-text-muted hover:text-accent-primary transition-colors">Privacidade</a>
              <a href="#" className="text-text-muted hover:text-accent-primary transition-colors">Termos</a>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className={`
          fixed bottom-8 right-8 w-12 h-12 rounded-full
          bg-gradient-to-br from-accent-primary to-accent-secondary
          text-white shadow-glow-md flex items-center justify-center
          transition-all duration-300 z-50
          ${showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
        `}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Voltar ao topo"
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    </footer>
  )
}
