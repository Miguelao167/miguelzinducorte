'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlowTextProps {
  children: React.ReactNode
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
  glowIntensity?: 'sm' | 'md' | 'lg' | 'xl'
  animate?: boolean
}

export default function GlowText({
  children,
  className,
  glowIntensity = 'md',
  animate = false,
}: GlowTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const textShadows = {
    sm: '0 2px 8px rgba(0, 102, 204, 0.25)',
    md: '0 4px 16px rgba(0, 102, 204, 0.3), 0 2px 4px rgba(0, 61, 128, 0.15)',
    lg: '0 6px 24px rgba(0, 102, 204, 0.35), 0 3px 8px rgba(0, 61, 128, 0.2)',
    xl: '0 8px 32px rgba(0, 102, 204, 0.4), 0 4px 12px rgba(0, 61, 128, 0.25)',
  }

  const content = (
    <span
      ref={ref}
      className={cn('inline-block gradient-text', className)}
      style={{ textShadow: textShadows[glowIntensity] }}
    >
      {children}
    </span>
  )

  if (animate) {
    return (
      <motion.span
        initial={{ opacity: 0, filter: 'blur(20px)', scale: 0.95 }}
        animate={isInView ? { opacity: 1, filter: 'blur(0px)', scale: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {content}
      </motion.span>
    )
  }

  return content
}
