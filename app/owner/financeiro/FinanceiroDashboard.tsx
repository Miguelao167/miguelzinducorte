'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Wallet,
  ArrowUpRight,
  Check,
  RefreshCw,
  LogOut,
  X,
  QrCode,
  ArrowLeft,
  CreditCard,
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'

interface OwnerUser {
  id: string
  email: string
  name: string
}

interface AgendamentoPago {
  id: string
  nomeCliente: string
  servico: string | null
  valorPago: number | null
  metodoPagamento: string | null
  createdAt: string
}

const metodoPagamentoLabels: Record<string, string> = {
  manual: 'Dinheiro',
  dinheiro: 'Dinheiro',
  pix: 'PIX',
  pix_direto: 'PIX Direto',
  pix_mercadopago: 'PIX',
  cartao: 'Cartão',
}

export default function FinanceiroDashboard({ user }: { user: OwnerUser }) {
  const router = useRouter()
  const [agendamentosPagos, setAgendamentosPagos] = useState<AgendamentoPago[]>([])
  const [loading, setLoading] = useState(true)
  const [mesSelecionado, setMesSelecionado] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
  const [showTodos, setShowTodos] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/financeiro')
      if (res.ok) {
        const json = await res.json()
        setAgendamentosPagos(json.agendamentosPagos || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/owner/login')
    router.refresh()
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
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

  // Filtrar pagamentos do mês selecionado
  const pagamentosDoMes = agendamentosPagos.filter((p) => {
    const data = new Date(p.createdAt)
    const [ano, mes] = mesSelecionado.split('-').map(Number)
    return data.getFullYear() === ano && data.getMonth() + 1 === mes
  })

  const totalDoMes = pagamentosDoMes.reduce((acc, p) => acc + (p.valorPago || 0), 0)

  const totalGeral = agendamentosPagos.reduce((acc, p) => acc + (p.valorPago || 0), 0)

  const quantidadeDoMes = pagamentosDoMes.length

  const ticketMedio = quantidadeDoMes > 0 ? totalDoMes / quantidadeDoMes : 0

  // Agrupar pagamentos por dia
  const pagamentosPorDia = pagamentosDoMes.reduce((acc: Record<string, AgendamentoPago[]>, p) => {
    const dia = new Date(p.createdAt).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
    })
    if (!acc[dia]) acc[dia] = []
    acc[dia].push(p)
    return acc
  }, {})

  // Gerar opções de meses (últimos 12 meses)
  const opcoesMeses = Array.from({ length: 12 }, (_, i) => {
    const data = new Date()
    data.setMonth(data.getMonth() - i)
    const value = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`
    const label = data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    return { value, label: label.charAt(0).toUpperCase() + label.slice(1) }
  })

  const nomeMes = opcoesMeses.find(m => m.value === mesSelecionado)?.label || ''

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-white via-bg-secondary/50 to-white">
        <div className="container-custom max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-text-primary flex items-center gap-2">
                <DollarSign className="w-8 h-8 text-accent-primary" />
                Financeiro
              </h1>
              <p className="text-text-secondary mt-1">
                Acompanhe seu faturamento
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href="/owner"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary hover:text-accent-primary transition-colors border border-accent-primary/20 rounded-lg hover:bg-accent-light/50"
              >
                <ArrowLeft className="w-4 h-4" />
                Agendamentos
              </a>
              <a
                href="/owner/cobrancas"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-accent-primary hover:bg-accent-secondary rounded-lg transition-colors"
              >
                <QrCode className="w-4 h-4" />
                Cobranças
              </a>
              <button
                onClick={fetchData}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary hover:text-accent-primary transition-colors border border-accent-primary/20 rounded-lg hover:bg-accent-light/50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors border border-red-200 rounded-lg hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          </div>

          {/* Cards de Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-accent-primary to-accent-secondary rounded-2xl p-6 text-white"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 text-sm">Total do Mês</span>
                <Calendar className="w-5 h-5 text-white/80" />
              </div>
              <div className="text-3xl font-bold">
                {formatCurrency(totalDoMes)}
              </div>
              <div className="text-white/70 text-sm mt-1">
                {nomeMes}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 border border-accent-primary/10 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-text-secondary text-sm">Atendimentos</span>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-text-primary">
                {quantidadeDoMes}
              </div>
              <div className="text-text-muted text-sm mt-1">
                Pagamentos no mês
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 border border-accent-primary/10 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-text-secondary text-sm">Ticket Médio</span>
                <Wallet className="w-5 h-5 text-accent-primary" />
              </div>
              <div className="text-3xl font-bold text-accent-primary">
                {formatCurrency(ticketMedio)}
              </div>
              <div className="text-text-muted text-sm mt-1">
                Por atendimento
              </div>
            </motion.div>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-2xl border border-accent-primary/10 shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <label className="text-sm font-semibold text-text-primary">
                Selecione o mês:
              </label>
              <select
                value={mesSelecionado}
                onChange={(e) => setMesSelecionado(e.target.value)}
                className="px-4 py-2 rounded-xl border border-accent-primary/20 bg-bg-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary/40"
              >
                {opcoesMeses.map((mes) => (
                  <option key={mes.value} value={mes.value}>
                    {mes.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowTodos(!showTodos)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  showTodos
                    ? 'bg-accent-primary text-white'
                    : 'bg-bg-secondary text-text-secondary hover:bg-accent-light'
                }`}
              >
                {showTodos ? 'Mostrar por Mês' : 'Mostrar Todos'}
              </button>
            </div>
          </div>

          {/* Lista de Pagamentos do Mês */}
          {loading && (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-3 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin" />
            </div>
          )}

          {!loading && (showTodos ? agendamentosPagos : pagamentosDoMes).length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-accent-primary/10">
              <DollarSign className="w-12 h-12 text-text-muted mx-auto mb-3" />
              <p className="text-text-secondary">Nenhum pagamento registrado neste período</p>
              <p className="text-text-muted text-sm mt-1">
                Os pagamentos aparecerão aqui quando forem confirmados
              </p>
            </div>
          )}

          {!loading && (showTodos ? agendamentosPagos : pagamentosDoMes).length > 0 && (
            <div className="bg-white rounded-2xl border border-accent-primary/10 shadow-sm overflow-hidden">
              {/* Cabeçalho */}
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-text-primary">
                  {showTodos ? 'Todos os Pagamentos' : `Pagamentos de ${nomeMes}`}
                </h2>
                <p className="text-sm text-text-secondary mt-1">
                  {showTodos
                    ? `${agendamentosPagos.length} pagamentos • Total: ${formatCurrency(totalGeral)}`
                    : `${quantidadeDoMes} pagamentos • Total: ${formatCurrency(totalDoMes)}`
                  }
                </p>
              </div>

              {/* Pagamentos agrupados por dia */}
              <div className="divide-y divide-gray-100">
                {Object.entries(
                  (showTodos ? agendamentosPagos : pagamentosDoMes).reduce(
                    (acc: Record<string, AgendamentoPago[]>, p) => {
                      const dia = new Date(p.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })
                      if (!acc[dia]) acc[dia] = []
                      acc[dia].push(p)
                      return acc
                    },
                    {}
                  )
                ).map(([dia, pagamentos]) => {
                  const totalDia = pagamentos.reduce((acc, p) => acc + (p.valorPago || 0), 0)
                  return (
                    <div key={dia} className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-text-primary">{dia}</h3>
                        <span className="font-bold text-accent-primary">
                          {formatCurrency(totalDia)}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {pagamentos.map((pag) => (
                          <div
                            key={pag.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-green-50/30 border border-green-200"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                <Check className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <div className="font-medium text-text-primary">
                                  {pag.nomeCliente}
                                </div>
                                <div className="text-xs text-text-secondary flex items-center gap-2">
                                  {pag.servico && <span>{pag.servico}</span>}
                                  <span className="flex items-center gap-1">
                                    {pag.metodoPagamento === 'pix_direto' || pag.metodoPagamento === 'pix' || pag.metodoPagamento === 'pix_mercadopago' ? (
                                      <>💰 PIX</>
                                    ) : pag.metodoPagamento === 'cartao' ? (
                                      <><CreditCard className="w-3 h-3" /> Cartão</>
                                    ) : (
                                      <>💵 {metodoPagamentoLabels[pag.metodoPagamento || 'manual']}</>
                                    )}
                                  </span>
                                  <span>· {new Date(pag.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-lg font-bold text-green-600">
                              {formatCurrency(pag.valorPago || 0)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}