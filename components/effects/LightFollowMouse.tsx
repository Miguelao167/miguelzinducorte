'use client'

import { useEffect, useRef, useState } from 'react'

interface LightFollowMouseProps {
  children: React.ReactNode
  className?: string
  color?: string
  strength?: number
}

export default function LightFollowMouse({ 
  children, 
  className = '',
  color = 'rgba(0, 212, 255, 0.15)',
  strength = 300 
}: LightFollowMouseProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        setPosition({ x, y })
      }
    }

    container.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Light effect */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(${strength}px circle at ${position.x}px ${position.y}px, ${color}, transparent 70%)`,
          opacity: position.x !== 0 || position.y !== 0 ? 1 : 0,
        }}
      />
      {children}
    </div>
  )
}
