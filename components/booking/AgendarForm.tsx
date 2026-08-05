'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Phone, Calendar, Clock, MessageSquare, CheckCircle2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import GlowText from '@/components/ui/GlowText'
import { CONTACT_INFO } from '@/lib/constants'

export default function AgendarForm() {
  const searchParams = useSearchParams()
  const tipo = searchParams.get('tipo') === 'plano' ? 'plano' : 'servico'
  const nome = searchParams.get('nome') || ''
  const preco = searchParams.get('preco') || ''

  const [formData, setFormData] = useState({
    nomeCliente: '',
    telefone: '',
    data: '',
    horario: '',
    observacoes: '',
  })
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nomeCliente.trim() || !formData.telefone.trim()) {
      setError('Preencha nome e telefone para continuar.')
      return
    }
    setError('')

    const linhas = [
      `Olá! Gostaria de agendar um horário no Miguelzin Du Corte.`,
      ``,
      nome ? `${tipo === 'plano' ? 'Plano' : 'Serviço'}: ${nome}${preco ? ` (R$ ${preco})` : ''}` : '',
      `Nome: ${formData.nomeCliente}`,
      `Telefone: ${formData.telefone}`,
      formData.data ? `Data de preferência: ${formData.data}` : '',
      formData.horario ? `Horário de preferência: ${formData.horario}` : '',
      formData.observacoes ? `Observações: ${formData.observacoes}` : '',
    ].filter(Boolean)

    const message = encodeURIComponent(linhas.join('\n'))
    setSubmitted(true)
    window.open(`https://wa.me/${CONTACT_INFO.whatsapp}?text=${message}`, '_blank')
  }

  return (
    <section className="relative py-32 md:py-40">
      <div className="relative z-10 container-custom max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-accent-primary transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para o site
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-accent-primary text-sm font-mono tracking-widest uppercase mb-4 font-semibold">
            Agendamento
          </span>
          <h1 className="font-display text-3xl md:text-5xl font-bold mb-4 text-text-primary">
            <span className="text-text-primary">Confirme seus</span> <GlowText>Dados</GlowText>
          </h1>

          {nome ? (
            <p className="text-text-secondary text-lg mb-10">
              Você está agendando: <span className="font-semibold text-text-primary">{nome}</span>
              {preco && <span className="text-accent-primary font-semibold"> — R$ {preco}</span>}
            </p>
          ) : (
            <p className="text-text-secondary text-lg mb-10">
              Preencha seus dados e horário de preferência.
            </p>
          )}

          <form
            onSubmit={handleSubmit}
            className="p-8 md:p-10 rounded-3xl bg-white border border-accent-primary/15 shadow-card-light space-y-6"
          >
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-2">
                <User className="w-4 h-4 text-accent-primary" />
                Nome completo
              </label>
              <input
                type="text"
                name="nomeCliente"
                value={formData.nomeCliente}
                onChange={handleChange}
                placeholder="Seu nome"
                className="w-full px-4 py-3 rounded-xl border border-accent-primary/20 bg-bg-secondary/50 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/40 transition-all"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-2">
                <Phone className="w-4 h-4 text-accent-primary" />
                Telefone / WhatsApp
              </label>
              <input
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(34) 99999-9999"
                className="w-full px-4 py-3 rounded-xl border border-accent-primary/20 bg-bg-secondary/50 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/40 transition-all"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-2">
                  <Calendar className="w-4 h-4 text-accent-primary" />
                  Data de preferência
                </label>
                <input
                  type="date"
                  name="data"
                  value={formData.data}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-accent-primary/20 bg-bg-secondary/50 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/40 transition-all"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-2">
                  <Clock className="w-4 h-4 text-accent-primary" />
                  Horário de preferência
                </label>
                <input
                  type="time"
                  name="horario"
                  value={formData.horario}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-accent-primary/20 bg-bg-secondary/50 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/40 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-2">
                <MessageSquare className="w-4 h-4 text-accent-primary" />
                Observações (opcional)
              </label>
              <textarea
                name="observacoes"
                value={formData.observacoes}
                onChange={handleChange}
                rows={3}
                placeholder="Alguma preferência ou detalhe extra?"
                className="w-full px-4 py-3 rounded-xl border border-accent-primary/20 bg-bg-secondary/50 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/40 transition-all resize-none"
              />
            </div>

            <p className="text-xs text-text-muted">
              Atendemos {CONTACT_INFO.hours.weekdays} · {CONTACT_INFO.hours.weekend} · {CONTACT_INFO.hours.closed}
            </p>

            {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

            {submitted && (
              <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                Abrimos o WhatsApp com seus dados preenchidos. É só enviar a mensagem!
              </div>
            )}

            <Button type="submit" size="lg" className="w-full">
              Confirmar e enviar pelo WhatsApp
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
