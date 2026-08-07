'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Key,
  Save,
  Check,
  LogOut,
  DollarSign,
  ArrowLeft,
  Building2,
  User as UserIcon,
  Smartphone,
  Hash,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'

interface OwnerUser {
  id: string
  email: string
  name: string
}

interface PixConfig {
  chavePix: string
  tipoChave: 'cpf' | 'cnpj' | 'email' | 'telefone' | 'aleatoria'
  nomeRecebedor: string
  cidade: string
}

const tiposChave = [
  { value: 'cpf', label: 'CPF', icon: UserIcon, placeholder: '000.000.000-00' },
  { value: 'cnpj', label: 'CNPJ', icon: Building2, placeholder: '00.000.000/0000-00' },
  { value: 'email', label: 'E-mail', icon: Hash, placeholder: 'seu@email.com' },
  { value: 'telefone', label: 'Telefone', icon: Smartphone, placeholder: '(00) 00000-0000' },
  { value: 'aleatoria', label: 'Chave Aleatória', icon: Hash, placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
]

export default function ConfiguracoesPainel({ user }: { user: OwnerUser }) {
  const router = useRouter()
  const [config, setConfig] = useState<PixConfig>({
    chavePix: '',
    tipoChave: 'cpf',
    nomeRecebedor: 'MIGUELZIN DU CORTE',
    cidade: 'PATOS DE MINAS',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    carregarConfig()
  }, [])

  const carregarConfig = async () => {
    try {
      const res = await fetch('/api/configuracoes/pix')
      if (res.ok) {
        const data = await res.json()
        if (data.config) {
          setConfig(data.config)
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/owner/login')
    router.refresh()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaved(false)
    setSaving(true)

    try {
      const res = await fetch('/api/configuracoes/pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erro ao salvar')
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  const tipoAtual = tiposChave.find(t => t.value === config.tipoChave)

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-32 pb-12 bg-gradient-to-br from-white via-bg-secondary/50 to-white">
        <div className="container-custom max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-text-primary flex items-center gap-2">
                <Key className="w-8 h-8 text-accent-primary" />
                Configurações
              </h1>
              <p className="text-text-secondary mt-1">
                Configure sua chave PIX para receber pagamentos
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
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary hover:text-accent-primary transition-colors border border-accent-primary/20 rounded-lg hover:bg-accent-light/50"
              >
                <DollarSign className="w-4 h-4" />
                Cobranças
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors border border-red-200 rounded-lg hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-3 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin" />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-accent-primary/10 shadow-sm p-6 md:p-8"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                {saved && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm"
                  >
                    <Check className="w-4 h-4 flex-shrink-0" />
                    Configurações salvas com sucesso!
                  </motion.div>
                )}

                {/* Tipo de Chave */}
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">
                    Tipo de Chave PIX
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {tiposChave.map((tipo) => {
                      const Icon = tipo.icon
                      return (
                        <button
                          key={tipo.value}
                          type="button"
                          onClick={() => setConfig({ ...config, tipoChave: tipo.value as any })}
                          className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                            config.tipoChave === tipo.value
                              ? 'border-accent-primary bg-accent-light text-accent-primary'
                              : 'border-accent-primary/20 hover:border-accent-primary/40'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-xs font-medium">{tipo.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Chave PIX */}
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">
                    Sua Chave PIX
                  </label>
                  <input
                    type="text"
                    value={config.chavePix}
                    onChange={(e) => setConfig({ ...config, chavePix: e.target.value })}
                    placeholder={tipoAtual?.placeholder || 'Sua chave PIX'}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-accent-primary/20 focus:outline-none focus:ring-2 focus:ring-accent-primary/40"
                  />
                  <p className="text-xs text-text-muted mt-1">
                    É para essa chave que o dinheiro vai cair quando o cliente pagar
                  </p>
                </div>

                {/* Nome do Recebedor */}
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">
                    Seu Nome (aparece no pagamento)
                  </label>
                  <input
                    type="text"
                    value={config.nomeRecebedor}
                    onChange={(e) => setConfig({ ...config, nomeRecebedor: e.target.value.toUpperCase() })}
                    placeholder="SEU NOME COMPLETO"
                    required
                    maxLength={25}
                    className="w-full px-4 py-3 rounded-xl border border-accent-primary/20 focus:outline-none focus:ring-2 focus:ring-accent-primary/40 uppercase"
                  />
                  <p className="text-xs text-text-muted mt-1">
                    Aparecerá no comprovante do cliente (máximo 25 caracteres)
                  </p>
                </div>

                {/* Cidade */}
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={config.cidade}
                    onChange={(e) => setConfig({ ...config, cidade: e.target.value.toUpperCase() })}
                    placeholder="SUA CIDADE"
                    required
                    maxLength={15}
                    className="w-full px-4 py-3 rounded-xl border border-accent-primary/20 focus:outline-none focus:ring-2 focus:ring-accent-primary/40 uppercase"
                  />
                </div>

                {/* Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-blue-900">
                      <p className="font-semibold mb-1">Como funciona:</p>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>O QR Code é gerado direto com sua chave PIX</li>
                        <li>Quando o cliente paga, o dinheiro cai <strong>instantaneamente</strong> na sua conta</li>
                        <li>Você marca como &quot;Pago&quot; no painel após confirmar</li>
                        <li><strong>Sem taxas, sem intermediários</strong></li>
                      </ul>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3 bg-accent-primary hover:bg-accent-secondary text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Salvar Configurações
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </div>
      </main>
    </>
  )
}