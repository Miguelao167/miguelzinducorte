'use client'

import { useEffect, useState } from 'react'
import { motion, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const cursorX = useSpring(0, { stiffness: 500, damping: 30 })
  const cursorY = useSpring(0, { stiffness: 500, damping: 30 })

  useEffect(() => {
    // Skip entirely on touch devices — avoids attaching listeners for nothing
    if (typeof window !== 'undefined' && 'ontouchstart' in window) return

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isInteractive = target.closest('a, button, [role="button"], input, textarea, select')
      setIsHovering(!!isInteractive)
    }

    const handleMouseLeave = () => setIsVisible(false)

    window.addEventListener('mousemove', moveCursor, { passive: true })
    window.addEventListener('mouseover', handleMouseOver, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [cursorX, cursorY, isVisible])

  if (typeof window !== 'undefined' && 'ontouchstart' in window) {
    return null
  }

  return (
    <motion.div
      className={cn(
        'fixed top-0 left-0 pointer-events-none z-[9999] rounded-full hidden md:block border-2 border-accent-primary',
        isHovering ? 'w-10 h-10' : 'w-4 h-4'
      )}
      style={{
        x: cursorX,
        y: cursorY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      animate={{ opacity: isVisible ? (isHovering ? 0.6 : 1) : 0 }}
      transition={{ opacity: { duration: 0.2 }, width: { duration: 0.2 }, height: { duration: 0.2 } }}
    />
  )
}
