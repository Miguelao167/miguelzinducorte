'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Scissors,
  UserPlus,
  Users,
  Calendar,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  LogOut,
  ArrowLeft,
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'

interface Plano {
  id: string
  nome: string
  preco: number
  numeroCortes: number
  validadeDias: number
  ativo: boolean
}

interface Cliente {
  id: string
  nome: string
  telefone: string
  observacoes?: string | null
  assinaturas?: Assinatura[]
}

interface Assinatura {
  id: string
  dataInicio: string
  dataExpiracao: string
  cortesRestantes: number
  cortesUsados: number
  ativa: boolean
  cliente: { id: string; nome: string; telefone: string }
  plano: { id: string; nome: string; preco: number; numeroCortes: number; validadeDias: number }
}

export default function PlanosPainel({ user }: { user: { id: string; email: string; name: string } }) {
  const router = useRouter()
  const [planos, setPlanos] = useState<Plano[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [assinaturas, setAssinaturas] = useState<Assinatura[]>([])
  const [loading, setLoading] = useState(true)

  const [showPlanoModal, setShowPlanoModal] = useState(false)
  const [showClienteModal, setShowClienteModal] = useState(false)
  const [showAssinaturaModal, setShowAssinaturaModal] = useState(false)

  const [novoPlano, setNovoPlano] = useState({ nome: '', preco: '', numeroCortes: '', validadeDias: '30' })
  const [novoCliente, setNovoCliente] = useState({ nome: '', telefone: '', observacoes: '' })
  const [novaAssinatura, setNovaAssinatura] = useState({ clienteId: '', planoId: '' })

  const fetchData = async () => {
    setLoading(true)
    try {
      const [planosRes, clientesRes, assinaturasRes] = await Promise.all([
        fetch('/api/planos'),
        fetch('/api/clientes'),
        fetch('/api/assinaturas'),
      ])
      if (planosRes.ok) setPlanos((await planosRes.json()).planos || [])
      if (clientesRes.ok) setClientes((await clientesRes.json()).clientes || [])
      if (assinaturasRes.ok) setAssinaturas((await assinaturasRes.json()).assinaturas || [])
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

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

  const criarPlano = async () => {
    if (!novoPlano.nome || !novoPlano.preco || !novoPlano.numeroCortes) return
    const res = await fetch('/api/planos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoPlano),
    })
    if (res.ok) {
      setShowPlanoModal(false)
      setNovoPlano({ nome: '', preco: '', numeroCortes: '', validadeDias: '30' })
      fetchData()
    }
  }

  const criarCliente = async () => {
    if (!novoCliente.nome || !novoCliente.telefone) return
    const res = await fetch('/api/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoCliente),
    })
    if (res.ok) {
      setShowClienteModal(false)
      setNovoCliente({ nome: '', telefone: '', observacoes: '' })
      fetchData()
    }
  }

  const criarAssinatura = async () => {
    if (!novaAssinatura.clienteId || !novaAssinatura.planoId) return
    const res = await fetch('/api/assinaturas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novaAssinatura),
    })
    if (res.ok) {
      setShowAssinaturaModal(false)
      setNovaAssinatura({ clienteId: '', planoId: '' })
      fetchData()
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-12 bg-gradient-to-br from-white via-bg-secondary/50 to-white">
        <div className="container-custom max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-text-primary flex items-center gap-2">
                <Scissors className="w-8 h-8 text-accent-primary" />
                Planos e Clientes
              </h1>
              <p className="text-text-secondary mt-1">Gerencie planos, clientes e assinaturas</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href="/owner/financeiro"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary hover:text-accent-primary transition-colors border border-accent-primary/20 rounded-lg hover:bg-accent-light/50"
              >
                <ArrowLeft className="w-4 h-4" />
                Financeiro
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => setShowPlanoModal(true)}
              className="bg-gradient-to-br from-accent-primary to-accent-secondary rounded-2xl p-6 text-white hover:shadow-lg transition-shadow text-left"
            >
              <Plus className="w-8 h-8 mb-2" />
              <div className="text-xl font-bold">Novo Plano</div>
              <div className="text-white/80 text-sm">Criar pacote de cortes</div>
            </button>

            <button
              onClick={() => setShowClienteModal(true)}
              className="bg-white rounded-2xl p-6 border border-accent-primary/10 shadow-sm hover:shadow-md transition-shadow text-left"
            >
              <UserPlus className="w-8 h-8 mb-2 text-accent-primary" />
              <div className="text-xl font-bold text-text-primary">Novo Cliente</div>
              <div className="text-text-secondary text-sm">Cadastrar pessoa</div>
            </button>

            <button
              onClick={() => setShowAssinaturaModal(true)}
              disabled={clientes.length === 0 || planos.length === 0}
              className="bg-white rounded-2xl p-6 border border-accent-primary/10 shadow-sm hover:shadow-md transition-shadow text-left disabled:opacity-50"
            >
              <CreditCard className="w-8 h-8 mb-2 text-accent-primary" />
              <div className="text-xl font-bold text-text-primary">Nova Assinatura</div>
              <div className="text-text-secondary text-sm">Vincular cliente a plano</div>
            </button>
          </div>

          {/* Planos Ativos */}
          <div className="bg-white rounded-2xl border border-accent-primary/10 shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
              <Scissors className="w-5 h-5 text-accent-primary" />
              Planos Disponíveis ({planos.length})
            </h2>
            {planos.length === 0 ? (
              <p className="text-text-muted text-center py-6">Nenhum plano cadastrado ainda.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {planos.map((p) => (
                  <div key={p.id} className="border border-accent-primary/10 rounded-xl p-4">
                    <div className="font-bold text-text-primary text-lg">{p.nome}</div>
                    <div className="text-2xl font-bold text-accent-primary mt-1">{formatCurrency(p.preco)}</div>
                    <div className="text-sm text-text-secondary mt-2">
                      {p.numeroCortes} cortes • {p.validadeDias} dias
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Clientes */}
          <div className="bg-white rounded-2xl border border-accent-primary/10 shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-accent-primary" />
              Clientes ({clientes.length})
            </h2>
            {clientes.length === 0 ? (
              <p className="text-text-muted text-center py-6">Nenhum cliente cadastrado ainda.</p>
            ) : (
              <div className="space-y-2">
                {clientes.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-3 bg-bg-secondary rounded-xl">
                    <div>
                      <div className="font-semibold text-text-primary">{c.nome}</div>
                      <div className="text-sm text-text-muted">{c.telefone}</div>
                    </div>
                    {c.assinaturas && c.assinaturas.length > 0 && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                        Plano ativo
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Assinaturas ativas */}
          <div className="bg-white rounded-2xl border border-accent-primary/10 shadow-sm p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-accent-primary" />
              Assinaturas Ativas ({assinaturas.length})
            </h2>
            {assinaturas.length === 0 ? (
              <p className="text-text-muted text-center py-6">Nenhuma assinatura ativa.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assinaturas.map((a) => (
                  <div key={a.id} className="border border-accent-primary/10 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-bold text-text-primary">{a.cliente.nome}</div>
                        <div className="text-sm text-text-muted">{a.plano.nome}</div>
                      </div>
                      <span className="text-lg font-bold text-accent-primary">
                        {a.cortesRestantes}/{a.plano.numeroCortes}
                      </span>
                    </div>
                    <div className="text-sm text-text-secondary flex items-center gap-1 mt-2">
                      <Calendar className="w-4 h-4" />
                      Expira em {formatDate(a.dataExpiracao)}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-3 overflow-hidden">
                      <div
                        className="bg-accent-primary h-2 transition-all"
                        style={{
                          width: `${(a.cortesRestantes / a.plano.numeroCortes) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal de Plano */}
      <AnimatePresence>
        {showPlanoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowPlanoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-text-primary">Novo Plano</h3>
                <button onClick={() => setShowPlanoModal(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Nome do plano (ex: Plano 4 Cortes)"
                  value={novoPlano.nome}
                  onChange={(e) => setNovoPlano({ ...novoPlano, nome: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-accent-primary/20 bg-bg-secondary"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Preço (R$)"
                  value={novoPlano.preco}
                  onChange={(e) => setNovoPlano({ ...novoPlano, preco: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-accent-primary/20 bg-bg-secondary"
                />
                <input
                  type="number"
                  placeholder="Quantidade de cortes"
                  value={novoPlano.numeroCortes}
                  onChange={(e) => setNovoPlano({ ...novoPlano, numeroCortes: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-accent-primary/20 bg-bg-secondary"
                />
                <input
                  type="number"
                  placeholder="Validade em dias"
                  value={novoPlano.validadeDias}
                  onChange={(e) => setNovoPlano({ ...novoPlano, validadeDias: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-accent-primary/20 bg-bg-secondary"
                />
                <button
                  onClick={criarPlano}
                  className="w-full px-4 py-3 bg-accent-primary text-white rounded-xl font-semibold hover:bg-accent-secondary"
                >
                  Criar Plano
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Cliente */}
      <AnimatePresence>
        {showClienteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowClienteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-text-primary">Novo Cliente</h3>
                <button onClick={() => setShowClienteModal(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Nome"
                  value={novoCliente.nome}
                  onChange={(e) => setNovoCliente({ ...novoCliente, nome: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-accent-primary/20 bg-bg-secondary"
                />
                <input
                  type="text"
                  placeholder="Telefone (com DDD)"
                  value={novoCliente.telefone}
                  onChange={(e) => setNovoCliente({ ...novoCliente, telefone: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-accent-primary/20 bg-bg-secondary"
                />
                <textarea
                  placeholder="Observações (opcional)"
                  value={novoCliente.observacoes}
                  onChange={(e) => setNovoCliente({ ...novoCliente, observacoes: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-accent-primary/20 bg-bg-secondary"
                />
                <button
                  onClick={criarCliente}
                  className="w-full px-4 py-3 bg-accent-primary text-white rounded-xl font-semibold hover:bg-accent-secondary"
                >
                  Cadastrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Assinatura */}
      <AnimatePresence>
        {showAssinaturaModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAssinaturaModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-text-primary">Nova Assinatura</h3>
                <button onClick={() => setShowAssinaturaModal(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                <select
                  value={novaAssinatura.clienteId}
                  onChange={(e) => setNovaAssinatura({ ...novaAssinatura, clienteId: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-accent-primary/20 bg-bg-secondary"
                >
                  <option value="">Selecione um cliente</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome} - {c.telefone}
                    </option>
                  ))}
                </select>
                <select
                  value={novaAssinatura.planoId}
                  onChange={(e) => setNovaAssinatura({ ...novaAssinatura, planoId: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-accent-primary/20 bg-bg-secondary"
                >
                  <option value="">Selecione um plano</option>
                  {planos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome} - {formatCurrency(p.preco)} ({p.numeroCortes} cortes)
                    </option>
                  ))}
                </select>
                <button
                  onClick={criarAssinatura}
                  className="w-full px-4 py-3 bg-accent-primary text-white rounded-xl font-semibold hover:bg-accent-secondary"
                >
                  Criar Assinatura
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
