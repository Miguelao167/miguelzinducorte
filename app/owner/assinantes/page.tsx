'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Scissors,
  Calendar,
  CreditCard,
  CheckCircle2,
  RefreshCw,
  Search,
  AlertCircle,
  Trash2,
} from 'lucide-react'
import OwnerShell from '@/components/owner/OwnerShell'

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

export default function AssinantesPage() {
  const router = useRouter()
  const [assinaturas, setAssinaturas] = useState<Assinatura[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [markingId, setMarkingId] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState('')

  const fetchAssinaturas = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/assinaturas')
      if (res.ok) {
        setAssinaturas((await res.json()).assinaturas || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAssinaturas()
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/owner/login')
    router.refresh()
  }

  const marcarCorte = async (assinaturaId: string, clienteNome: string) => {
    setMarkingId(assinaturaId)
    try {
      const res = await fetch('/api/assinaturas', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assinaturaId }),
      })
      if (res.ok) {
        setSuccessMsg(`Corte registrado para ${clienteNome}!`)
        setTimeout(() => setSuccessMsg(''), 3000)
        fetchAssinaturas()
      } else {
        const data = await res.json()
        alert(data.error || 'Erro ao registrar corte')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setMarkingId(null)
    }
  }

  const importarDeAgendamentos = async () => {
    if (!confirm('Importar agendamentos pagos como assinaturas? Cria assinatura pra cada agendamento de plano já pago.')) return
    try {
      const res = await fetch('/api/assinaturas/importar', { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        setSuccessMsg(`${data.criadas} assinatura(s) criada(s)!`)
        setTimeout(() => setSuccessMsg(''), 4000)
        fetchAssinaturas()
      } else {
        alert(data.error || 'Erro ao importar')
      }
    } catch (err) {
      console.error(err)
      alert('Erro ao importar')
    }
  }

  const excluirAssinatura = async (assinaturaId: string, clienteNome: string) => {
    if (!confirm(`Excluir a assinatura de ${clienteNome}? Esta ação não pode ser desfeita.`)) return
    try {
      const res = await fetch('/api/assinaturas', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assinaturaId }),
      })
      if (res.ok) {
        setSuccessMsg(`Assinatura de ${clienteNome} excluída!`)
        setTimeout(() => setSuccessMsg(''), 3000)
        fetchAssinaturas()
      } else {
        const data = await res.json()
        alert(data.error || 'Erro ao excluir')
      }
    } catch (err) {
      console.error(err)
      alert('Erro ao excluir')
    }
  }

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

  const diasRestantes = (dataExpiracao: string) => {
    const agora = new Date()
    const expira = new Date(dataExpiracao)
    const diff = Math.ceil((expira.getTime() - agora.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  const filtered = assinaturas.filter((a) =>
    a.cliente.nome.toLowerCase().includes(search.toLowerCase()) ||
    a.cliente.telefone.includes(search) ||
    a.plano.nome.toLowerCase().includes(search.toLowerCase())
  )

  const totalCortes = assinaturas.reduce((sum, a) => sum + a.plano.numeroCortes, 0)
  const totalUsados = assinaturas.reduce((sum, a) => sum + a.cortesUsados, 0)
  const totalRestantes = assinaturas.reduce((sum, a) => sum + a.cortesRestantes, 0)

  return (
    <OwnerShell title="Assinantes">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary flex items-center gap-2">
          <Users className="w-7 h-7 text-accent-primary" />
          Assinantes
        </h1>
        <p className="text-text-secondary mt-1">Gerencie os cortes dos seus assinantes</p>
      </div>

      {/* Sucesso */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700"
          >
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-accent-primary/10 p-4 text-center">
          <div className="text-3xl font-bold text-accent-primary">{assinaturas.length}</div>
          <div className="text-sm text-text-secondary">Assinantes Ativos</div>
        </div>
        <div className="bg-white rounded-2xl border border-accent-primary/10 p-4 text-center">
          <div className="text-3xl font-bold text-green-600">{totalRestantes}</div>
          <div className="text-sm text-text-secondary">Cortes Restantes</div>
        </div>
        <div className="bg-white rounded-2xl border border-accent-primary/10 p-4 text-center">
          <div className="text-3xl font-bold text-text-primary">{totalUsados}</div>
          <div className="text-sm text-text-secondary">Cortes Usados</div>
        </div>
        <div className="bg-white rounded-2xl border border-accent-primary/10 p-4 text-center">
          <div className="text-3xl font-bold text-blue-600">{totalCortes}</div>
          <div className="text-sm text-text-secondary">Total de Cortes</div>
        </div>
      </div>

      {/* Busca */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
        <input
          type="text"
          placeholder="Buscar por nome, telefone ou plano..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-accent-primary/20 bg-white focus:outline-none focus:ring-2 focus:ring-accent-primary/40"
        />
      </div>

      {/* Botões */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={fetchAssinaturas}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary hover:text-accent-primary transition-colors border border-accent-primary/20 rounded-lg hover:bg-accent-light/50 w-fit"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
        <button
          onClick={importarDeAgendamentos}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-accent-primary hover:bg-accent-secondary transition-colors rounded-lg w-fit"
        >
          <Users className="w-4 h-4" />
          Importar de Agendamentos
        </button>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-3 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-accent-primary/10 p-12 text-center">
          <Users className="w-12 h-12 mx-auto text-text-muted mb-4" />
          <p className="text-text-secondary text-lg">
            {search ? 'Nenhum assinante encontrado na busca' : 'Nenhum assinante ativo ainda'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((a) => {
            const dias = diasRestantes(a.dataExpiracao)
            const percentual = (a.cortesRestantes / a.plano.numeroCortes) * 100
            const semCortes = a.cortesRestantes === 0
            const quaseExpirou = dias <= 7

            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-2xl border p-5 ${
                  semCortes
                    ? 'border-red-200 bg-red-50/30'
                    : quaseExpirou
                    ? 'border-yellow-200 bg-yellow-50/30'
                    : 'border-accent-primary/10'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="font-bold text-lg text-text-primary">{a.cliente.nome}</div>
                    <div className="text-sm text-text-muted">{a.cliente.telefone}</div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-accent-light/50 text-accent-primary font-medium">
                    {a.plano.nome}
                  </span>
                </div>

                {/* Cortes */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Scissors className="w-4 h-4 text-accent-primary" />
                    <span className="text-sm text-text-secondary">Cortes</span>
                  </div>
                  <span className={`text-lg font-bold ${semCortes ? 'text-red-600' : 'text-accent-primary'}`}>
                    {a.cortesRestantes}/{a.plano.numeroCortes}
                  </span>
                </div>

                {/* Barra de progresso */}
                <div className="w-full bg-gray-100 rounded-full h-2.5 mb-3 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all ${
                      semCortes
                        ? 'bg-red-400'
                        : percentual <= 25
                        ? 'bg-yellow-400'
                        : 'bg-accent-primary'
                    }`}
                    style={{ width: `${percentual}%` }}
                  />
                </div>

                {/* Validade */}
                <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {dias > 0 ? `Expira em ${dias} dia${dias !== 1 ? 's' : ''}` : 'Expirado'}
                  </span>
                </div>

                {/* Botão marcar corte */}
                <button
                  onClick={() => marcarCorte(a.id, a.cliente.nome)}
                  disabled={markingId === a.id || semCortes}
                  className={`w-full py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    semCortes
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : markingId === a.id
                      ? 'bg-accent-primary/50 text-white cursor-wait'
                      : 'bg-accent-primary hover:bg-accent-secondary text-white active:scale-95'
                  }`}
                >
                  {markingId === a.id ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Registrando...
                    </>
                  ) : semCortes ? (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      Sem cortes restantes
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Marcar Corte
                    </>
                  )}
                </button>

                {/* Info extra */}
                <div className="mt-3 pt-3 border-t border-accent-primary/5 text-xs text-text-muted flex justify-between">
                  <span>Válido até {formatDate(a.dataExpiracao)}</span>
                  <span>{formatCurrency(a.plano.preco)}</span>
                </div>

                {/* Botão excluir */}
                <button
                  onClick={() => excluirAssinatura(a.id, a.cliente.nome)}
                  className="mt-3 w-full py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-2 border border-red-200"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Excluir Assinatura
                </button>
              </motion.div>
            )
          })}
        </div>
      )}
    </OwnerShell>
  )
}
