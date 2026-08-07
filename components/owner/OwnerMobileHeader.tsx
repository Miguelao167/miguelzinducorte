'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, LayoutDashboard, DollarSign, QrCode, Settings, BarChart3, Users, Scissors, FileText, LogOut } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const menuItems = [
  { href: '/owner', label: 'Painel', icon: LayoutDashboard, exact: true },
  { href: '/owner/financeiro', label: 'Financeiro', icon: DollarSign },
  { href: '/owner/cobrancas', label: 'Cobranças', icon: QrCode },
  { href: '/owner/configuracoes', label: 'Configurações', icon: Settings },
  { href: '/owner/relatorios', label: 'Relatórios', icon: BarChart3 },
  { href: '/owner/clientes', label: 'Clientes', icon: Users },
  { href: '/owner/servicos', label: 'Serviços', icon: Scissors },
  { href: '/owner/planos', label: 'Planos', icon: FileText },
  { href: '/owner/assinantes', label: 'Assinantes', icon: Users },
]

export default function OwnerMobileHeader({ title }: { title: string }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname === href || pathname?.startsWith(href + '/')
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/owner/login')
    router.refresh()
  }

  return (
    <>
      <header className="md:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setOpen(true)}
          className="p-2 -ml-2 text-text-secondary hover:text-text-primary"
          aria-label="Abrir menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="font-semibold text-text-primary">{title}</h1>
        <div className="w-9" />
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 md:hidden flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-white font-bold">
                    M
                  </div>
                  <div>
                    <div className="font-bold text-text-primary text-sm">MIGUELZIN</div>
                    <div className="text-xs text-text-muted">Painel Admin</div>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="p-1 text-text-secondary">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href, item.exact)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        active
                          ? 'bg-accent-primary text-white'
                          : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full"
                >
                  <LogOut className="w-5 h-5" />
                  Sair
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
