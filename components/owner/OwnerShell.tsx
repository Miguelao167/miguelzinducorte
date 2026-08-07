'use client'

import OwnerSidebar from './OwnerSidebar'
import OwnerMobileHeader from './OwnerMobileHeader'

export default function OwnerShell({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-secondary via-white to-bg-tertiary flex">
      <OwnerSidebar />

      <div className="flex-1 min-w-0">
        <OwnerMobileHeader title={title} />

        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
