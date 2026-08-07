'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Check, AlertCircle, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function SetupAdminPage() {
  const [status, setStatus] = useState<'checking' | 'ready' | 'done' | 'error'>('checking')
  const [message, setMessage] = useState('')
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null)

  useEffect(() => {
    checkStatus()
  }, [])

  const checkStatus = async () => {
    try {
      const res = await fetch('/api/setup-admin')
      const data = await res.json()

      if (data.needsSetup) {
        setStatus('ready')
      } else {
        setStatus('done')
        setMessage('Já existe um admin cadastrado. Vá para a página de login.')
      }
    } catch {
      setStatus('error')
      setMessage('Não foi possível verificar o banco.')
    }
  }

  const runSetup = async () => {
    setStatus('checking')
    setMessage('')

    try {
      const res = await fetch('/api/setup-admin', { method: 'POST' })
      const data = await res.json()

      if (res.ok) {
        setStatus('done')
        setCredentials(data.credentials)
        setMessage('Owner criado com sucesso!')
      } else {
        setStatus('error')
        setMessage(data.error || 'Erro ao criar admin')
      }
    } catch (err: any) {
      setStatus('error')
      setMessage(err.message || 'Erro desconhecido')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bg-secondary via-white to-bg-tertiary p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-accent-primary/10 flex items-center justify-center">
            <Shield className="w-8 h-8 text-accent-primary" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-text-primary mb-2">
          Configuração Inicial
        </h1>
        <p className="text-center text-text-secondary mb-6">
          Crie o primeiro usuário admin do site
        </p>

        {status === 'checking' && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-6 h-6 animate-spin text-accent-primary" />
            <span className="ml-2 text-text-secondary">Verificando...</span>
          </div>
        )}

        {status === 'ready' && (
          <div className="text-center">
            <p className="text-text-secondary mb-6">
              O banco está vazio. Clique abaixo para criar o primeiro admin.
            </p>
            <button
              onClick={runSetup}
              className="w-full px-6 py-3 bg-accent-primary text-white rounded-xl font-semibold hover:bg-accent-secondary transition-colors"
            >
              Criar Admin
            </button>
            <p className="text-xs text-text-muted mt-3">
              Email padrão: <strong>owner@miguelzinducorte.com</strong><br />
              Senha padrão: <strong>senha123</strong>
            </p>
          </div>
        )}

        {status === 'done' && (
          <div>
            <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl mb-4">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-green-700 font-medium">{message}</span>
            </div>

            {credentials && (
              <div className="bg-bg-secondary p-4 rounded-xl mb-4">
                <p className="text-sm text-text-secondary mb-2 font-semibold">Credenciais:</p>
                <div className="text-sm space-y-1">
                  <div><span className="text-text-muted">Email:</span> <span className="font-mono">{credentials.email}</span></div>
                  <div><span className="text-text-muted">Senha:</span> <span className="font-mono">{credentials.password}</span></div>
                </div>
              </div>
            )}

            <Link
              href="/owner/login"
              className="block w-full px-6 py-3 bg-accent-primary text-white rounded-xl font-semibold text-center hover:bg-accent-secondary transition-colors"
            >
              Ir para Login
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl mb-4">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span className="text-red-700 text-sm">{message}</span>
            </div>
            <button
              onClick={checkStatus}
              className="w-full px-6 py-3 bg-accent-primary text-white rounded-xl font-semibold hover:bg-accent-secondary transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-accent-primary"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao site
          </Link>
        </div>
      </motion.div>
    </div>
  )
}