'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  QrCode,
  Copy,
  Check,
  X,
  DollarSign,
  RefreshCw,
  Send,
  Calendar,
  Phone,
  User,
  ExternalLink,
  Loader2,
} from 'lucide-react'
import OwnerShell from '@/components/owner/OwnerShell'

interface OwnerUser {
  id: string
  email: string
  name: string
}

interface AgendamentoNaoPago {
  id: string
  nomeCliente: string
  telefone: string
  servico: string | null
  preco: string | null
  dataPreferida: string | null
  horario: string | null
  status: string
  pago: boolean
  createdAt: string
}

function gerarPixCopiaECola(valor: number, chavePix: string, nome: string, cidade: string) {
  // Implementação simplificada de PIX Copia e Cola
  // Formato EMV básico (BR Code)
  const merchantAccount = `0014BR.GOV.BCB.PIX0114${chavePix.length.toString().padStart(2, '0')}${chavePix}`
  const transactionAmount = `54${valor.toFixed(2).length.toString().padStart(2, '0')}${valor.toFixed(2)}`
  const merchantName = `59${nome.length.toString().padStart(2, '0')}${nome}`
  const merchantCity = `60${cidade.length.toString().padStart(2, '0')}${cidade}`

  const pixString =
    `00020126${merchantAccount.length.toString().padStart(2, '0')}${merchantAccount}` +
    `52040000` +
    `5303986` +
    `${transactionAmount}` +
    `5802BR` +
    `${merchantName}` +
    `${merchantCity}` +
    `6304ABCD`

  return pixString
}

export default function CobrancasDashboard({ user }: { user: OwnerUser }) {
  const router = useRouter()
  const [agendamentos, setAgendamentos] = useState<AgendamentoNaoPago[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAgendamento, setSelectedAgendamento] = useState<AgendamentoNaoPago | null>(null)
  const [valorCobranca, setValorCobranca] = useState('')
  const [pixGerado, setPixGerado] = useState('')
  const [qrCodeBase64, setQrCodeBase64] = useState('')
  const [paymentId, setPaymentId] = useState('')
  const [linkPagamento, setLinkPagamento] = useState('')
  const [copied, setCopied] = useState(false)
  const [gerando, setGerando] = useState(false)

  const fetchAgendamentos = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/agendamentos')
      if (res.ok) {
        const data = await res.json()
        // Filtrar apenas os não pagos
        const naoPagos = data.filter((a: AgendamentoNaoPago) => !a.pago)
        setAgendamentos(naoPagos)
      }
    } catch (err) {
      console.error(err)
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

  const abrirCobranca = (agendamento: AgendamentoNaoPago) => {
    setSelectedAgendamento(agendamento)
    setValorCobranca(agendamento.preco || '')
    setPixGerado('')
    setQrCodeBase64('')
    setLinkPagamento('')
    setCopied(false)
  }

  const gerarCobranca = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!valorCobranca || !selectedAgendamento) return

    setGerando(true)

    try {
      const res = await fetch('/api/pagamentos/pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agendamentoId: selectedAgendamento.id,
          valor: parseFloat(valorCobranca),
          descricao: `Agendamento - ${selectedAgendamento.servico || 'Serviço'}`,
          nomeCliente: selectedAgendamento.nomeCliente,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || 'Erro ao gerar PIX')
        return
      }

      setPixGerado(data.qrCodeText || '')
      setQrCodeBase64(data.qrCode || '')
      setPaymentId(data.paymentId || '')
      setLinkPagamento(`${window.location.origin}/pagar/${selectedAgendamento.id}`)
    } catch (err) {
      console.error(err)
      alert('Erro ao gerar PIX')
    } finally {
      setGerando(false)
    }
  }

  const copiarPix = async (texto: string) => {
    await navigator.clipboard.writeText(texto)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const enviarWhatsApp = () => {
    if (!selectedAgendamento) return
    const link = `${window.location.origin}/pagar/${selectedAgendamento.id}`
    const mensagem = encodeURIComponent(
      `Olá ${selectedAgendamento.nomeCliente}! 👋\n\n` +
      `Aqui é do Miguelzin Du Corte. Sua cobrança está pronta para pagamento:\n\n` +
      `💰 Valor: R$ ${parseFloat(valorCobranca).toFixed(2)}\n` +
      `${selectedAgendamento.servico ? `✂️ Serviço: ${selectedAgendamento.servico}\n` : ''}` +
      `\n🔗 Pague pelo link: ${link}\n\n` +
      `Ou escaneie o QR Code que vou enviar logo abaixo! ✅`
    )
    const telefoneLimpo = selectedAgendamento.telefone.replace(/\D/g, '')
    window.open(`https://wa.me/55${telefoneLimpo}?text=${mensagem}`, '_blank')
  }

  const marcarComoPago = async (id: string) => {
    const valor = parseFloat(valorCobranca)
    if (isNaN(valor) || valor <= 0) return

    try {
      const res = await fetch('/api/financeiro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agendamentoId: id,
          valor,
          metodoPagamento: 'pix_mercadopago',
        }),
      })
      if (res.ok) {
        setSelectedAgendamento(null)
        setPixGerado('')
        setQrCodeBase64('')
        setValorCobranca('')
        fetchAgendamentos()
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <OwnerShell title="Cobranças">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary flex items-center gap-2">
            <QrCode className="w-7 h-7 text-accent-primary" />
            Cobranças
          </h1>
          <p className="text-text-secondary mt-1">Gere cobranças PIX para seus clientes</p>
        </div>
        <button
          onClick={fetchAgendamentos}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary hover:text-accent-primary transition-colors border border-accent-primary/20 rounded-lg hover:bg-accent-light/50 w-fit"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>

          {/* Info Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-900">
              💡 <strong>Como funciona:</strong> Selecione um agendamento não pago, configure o valor e sua chave PIX. Será gerado um código PIX Copia e Cola que você pode enviar para o cliente pelo WhatsApp.
            </p>
          </div>

          {/* Lista de Agendamentos Não Pagos */}
          {loading && (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-3 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin" />
            </div>
          )}

          {!loading && agendamentos.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-accent-primary/10">
              <Check className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-text-secondary">Tudo em dia! Nenhum agendamento pendente de pagamento.</p>
            </div>
          )}

          {!loading && agendamentos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agendamentos.map((ag) => (
                <motion.div
                  key={ag.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl border border-accent-primary/10 shadow-sm p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-text-primary flex items-center gap-2">
                        <User className="w-4 h-4 text-text-muted" />
                        {ag.nomeCliente}
                      </h3>
                      {ag.servico && (
                        <p className="text-sm text-text-secondary mt-1">{ag.servico}</p>
                      )}
                    </div>
                    {ag.preco && (
                      <div className="text-lg font-bold text-accent-primary">
                        R$ {ag.preco}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary mb-4">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      {ag.telefone}
                    </span>
                    {ag.dataPreferida && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {ag.dataPreferida}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => abrirCobranca(ag)}
                    className="w-full py-2.5 bg-accent-primary hover:bg-accent-secondary text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <QrCode className="w-4 h-4" />
                    Cobrar
                  </button>
                </motion.div>
              ))}
            </div>
          )}

        {/* Modal de Cobrança */}
        <AnimatePresence>
          {selectedAgendamento && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto"
              onClick={() => setSelectedAgendamento(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-6 w-full max-w-md my-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-text-primary">Gerar Cobrança</h3>
                  <button
                    onClick={() => setSelectedAgendamento(null)}
                    className="p-1 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-text-primary">{selectedAgendamento.nomeCliente}</div>
                  {selectedAgendamento.servico && (
                    <div className="text-sm text-text-secondary">{selectedAgendamento.servico}</div>
                  )}
                </div>

                {!pixGerado ? (
                  <form onSubmit={gerarCobranca} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1">
                        Valor (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={valorCobranca}
                        onChange={(e) => setValorCobranca(e.target.value)}
                        required
                        placeholder="0,00"
                        className="w-full px-4 py-3 rounded-xl border border-accent-primary/20 focus:outline-none focus:ring-2 focus:ring-accent-primary/40 text-lg font-semibold"
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                      <p className="text-xs text-blue-900">
                        💡 O PIX será gerado pelo Mercado Pago. O dinheiro fica seguro lá até você transferir para sua conta.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={gerando}
                      className="w-full py-3 bg-accent-primary hover:bg-accent-secondary text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {gerando ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Gerando PIX...
                        </>
                      ) : (
                        <>
                          <QrCode className="w-5 h-5" />
                          Gerar PIX via Mercado Pago
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    {/* QR Code PIX - O base64 já vem com prefixo data:image/png;base64, */}
                    {qrCodeBase64 && (
                      <div className="bg-gradient-to-br from-accent-light to-white p-6 rounded-xl text-center border-2 border-accent-primary/20">
                        <div className="bg-white p-4 rounded-lg inline-block shadow-sm">
                          <img
                            src={qrCodeBase64.startsWith('data:') ? qrCodeBase64 : `data:image/png;base64,${qrCodeBase64}`}
                            alt="QR Code PIX"
                            className="w-56 h-56"
                          />
                        </div>
                        <div className="mt-3 text-2xl font-bold text-accent-primary">
                          R$ {parseFloat(valorCobranca).toFixed(2)}
                        </div>
                        <div className="text-xs text-text-secondary mt-1">
                          Escaneie o QR Code com seu app do banco
                        </div>
                      </div>
                    )}

                    {/* Link de Pagamento */}
                    {linkPagamento && (
                      <div>
                        <label className="block text-sm font-semibold text-text-primary mb-1">
                          Link de Pagamento
                        </label>
                        <div className="relative">
                          <input
                            readOnly
                            value={linkPagamento}
                            className="w-full px-4 py-3 pr-12 rounded-xl border border-accent-primary/20 bg-bg-secondary text-sm"
                          />
                          <button
                            onClick={() => copiarPix(linkPagamento)}
                            className="absolute top-2 right-2 p-2 bg-white hover:bg-accent-light rounded-lg transition-colors border border-accent-primary/20"
                          >
                            {copied ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4 text-accent-primary" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-text-muted mt-1">
                          Envie este link para o cliente pagar pelo celular
                        </p>
                      </div>
                    )}

                    {/* Código PIX */}
                    {pixGerado && (
                      <div>
                        <label className="block text-sm font-semibold text-text-primary mb-1">
                          Código PIX Copia e Cola
                        </label>
                        <div className="relative">
                          <textarea
                            readOnly
                            value={pixGerado}
                            rows={3}
                            className="w-full px-4 py-3 pr-12 rounded-xl border border-accent-primary/20 bg-gray-50 text-xs font-mono resize-none"
                          />
                          <button
                            onClick={() => copiarPix(pixGerado)}
                            className="absolute top-2 right-2 p-2 bg-white hover:bg-accent-light rounded-lg transition-colors border border-accent-primary/20"
                          >
                            {copied ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4 text-accent-primary" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-2 pt-2 border-t">
                      <button
                        onClick={enviarWhatsApp}
                        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        <Send className="w-5 h-5" />
                        Enviar por WhatsApp
                      </button>
                      <a
                        href={linkPagamento}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 bg-accent-primary hover:bg-accent-secondary text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="w-5 h-5" />
                        Abrir Link de Pagamento
                      </a>
                      <button
                        onClick={() => marcarComoPago(selectedAgendamento.id)}
                        className="w-full py-2 text-sm text-green-700 hover:text-green-800 font-medium hover:bg-green-50 rounded-lg transition-colors border border-green-200"
                      >
                        ✓ Já recebi o pagamento
                      </button>
                      <button
                        onClick={() => {
                          setPixGerado('')
                          setQrCodeBase64('')
                        }}
                        className="w-full py-2 text-sm text-text-secondary hover:text-accent-primary transition-colors"
                      >
                        Gerar novamente
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
    </OwnerShell>
  )
}