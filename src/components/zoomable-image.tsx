'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export default function ZoomableImage({
  src,
  alt = '',
  className,
}: {
  src: string
  alt?: string
  className?: string
}) {
  const [ouverte, setOuverte] = useState(false)
  const [decalageY, setDecalageY] = useState(0)
  const [enGlissement, setEnGlissement] = useState(false)
  const depart = useRef<number | null>(null)

  useEffect(() => {
    if (!ouverte) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') fermer()
    }
    document.addEventListener('keydown', onKey)
    const overflowInitial = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflowInitial
    }
  }, [ouverte])

  function fermer() {
    setOuverte(false)
    setDecalageY(0)
  }

  function onTouchStart(e: React.TouchEvent) {
    depart.current = e.touches[0].clientY
    setEnGlissement(true)
  }

  function onTouchMove(e: React.TouchEvent) {
    if (depart.current === null) return
    const delta = e.touches[0].clientY - depart.current
    if (delta > 0) setDecalageY(delta)
  }

  function onTouchEnd() {
    if (decalageY > 110) {
      fermer()
    } else {
      setDecalageY(0)
    }
    setEnGlissement(false)
    depart.current = null
  }

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`${className ?? ''} cursor-zoom-in`}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setOuverte(true)
        }}
      />
      {ouverte &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
            style={{ opacity: 1 - Math.min(decalageY / 350, 0.6) }}
            onClick={fermer}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                fermer()
              }}
              aria-label="Fermer"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition-colors hover:bg-white/20"
            >
              &times;
            </button>
            <img
              src={src}
              alt={alt}
              onClick={(e) => e.stopPropagation()}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              style={{
                transform: `translateY(${decalageY}px)`,
                transition: enGlissement ? 'none' : 'transform 200ms ease-out',
              }}
              className="max-h-[90vh] max-w-full touch-none select-none rounded-lg object-contain"
            />
          </div>,
          document.body
        )}
    </>
  )
}
