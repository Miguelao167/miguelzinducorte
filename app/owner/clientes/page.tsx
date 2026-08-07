'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Phone, Search, Scissors, Calendar } from 'lucide-react'
import OwnerShell from '@/components/owner/OwnerShell'

interface Cliente {
  id: string
  nome: string
  telefone: string
  observacoes: string | null
  createdAt: string
  _count?: { assinaturas: number; agendamentos: number }
}

interface Assinatura {
  id: string
  clienteId: string
  ativa: boolean
  dataExpiracao: string
  cortesRestantes: number
  plano: { nome: string }
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [assinaturas, setAssinaturas] = useState<Assinatura[]>([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cl, as] = await Promise.all([
          fetch('/api/clientes').then((r) => r.json()),
          fetch('/api/assinaturas').then((r) => r.json()),
        ])
        setClientes(cl.clientes || [])
        setAssinaturas(as.assinaturas || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const clientesFiltrados = clientes.filter(
    (c) =>
      c.nome.toLowerCase().includes(busca.toLowerCase()) ||
      c.telefone.includes(busca)
  )

  const formatarTelefone = (tel: string) => {
    const limpo = tel.replace(/\D/g, '')
    if (limpo.length === 11) {
      return `(${limpo.slice(0, 2)}) ${limpo.slice(2, 7)}-${limpo.slice(7)}`
    }
    if (limpo.length === 10) {
      return `(${limpo.slice(0, 2)}) ${limpo.slice(2, 6)}-${limpo.slice(6)}`
    }
    return tel
  }

  const getAssinaturaAtiva = (clienteId: string) =>
    assinaturas.find(
      (a) => a.clienteId === clienteId && a.ativa && new Date(a.dataExpiracao) >= new Date()
    )

  return (
    <OwnerShell title="Clientes">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary flex items-center gap-2">
          <Users className="w-7 h-7 text-accent-primary" />
          Clientes
        </h1>
        <p className="text-text-secondary mt-1">Todos os clientes cadastrados</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
            <Users className="w-6 h-6" />
          </div>
          <div className="text-3xl font-bold text-text-primary">{clientes.length}</div>
          <div className="text-sm text-text-muted mt-1">Clientes Cadastrados</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
            <Scissors className="w-6 h-6" />
          </div>
          <div className="text-3xl font-bold text-text-primary">
            {assinaturas.filter((a) => a.ativa && new Date(a.dataExpiracao) >= new Date()).length}
          </div>
          <div className="text-sm text-text-muted mt-1">Com Assinatura Ativa</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm col-span-2 lg:col-span-1"
        >
          <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="text-3xl font-bold text-text-primary">
            {clientes.filter((c) => {
              const created = new Date(c.createdAt)
              const now = new Date()
              return (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24) <= 30
            }).length}
          </div>
          <div className="text-sm text-text-muted mt-1">Novos (últimos 30 dias)</div>
        </motion.div>
      </div>

      {/* Busca */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome ou telefone..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-primary/40"
          />
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-3 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin" />
        </div>
      ) : clientesFiltrados.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <Users className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary">
            {busca ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado ainda'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clientesFiltrados.map((cliente) => {
            const assinatura = getAssinaturaAtiva(cliente.id)
            return (
              <motion.div
                key={cliente.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {cliente.nome.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-text-primary truncate">{cliente.nome}</div>
                    <div className="flex items-center gap-1 text-sm text-text-secondary mt-1">
                      <Phone className="w-3.5 h-3.5" />
                      {formatarTelefone(cliente.telefone)}
                    </div>
                    {assinatura && (
                      <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-medium">
                        <Scissors className="w-3 h-3" />
                        {assinatura.plano.nome} · {assinatura.cortesRestantes} restantes
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </OwnerShell>
  )
}
