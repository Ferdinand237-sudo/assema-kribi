'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { estLienActif } from './nav-link'

type Item = { href: string; label: string; badge?: number }

export default function NavDropdown({
  label,
  items,
  badgeTotal,
}: {
  label: string
  items: Item[]
  badgeTotal?: number
}) {
  const [ouvert, setOuvert] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const contientLienActif = items.some((it) => estLienActif(pathname, it.href))

  useEffect(() => {
    function fermerSiExterieur(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOuvert(false)
    }
    document.addEventListener('mousedown', fermerSiExterieur)
    return () => document.removeEventListener('mousedown', fermerSiExterieur)
  }, [])

  if (items.length === 0) return null

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOuvert(!ouvert)}
        className={`flex items-center gap-1 text-sm transition-colors hover:text-primaire ${
          contientLienActif ? 'font-semibold text-primaire' : 'text-encre/80'
        }`}
      >
        {label}
        {!!badgeTotal && (
          <span className="pastille-vivante rounded-full bg-primaire px-1.5 text-xs text-white">{badgeTotal}</span>
        )}
        <span className="text-xs text-encre/40">▾</span>
      </button>

      {ouvert && (
        <div className="absolute left-0 top-full z-50 mt-2 min-w-[220px] rounded-lg border border-black/5 bg-white py-1 shadow-lg">
          {items.map((it) => {
            const actif = estLienActif(pathname, it.href)
            return (
              <a key={it.href}
                href={it.href}
                onClick={() => setOuvert(false)}
                className={`flex items-center justify-between px-3 py-2 text-sm transition-colors hover:bg-fond-clair hover:text-primaire ${
                  actif ? 'font-semibold text-primaire' : 'text-encre/85'
                }`}
              >
                {it.label}
                {!!it.badge && (
                  <span className="pastille-vivante rounded-full bg-primaire px-1.5 text-xs text-white">{it.badge}</span>
                )}
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}