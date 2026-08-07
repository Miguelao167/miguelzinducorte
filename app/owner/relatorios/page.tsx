'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Activity } from 'lucide-react'
import OwnerShell from '@/components/owner/OwnerShell'

interface Agendamento {
  id: string
  nomeCliente: string
  servico: string | null
  valorPago: number | null
  status: string
  createdAt: string
}

interface Assinatura {
  id: string
  cortesRestantes: number
  cliente: { nome: string }
  plano: { nome: string; preco: number }
}

export default function RelatoriosPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [assinaturas, setAssinaturas] = useState<Assinatura[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ag, as] = await Promise.all([
          fetch('/api/agendamentos').then((r) => r.json()),
          fetch('/api/assinaturas').then((r) => r.json()),
        ])
        setAgendamentos(Array.isArray(ag) ? ag : [])
        setAssinaturas(as.assinaturas || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Top 5 clientes por gasto
  const gastosPorCliente: Record<string, number> = {}
  agendamentos.forEach((a) => {
    if (a.valorPago) {
      gastosPorCliente[a.nomeCliente] = (gastosPorCliente[a.nomeCliente] || 0) + a.valorPago
    }
  })
  const topClientes = Object.entries(gastosPorCliente)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  // Serviços mais populares
  const servicosCount: Record<string, number> = {}
  agendamentos.forEach((a) => {
    if (a.servico) {
      servicosCount[a.servico] = (servicosCount[a.servico] || 0) + 1
    }
  })
  const topServicos = Object.entries(servicosCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
  const maxServicoCount = Math.max(...Object.values(servicosCount), 1)

  // Atendimentos por mês (últimos 6)
  const ultimos6Meses: { label: string; count: number; receita: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const label = d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')
    ultimos6Meses.push({ label, count: 0, receita: 0 })
  }
  agendamentos.forEach((a) => {
    const data = new Date(a.createdAt)
    const mesesAtras =
      (new Date().getFullYear() - data.getFullYear()) * 12 +
      (new Date().getMonth() - data.getMonth())
    if (mesesAtras >= 0 && mesesAtras < 6) {
      const entry = ultimos6Meses[5 - mesesAtras]
      if (entry) {
        entry.count += 1
        entry.receita += a.valorPago || 0
      }
    }
  })
  const maxAtendMes = Math.max(...ultimos6Meses.map((m) => m.count), 1)

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

  const statCards = [
    {
      label: 'Total de Agendamentos',
      value: agendamentos.length,
      icon: Calendar,
      bgIcon: 'bg-blue-100',
      textIcon: 'text-blue-600',
    },
    {
      label: 'Receita Total',
      value: formatCurrency(agendamentos.reduce((acc, a) => acc + (a.valorPago || 0), 0)),
      icon: DollarSign,
      bgIcon: 'bg-green-100',
      textIcon: 'text-green-600',
    },
    {
      label: 'Assinaturas Ativas',
      value: assinaturas.filter((a) => a.cortesRestantes > 0).length,
      icon: Users,
      bgIcon: 'bg-purple-100',
      textIcon: 'text-purple-600',
    },
    {
      label: 'Taxa de Conclusão',
      value: `${agendamentos.length > 0 ? Math.round((agendamentos.filter((a) => a.status === 'concluido').length / agendamentos.length) * 100) : 0}%`,
      icon: Activity,
      bgIcon: 'bg-orange-100',
      textIcon: 'text-orange-600',
    },
  ]

  return (
    <OwnerShell title="Relatórios">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-accent-primary" />
          Relatórios
        </h1>
        <p className="text-text-secondary mt-1">Métricas e insights do seu negócio</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
            >
              <div className={`w-12 h-12 rounded-2xl ${stat.bgIcon} ${stat.textIcon} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-text-primary">{stat.value}</div>
              <div className="text-sm text-text-muted mt-1">{stat.label}</div>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Atendimentos por mês */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent-primary" />
            Atendimentos (últimos 6 meses)
          </h2>
          {loading ? (
            <div className="h-48 flex items-center justify-center text-text-muted">Carregando...</div>
          ) : (
            <div className="space-y-3">
              {ultimos6Meses.map((mes) => (
                <div key={mes.label}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-text-secondary capitalize">{mes.label}</span>
                    <span className="font-semibold text-text-primary">
                      {mes.count} · {formatCurrency(mes.receita)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-accent-primary h-2 transition-all"
                      style={{ width: `${(mes.count / maxAtendMes) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top clientes */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-accent-primary" />
            Top Clientes
          </h2>
          {loading ? (
            <div className="h-48 flex items-center justify-center text-text-muted">Carregando...</div>
          ) : topClientes.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-text-muted text-sm">
              Nenhum pagamento registrado ainda
            </div>
          ) : (
            <div className="space-y-3">
              {topClientes.map(([nome, valor], idx) => (
                <div key={nome} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent-light flex items-center justify-center text-accent-primary font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-text-primary">{nome}</div>
                  </div>
                  <div className="font-bold text-green-600">{formatCurrency(valor)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Serviços mais populares */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-accent-primary" />
            Serviços Mais Populares
          </h2>
          {loading ? (
            <div className="h-48 flex items-center justify-center text-text-muted">Carregando...</div>
          ) : topServicos.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-text-muted text-sm">
              Nenhum agendamento registrado ainda
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topServicos.map(([nome, count]) => (
                <div key={nome}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-text-primary font-medium">{nome}</span>
                    <span className="text-text-secondary">{count} agendamentos</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-accent-primary h-2 transition-all"
                      style={{ width: `${(count / maxServicoCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </OwnerShell>
  )
}
