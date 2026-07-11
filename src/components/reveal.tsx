'use client'

import { useEffect, useRef, useState } from 'react'

export default function Reveal({
  children,
  delayMs = 0,
  className = '',
}: {
  children: React.ReactNode
  delayMs?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  // 'idle' = visible par défaut (avant hydratation ou si JS indisponible) : le contenu
  // ne doit jamais rester caché si l'IntersectionObserver ne se déclenche pas.
  const [etat, setEtat] = useState<'idle' | 'attente' | 'visible'>('idle')

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return

    const rect = el.getBoundingClientRect()
    const dejaDansEcran = rect.top < window.innerHeight && rect.bottom > 0
    if (dejaDansEcran) {
      setEtat('visible')
      return
    }

    setEtat('attente')

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEtat('visible')
          observer.unobserve(el)
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)

    // Filet de sécurité : si l'observer ne se déclenche jamais, on affiche quand même.
    const filet = setTimeout(() => setEtat('visible'), 1500)

    return () => {
      observer.disconnect()
      clearTimeout(filet)
    }
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal ${etat === 'attente' ? 'reveal-attente' : ''} ${className}`}
      style={{ transitionDelay: etat === 'visible' ? `${delayMs}ms` : '0ms' }}
    >
      {children}
    </div>
  )
}
