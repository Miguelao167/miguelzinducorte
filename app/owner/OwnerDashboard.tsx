'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Clock,
  Phone,
  User,
  MessageSquare,
  Check,
  X,
  RefreshCw,
  Trash2,
  LogOut,
  ChevronDown,
  Filter,
  DollarSign,
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'

interface OwnerUser {
  id: string
  email: string
  name: string
}

interface Agendamento {
  id: string
  nomeCliente: string
  telefone: string
  servico: string | null
  preco: string | null
  dataPreferida: string | null
  horario: string | null
  observacoes: string | null
  status: string
  pago: boolean
  valorPago: number | null
  createdAt: string
}

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  pendente: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  confirmado: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  cancelado: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  concluido: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
}

const statusLabels: Record<string, string> = {
  pendente: 'Pendente',
  confirmado: 'Confirmado',
  cancelado: 'Cancelado',
  concluido: 'Concluído',
}

export default function OwnerDashboard({ user }: { user: OwnerUser }) {
  const router = useRouter()
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'todos' | 'pendente' | 'confirmado' | 'cancelado' | 'concluido'>('todos')
  const [selectedAgendamento, setSelectedAgendamento] = useState<Agendamento | null>(null)

  const fetchAgendamentos = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/agendamentos')
      if (!res.ok) throw new Error('Erro ao carregar')
      const data = await res.json()
      setAgendamentos(data)
    } catch (err) {
      setError('Erro ao carregar agendamentos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAgendamentos()
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/owner/login')
    router.refresh()
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/agendamentos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        setAgendamentos((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status } : a))
        )
        setSelectedAgendamento(null)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const deleteAgendamento = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este agendamento?')) return
    try {
      const res = await fetch(`/api/agendamentos/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setAgendamentos((prev) => prev.filter((a) => a.id !== id))
        setSelectedAgendamento(null)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const marcarComoPago = async (id: string, valor: string) => {
    const valorNum = parseFloat(valor)
    if (isNaN(valorNum) || valorNum <= 0) {
      alert('Digite um valor válido')
      return
    }
    const metodo = prompt('Método de pagamento (dinheiro, pix, cartao):', 'pix') || 'manual'
    try {
      const res = await fetch('/api/financeiro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agendamentoId: id,
          valor: valorNum,
          metodoPagamento: metodo,
        }),
      })
      if (res.ok) {
        setAgendamentos((prev) =>
          prev.map((a) =>
            a.id === id ? { ...a, pago: true, valorPago: valorNum, metodoPagamento: metodo } : a
          )
        )
      }
    } catch (err) {
      console.error(err)
    }
  }

  const filteredAgendamentos = agendamentos.filter((a) =>
    filter === 'todos' ? true : a.status === filter
  )

  const stats = {
    total: agendamentos.length,
    pendente: agendamentos.filter((a) => a.status === 'pendente').length,
    confirmado: agendamentos.filter((a) => a.status === 'confirmado').length,
    concluido: agendamentos.filter((a) => a.status === 'concluido').length,
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-32 pb-12 bg-gradient-to-br from-white via-bg-secondary/50 to-white">
        <div className="container-custom max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div className="flex-shrink-0">
              <h1 className="text-2xl md:text-3xl font-bold text-text-primary whitespace-nowrap">
                Painel de Agendamentos
              </h1>
              <p className="text-text-secondary mt-1">
                Olá, {user.name || user.email}! Gerencie os agendamentos da barbearia.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href="/owner/financeiro"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-accent-primary hover:bg-accent-secondary rounded-lg transition-colors whitespace-nowrap"
              >
                <DollarSign className="w-4 h-4" />
                Financeiro
              </a>
              <a
                href="/owner/cobrancas"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-text-secondary hover:text-accent-primary transition-colors border border-accent-primary/20 rounded-lg hover:bg-accent-light/50 whitespace-nowrap"
              >
                Cobranças
              </a>
              <a
                href="/owner/configuracoes"
                className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-medium text-text-secondary hover:text-accent-primary transition-colors border border-accent-primary/20 rounded-lg hover:bg-accent-light/50 whitespace-nowrap"
              >
                Configurações
              </a>
              <button
                onClick={fetchAgendamentos}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-text-secondary hover:text-accent-primary transition-colors border border-accent-primary/20 rounded-lg hover:bg-accent-light/50 whitespace-nowrap"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Atualizar</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors border border-red-200 rounded-lg hover:bg-red-50 whitespace-nowrap"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total', value: stats.total, color: 'text-text-primary' },
              { label: 'Pendentes', value: stats.pendente, color: 'text-yellow-600' },
              { label: 'Confirmados', value: stats.confirmado, color: 'text-green-600' },
              { label: 'Concluídos', value: stats.concluido, color: 'text-blue-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-6 md:p-8 border border-accent-primary/10 shadow-sm">
                <div className={`text-4xl md:text-5xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-base md:text-lg text-text-secondary mt-2 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <Filter className="w-4 h-4 text-text-secondary" />
            {(['todos', 'pendente', 'confirmado', 'cancelado', 'concluido'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  filter === f
                    ? 'bg-accent-primary text-white'
                    : 'bg-white text-text-secondary hover:bg-accent-light/50 border border-accent-primary/20'
                }`}
              >
                {f === 'todos' ? 'Todos' : statusLabels[f]}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-3 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin" />
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredAgendamentos.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-accent-primary/10">
              <Calendar className="w-12 h-12 text-text-muted mx-auto mb-3" />
              <p className="text-text-secondary">Nenhum agendamento encontrado</p>
              <p className="text-text-muted text-sm mt-1">Os clientes podem fazer agendamentos pelo site</p>
            </div>
          )}

          {/* Agendamentos List */}
          {!loading && filteredAgendamentos.length > 0 && (
            <div className="space-y-4">
              {filteredAgendamentos.map((agendamento) => {
                const colors = statusColors[agendamento.status] || statusColors.pendente
                return (
                  <motion.div
                    key={agendamento.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-white rounded-xl border ${colors.border} shadow-sm overflow-hidden`}
                  >
                    <div
                      className="p-4 cursor-pointer"
                      onClick={() => setSelectedAgendamento(
                        selectedAgendamento?.id === agendamento.id ? null : agendamento
                      )}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colors.bg} ${colors.text}`}>
                              {statusLabels[agendamento.status]}
                            </span>
                            {agendamento.servico && (
                              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-accent-light/50 text-accent-primary">
                                {agendamento.servico}
                              </span>
                            )}
                            {agendamento.pago && (
                              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-50 text-green-700 flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                Pago
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-text-primary flex items-center gap-2">
                            <User className="w-4 h-4 text-text-muted" />
                            {agendamento.nomeCliente}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-text-secondary">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5" />
                              {agendamento.telefone}
                            </span>
                            {agendamento.dataPreferida && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {agendamento.dataPreferida}
                              </span>
                            )}
                            {agendamento.horario && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {agendamento.horario}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 text-text-muted transition-transform ${
                            selectedAgendamento?.id === agendamento.id ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {selectedAgendamento?.id === agendamento.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-gray-100"
                        >
                          <div className="p-4 bg-gray-50 space-y-3">
                            {agendamento.preco && (
                              <div className="text-sm">
                                <span className="text-text-muted">Preço: </span>
                                <span className="font-medium text-accent-primary">R$ {agendamento.preco}</span>
                              </div>
                            )}
                            {agendamento.pago && agendamento.valorPago && (
                              <div className="text-sm flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                                <DollarSign className="w-4 h-4 text-green-600" />
                                <span className="text-green-700 font-medium">
                                  Pago: R$ {agendamento.valorPago.toFixed(2)}
                                </span>
                              </div>
                            )}
                            {agendamento.observacoes && (
                              <div className="text-sm">
                                <span className="text-text-muted flex items-center gap-1 mb-1">
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  Observações:
                                </span>
                                <p className="text-text-primary bg-white p-3 rounded-lg border border-gray-200">
                                  {agendamento.observacoes}
                                </p>
                              </div>
                            )}
                            <div className="text-xs text-text-muted">
                              Criado em: {formatDate(agendamento.createdAt)}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200">
                              <span className="text-xs text-text-muted w-full mb-1">Alterar status:</span>
                              {!agendamento.pago && (
                                <button
                                  onClick={() => {
                                    const valor = prompt(
                                      `Valor recebido (padrão R$ ${agendamento.preco || '0'}):`,
                                      agendamento.preco || ''
                                    )
                                    if (valor) marcarComoPago(agendamento.id, valor)
                                  }}
                                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
                                >
                                  <DollarSign className="w-3.5 h-3.5" />
                                  Marcar como Pago
                                </button>
                              )}
                              {agendamento.status !== 'confirmado' && (
                                <button
                                  onClick={() => updateStatus(agendamento.id, 'confirmado')}
                                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  Confirmar
                                </button>
                              )}
                              {agendamento.status !== 'concluido' && (
                                <button
                                  onClick={() => updateStatus(agendamento.id, 'concluido')}
                                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  Concluir
                                </button>
                              )}
                              {agendamento.status !== 'cancelado' && (
                                <button
                                  onClick={() => updateStatus(agendamento.id, 'cancelado')}
                                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  Cancelar
                                </button>
                              )}
                              <button
                                onClick={() => deleteAgendamento(agendamento.id)}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors ml-auto"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Excluir
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
