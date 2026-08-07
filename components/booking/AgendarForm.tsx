'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  User,
  Phone,
  Calendar,
  Clock,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Scissors,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import GlowText from '@/components/ui/GlowText'
import {
  getHorariosForDate,
  getNomeDia,
  getDescricaoHorario,
} from '@/lib/horarios'

export default function AgendarForm() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const tipo = searchParams.get('tipo') === 'plano' ? 'plano' : 'servico'
  const nome = searchParams.get('nome') || ''
  const preco = searchParams.get('preco') || ''
  const cortes = searchParams.get('cortes') || ''
  const desc = searchParams.get('desc') || ''

  const [formData, setFormData] = useState({
    nomeCliente: '',
    telefone: '',
    data: '',
    horario: '',
    observacoes: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([])
  const [horariosOcupados, setHorariosOcupados] = useState<string[]>([])
  const [carregandoHorarios, setCarregandoHorarios] = useState(false)

  // Quando mudar a data, gerar lista de horários
  useEffect(() => {
    if (formData.data) {
      const disponiveis = getHorariosForDate(formData.data)
      setHorariosDisponiveis(disponiveis)
      setFormData(prev => ({ ...prev, horario: '' }))

      // Buscar horários ocupados
      setCarregandoHorarios(true)
      fetch(`/api/horarios/ocupados?data=${formData.data}`)
        .then(r => r.json())
        .then(data => {
          setHorariosOcupados(data.horariosOcupados || [])
        })
        .catch(err => {
          console.error('Erro ao buscar horários:', err)
          setHorariosOcupados([])
        })
        .finally(() => setCarregandoHorarios(false))
    } else {
      setHorariosDisponiveis([])
      setHorariosOcupados([])
    }
  }, [formData.data])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Data mínima = hoje
  const hoje = new Date().toISOString().split('T')[0]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nomeCliente.trim() || !formData.telefone.trim()) {
      setError('Preencha nome e telefone para continuar.')
      return
    }

    if (!formData.data) {
      setError('Escolha uma data para agendar.')
      return
    }

    if (!formData.horario) {
      setError('Escolha um horário disponível.')
      return
    }

    // Verificar se horário ainda está disponível
    if (horariosOcupados.includes(formData.horario)) {
      setError('Este horário acabou de ser ocupado. Escolha outro.')
      return
    }

    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/agendamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomeCliente: formData.nomeCliente,
          telefone: formData.telefone,
          servico: nome || null,
          preco: preco || null,
          dataPreferida: formData.data || null,
          horario: formData.horario || null,
          observacoes: formData.observacoes || null,
          isPlano: tipo === 'plano',
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erro ao salvar')
      }

      setLoading(false)
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Erro ao processar agendamento.')
      setLoading(false)
    }
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
            <div className="mb-10">
              <p className="text-text-secondary text-lg">
                Você está agendando:{' '}
                {tipo === 'plano' && (
                  <span className="inline-block px-3 py-1 mr-2 rounded-full bg-yellow-100 text-yellow-800 text-sm font-semibold">
                    Plano
                  </span>
                )}
                {tipo === 'servico' && (
                  <span className="inline-block px-3 py-1 mr-2 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold">
                    Serviço
                  </span>
                )}
                <span className="font-semibold text-text-primary">{nome}</span>
                {preco && <span className="text-accent-primary font-semibold"> — R$ {preco}</span>}
              </p>
              {tipo === 'plano' && desc && (
                <p className="text-text-muted text-sm mt-2 flex items-center gap-2">
                  <Scissors className="w-4 h-4" />
                  {desc}
                </p>
              )}
            </div>
          ) : (
            <p className="text-text-secondary text-lg mb-10">
              Preencha seus dados e escolha um horário disponível.
            </p>
          )}

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-10 rounded-3xl bg-white border border-green-200 shadow-card-light text-center space-y-6"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary mb-2">
                  Agendamento confirmado!
                </h2>
                <p className="text-text-secondary">
                  Entraremos em contato pelo WhatsApp para confirmar o horário.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent-primary text-white font-semibold hover:bg-accent-secondary transition-colors"
                >
                  Voltar para o site
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false)
                    setFormData({ nomeCliente: '', telefone: '', data: '', horario: '', observacoes: '' })
                    setError('')
                  }}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-accent-primary/20 text-text-secondary font-semibold hover:bg-accent-light/50 transition-colors"
                >
                  Fazer outro agendamento
                </button>
              </div>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="p-8 md:p-10 rounded-3xl bg-white border border-accent-primary/15 shadow-card-light space-y-6"
            >
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}

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
                required
                disabled={loading || submitted}
                className="w-full px-4 py-3 rounded-xl border border-accent-primary/20 bg-bg-secondary/50 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/40 transition-all disabled:opacity-50"
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
                required
                disabled={loading || submitted}
                className="w-full px-4 py-3 rounded-xl border border-accent-primary/20 bg-bg-secondary/50 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/40 transition-all disabled:opacity-50"
              />
            </div>

            {/* Data */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-2">
                <Calendar className="w-4 h-4 text-accent-primary" />
                Data
              </label>
              <input
                type="date"
                name="data"
                value={formData.data}
                onChange={handleChange}
                min={hoje}
                required
                disabled={loading || submitted}
                className="w-full px-4 py-3 rounded-xl border border-accent-primary/20 bg-bg-secondary/50 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/40 transition-all disabled:opacity-50"
              />
              {formData.data && (
                <p className="text-xs text-text-muted mt-2">
                  <strong>{getNomeDia(formData.data)}</strong> · {getDescricaoHorario(formData.data)}
                </p>
              )}
            </div>

            {/* Horários Disponíveis */}
            {formData.data && (
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-2">
                  <Clock className="w-4 h-4 text-accent-primary" />
                  Escolha um horário
                </label>

                {carregandoHorarios ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="w-5 h-5 animate-spin text-accent-primary" />
                    <span className="ml-2 text-sm text-text-secondary">Carregando horários...</span>
                  </div>
                ) : horariosDisponiveis.length === 0 ? (
                  <p className="text-sm text-red-600 p-3 bg-red-50 rounded-lg border border-red-200">
                    Não atendemos neste dia. Por favor escolha outra data.
                  </p>
                ) : (
                  <>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {horariosDisponiveis.map((horario) => {
                        const ocupado = horariosOcupados.includes(horario)
                        const selecionado = formData.horario === horario

                        return (
                          <button
                            key={horario}
                            type="button"
                            disabled={ocupado}
                            onClick={() => setFormData(prev => ({ ...prev, horario }))}
                            className={`px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                              selecionado
                                ? 'bg-accent-primary text-white shadow-md'
                                : ocupado
                                ? 'bg-gray-100 text-gray-400 line-through cursor-not-allowed'
                                : 'bg-bg-secondary text-text-primary hover:bg-accent-light hover:border-accent-primary border border-transparent'
                            }`}
                          >
                            {horario}
                          </button>
                        )
                      })}
                    </div>

                    {/* Legenda */}
                    <div className="flex items-center gap-4 mt-3 text-xs text-text-muted">
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded bg-bg-secondary border border-gray-300"></span>
                        Disponível
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded bg-accent-primary"></span>
                        Selecionado
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded bg-gray-100"></span>
                        Ocupado
                      </span>
                    </div>

                    {horariosOcupados.length > 0 && (
                      <p className="text-xs text-orange-600 mt-2">
                        ⚠️ {horariosOcupados.length} horário(s) já agendado(s) neste dia
                      </p>
                    )}
                  </>
                )}
              </div>
            )}

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
                disabled={loading || submitted}
                className="w-full px-4 py-3 rounded-xl border border-accent-primary/20 bg-bg-secondary/50 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/40 transition-all resize-none disabled:opacity-50"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={loading || submitted}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Salvando...
                </>
              ) : submitted ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Agendamento Confirmado!
                </>
              ) : (
                'Confirmar Agendamento'
              )}
            </Button>
          </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}