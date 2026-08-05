'use client'

import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Card3DProps {
  children: React.ReactNode
  className?: string
  tiltIntensity?: number
  lightFollowMouse?: boolean
}

export default function Card3D({
  children,
  className,
  tiltIntensity = 12,
  lightFollowMouse = true,
}: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 })

  const rotationX = useMotionValue(0)
  const rotationY = useMotionValue(0)

  const springConfig = { damping: 20, stiffness: 300 }
  const rotateX = useSpring(rotationX, springConfig)
  const rotateY = useSpring(rotationY, springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height

    const mouseXFromCenter = e.clientX - rect.left - width / 2
    const mouseYFromCenter = e.clientY - rect.top - height / 2

    rotationX.set((mouseYFromCenter / height) * -tiltIntensity)
    rotationY.set((mouseXFromCenter / width) * tiltIntensity)

    const xPercent = ((e.clientX - rect.left) / width) * 100
    const yPercent = ((e.clientY - rect.top) / height) * 100
    setLightPos({ x: xPercent, y: yPercent })
  }

  const handleMouseEnter = () => setIsHovered(true)

  const handleMouseLeave = () => {
    setIsHovered(false)
    rotationX.set(0)
    rotationY.set(0)
    setLightPos({ x: 50, y: 50 })
  }

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        'relative transition-shadow duration-300',
        isHovered ? 'shadow-card-light-hover' : 'shadow-card-light',
        className
      )}
      style={{
        perspective: '1000px',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Light effect */}
      {lightFollowMouse && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300 z-10"
          style={{
            background: `radial-gradient(circle at ${lightPos.x}% ${lightPos.y}%, rgba(0, 102, 204, 0.12) 0%, transparent 60%)`,
            opacity: isHovered ? 1 : 0,
          }}
        />
      )}

      {/* Card content */}
      <motion.div
        className="relative h-full rounded-2xl bg-white border border-accent-primary/15 p-8 transition-colors duration-300 overflow-hidden"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Border highlight on hover */}
        <div
          className={cn(
            'absolute inset-0 rounded-2xl border border-accent-primary/40 transition-opacity duration-300 pointer-events-none',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
        />

        <div style={{ transform: 'translateZ(30px)' }}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  )
}
