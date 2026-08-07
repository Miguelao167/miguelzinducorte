'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  DollarSign,
  QrCode,
  Settings,
  BarChart3,
  Users,
  Scissors,
  FileText,
  LogOut,
} from 'lucide-react'

const menuItems = [
  { href: '/owner', label: 'Painel', icon: LayoutDashboard, exact: true },
  { href: '/owner/financeiro', label: 'Financeiro', icon: DollarSign },
  { href: '/owner/cobrancas', label: 'Cobranças', icon: QrCode },
  { href: '/owner/configuracoes', label: 'Configurações', icon: Settings },
  { href: '/owner/relatorios', label: 'Relatórios', icon: BarChart3 },
  { href: '/owner/clientes', label: 'Clientes', icon: Users },
  { href: '/owner/servicos', label: 'Serviços', icon: Scissors },
  { href: '/owner/assinantes', label: 'Assinantes', icon: Users },
]

export default function OwnerSidebar() {
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
    <aside className="hidden md:flex md:flex-col w-64 lg:w-72 min-h-screen bg-white border-r border-gray-200 flex-shrink-0 sticky top-0 h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-white font-bold">
            M
          </div>
          <div>
            <div className="font-bold text-text-primary text-sm">MIGUELZIN</div>
            <div className="text-xs text-text-muted">Painel Admin</div>
          </div>
        </Link>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? 'text-text-primary'
                  : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'
              }`}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-accent-primary rounded-xl"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-3">
                <Icon className={`w-5 h-5 ${active ? 'text-white' : ''}`} />
                <span className={active ? 'text-white' : ''}>{item.label}</span>
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          Sair
        </button>
      </div>
    </aside>
  )
}
