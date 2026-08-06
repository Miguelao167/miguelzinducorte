'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Copy, Check, QrCode, AlertCircle, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function PagamentoPage() {
  const params = useParams()
  const agendamentoId = params.id as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [agendamento, setAgendamento] = useState<any>(null)
  const [pagamento, setPagamento] = useState<any>(null)
  const [copied, setCopied] = useState(false)
  const [status, setStatus] = useState<'pendente' | 'aprovado' | 'rejeitado'>('pendente')

  useEffect(() => {
    gerarPagamento()
  }, [agendamentoId])

  // Polling para verificar status do pagamento
  useEffect(() => {
    if (!pagamento?.paymentId || status === 'aprovado') return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/pagamentos/status/${pagamento.paymentId}`)
        if (res.ok) {
          const data = await res.json()
          if (data.status === 'approved' || data.status === 'aprovado') {
            setStatus('aprovado')
            clearInterval(interval)
          }
        }
      } catch (err) {
        console.error(err)
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [pagamento, status])

  const gerarPagamento = async () => {
    setLoading(true)
    setError('')

    try {
      // Buscar agendamento
      const agRes = await fetch(`/api/agendamentos/${agendamentoId}`)
      if (!agRes.ok) throw new Error('Agendamento não encontrado')
      const agData = await agRes.json()
      setAgendamento(agData)

      if (agData.pago) {
        setStatus('aprovado')
        setLoading(false)
        return
      }

      // Gerar PIX
      const res = await fetch('/api/pagamentos/pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agendamentoId: agData.id,
          valor: agData.preco || '50',
          descricao: `Agendamento - ${agData.servico || 'Serviço'}`,
          nomeCliente: agData.nomeCliente,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao gerar pagamento')
      }

      setPagamento(data)
    } catch (err: any) {
      setError(err.message || 'Erro ao processar')
    } finally {
      setLoading(false)
    }
  }

  const copiarPix = async () => {
    if (!pagamento?.qrCodeText) return
    await navigator.clipboard.writeText(pagamento.qrCodeText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bg-secondary via-white to-bg-tertiary">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-accent-primary animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Gerando PIX...</p>
        </div>
      </div>
    )
  }

  if (status === 'aprovado') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-bg-secondary p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">Pagamento Confirmado!</h1>
          <p className="text-text-secondary mb-6">
            Recebemos seu pagamento com sucesso. Seu agendamento está confirmado.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <div className="text-sm text-green-700">Valor pago</div>
            <div className="text-3xl font-bold text-green-600">
              R$ {parseFloat(pagamento?.valor || agendamento?.preco || '0').toFixed(2)}
            </div>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-secondary font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao site
          </Link>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bg-secondary via-white to-bg-tertiary p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-text-primary mb-2">Erro</h2>
          <p className="text-text-secondary mb-6">{error}</p>
          <button
            onClick={gerarPagamento}
            className="px-6 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-secondary"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-secondary via-white to-bg-tertiary py-12 px-4">
      <div className="max-w-md mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent-primary mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-accent-primary to-accent-secondary p-6 text-white">
            <div className="flex items-center justify-center mb-3">
              <QrCode className="w-12 h-12" />
            </div>
            <h1 className="text-2xl font-bold text-center">Pagamento via PIX</h1>
            <p className="text-white/80 text-center text-sm mt-1">
              Miguelzin Du Corte
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Info do Agendamento */}
            {agendamento && (
              <div className="mb-6 p-4 bg-bg-secondary rounded-xl">
                <div className="text-sm text-text-secondary mb-1">Cliente</div>
                <div className="font-semibold text-text-primary">{agendamento.nomeCliente}</div>
                {agendamento.servico && (
                  <>
                    <div className="text-sm text-text-secondary mt-2 mb-1">Serviço</div>
                    <div className="font-medium text-text-primary">{agendamento.servico}</div>
                  </>
                )}
              </div>
            )}

            {/* QR Code */}
            {pagamento?.qrCode && (
              <div className="bg-gradient-to-br from-accent-light/30 to-white p-6 rounded-xl text-center mb-6 border-2 border-accent-primary/20">
                <div className="bg-white p-4 rounded-lg inline-block shadow-sm">
                  <img
                    src={pagamento.qrCode.startsWith('data:') ? pagamento.qrCode : `data:image/png;base64,${pagamento.qrCode}`}
                    alt="QR Code PIX"
                    className="w-56 h-56"
                  />
                </div>
                <div className="mt-4 text-3xl font-bold text-accent-primary">
                  R$ {parseFloat(pagamento.valor).toFixed(2)}
                </div>
                <div className="text-xs text-text-secondary mt-2">
                  Escaneie o QR Code com seu app do banco
                </div>
              </div>
            )}

            {/* Código Copia e Cola */}
            {pagamento?.qrCodeText && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Ou copie o código PIX:
                </label>
                <div className="relative">
                  <textarea
                    readOnly
                    value={pagamento.qrCodeText}
                    rows={3}
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-accent-primary/20 bg-bg-secondary text-xs font-mono resize-none"
                  />
                  <button
                    onClick={copiarPix}
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

            {/* Status */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                <span className="font-semibold text-blue-900 text-sm">Aguardando confirmação do pagamento</span>
              </div>
              <p className="text-xs text-blue-800">
                Após pagar pelo app do banco, o estabelecimento vai confirmar seu pagamento manualmente.
                Você também pode mandar o comprovante por WhatsApp para acelerar.
              </p>
            </div>

            {/* Instruções */}
            <div className="mt-6 space-y-2 text-sm text-text-secondary">
              <div className="font-semibold text-text-primary mb-2">Como pagar:</div>
              <div className="flex gap-2">
                <span className="text-accent-primary font-bold">1.</span>
                <span>Abra o app do seu banco</span>
              </div>
              <div className="flex gap-2">
                <span className="text-accent-primary font-bold">2.</span>
                <span>Escolha pagar via PIX QR Code ou Copia e Cola</span>
              </div>
              <div className="flex gap-2">
                <span className="text-accent-primary font-bold">3.</span>
                <span>Confirme o pagamento</span>
              </div>
            </div>
          </div>
        </motion.div>

        <p className="text-center text-xs text-text-muted mt-4">
          💳 Pagamento via PIX direto
        </p>
      </div>
    </div>
  )
}