'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Scissors, DollarSign, TrendingUp } from 'lucide-react'
import OwnerShell from '@/components/owner/OwnerShell'

interface Agendamento {
  id: string
  servico: string | null
  valorPago: number | null
  createdAt: string
}

interface ServicoStats {
  nome: string
  quantidade: number
  receita: number
}

const SERVICOS_CONHECIDOS = [
  { nome: 'Corte de Cabelo', preco: 35 },
  { nome: 'Barba', preco: 25 },
  { nome: 'Corte + Barba', preco: 55 },
  { nome: 'Sobrancelha', preco: 15 },
  { nome: 'Pigmentação', preco: 80 },
]

export default function ServicosPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/agendamentos')
        if (res.ok) {
          const data = await res.json()
          setAgendamentos(data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Estatísticas por serviço
  const statsPorServico: Record<string, ServicoStats> = {}
  agendamentos.forEach((a) => {
    const nome = a.servico || 'Outros'
    if (!statsPorServico[nome]) {
      statsPorServico[nome] = { nome, quantidade: 0, receita: 0 }
    }
    statsPorServico[nome].quantidade += 1
    statsPorServico[nome].receita += a.valorPago || 0
  })
  const servicos = Object.values(statsPorServico).sort((a, b) => b.quantidade - a.quantidade)

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

  const totalReceita = servicos.reduce((acc, s) => acc + s.receita, 0)
  const totalAtendimentos = servicos.reduce((acc, s) => acc + s.quantidade, 0)
  const servicoMaisPopular = servicos[0]

  return (
    <OwnerShell title="Serviços">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary flex items-center gap-2">
          <Scissors className="w-7 h-7 text-accent-primary" />
          Serviços
        </h1>
        <p className="text-text-secondary mt-1">Tabela de preços e desempenho</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
            <Scissors className="w-6 h-6" />
          </div>
          <div className="text-3xl font-bold text-text-primary">{servicos.length}</div>
          <div className="text-sm text-text-muted mt-1">Serviços Diferentes</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
        >
          <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center mb-4">
            <DollarSign className="w-6 h-6" />
          </div>
          <div className="text-3xl font-bold text-text-primary">{formatCurrency(totalReceita)}</div>
          <div className="text-sm text-text-muted mt-1">Receita Total</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm col-span-2 lg:col-span-1"
        >
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="text-3xl font-bold text-text-primary">
            {servicoMaisPopular?.nome || '—'}
          </div>
          <div className="text-sm text-text-muted mt-1">Mais Popular</div>
        </motion.div>
      </div>

      {/* Tabela de Preços */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
        <h2 className="text-lg font-bold text-text-primary mb-4">Tabela de Preços</h2>
        <div className="space-y-2">
          {SERVICOS_CONHECIDOS.map((servico, idx) => {
            const stats = statsPorServico[servico.nome]
            return (
              <div
                key={servico.nome}
                className="flex items-center justify-between p-4 rounded-xl bg-bg-secondary/50 hover:bg-bg-secondary transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent-light flex items-center justify-center text-accent-primary font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-text-primary">{servico.nome}</div>
                    {stats && (
                      <div className="text-xs text-text-muted">
                        {stats.quantidade} atendimentos · {formatCurrency(stats.receita)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-lg font-bold text-accent-primary">
                  {formatCurrency(servico.preco)}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Performance */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-3 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin" />
        </div>
      ) : servicos.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <Scissors className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary">Nenhum atendimento registrado ainda</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-text-primary mb-4">Performance dos Serviços</h2>
          <div className="space-y-3">
            {servicos.map((servico) => {
              const max = Math.max(...servicos.map((s) => s.quantidade), 1)
              return (
                <div key={servico.nome}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-text-primary">{servico.nome}</span>
                    <span className="text-text-secondary">
                      {servico.quantidade} · {formatCurrency(servico.receita)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-accent-primary h-2 transition-all"
                      style={{ width: `${(servico.quantidade / max) * 100}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </OwnerShell>
  )
}
