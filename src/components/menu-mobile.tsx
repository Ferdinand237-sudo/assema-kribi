'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { usePathname } from 'next/navigation'
import { deconnecter } from '@/app/(auth)/actions'
import { estLienActif } from './nav-link'

type Lien = { href: string; label: string; badge?: number }

export default function MenuMobile({
  liensPublics,
  liensInformations,
  liensGestion,
  connecte,
  prenom,
  avatarUrl,
}: {
  liensPublics: Lien[]
  liensInformations: Lien[]
  liensGestion: Lien[]
  connecte: boolean
  prenom?: string
  avatarUrl?: string
}) {
  const [ouvert, setOuvert] = useState(false)
  const [sousMenuOuvert, setSousMenuOuvert] = useState<'informations' | 'gestion' | null>(null)
  const pathname = usePathname()

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOuvert(!ouvert)}
        aria-label="Ouvrir le menu"
        className="rounded p-2 text-2xl text-encre/80 hover:bg-fond-clair"
      >
        {ouvert ? '✕' : '☰'}
      </button>

      {ouvert && createPortal(
        <div className="fixed inset-0 top-[57px] z-40 overflow-y-auto bg-white p-4">
          <nav className="flex flex-col gap-1 text-sm">
            {liensPublics.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOuvert(false)}
                className={`rounded px-3 py-2 hover:bg-fond-clair hover:text-primaire ${
                  estLienActif(pathname, l.href) ? 'font-semibold text-primaire' : 'text-encre/85'
                }`}
              >
                {l.label}
              </a>
            ))}

            {liensInformations.length > 0 && (
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => setSousMenuOuvert(sousMenuOuvert === 'informations' ? null : 'informations')}
                  className={`flex w-full items-center justify-between rounded px-3 py-2 text-xs font-semibold uppercase hover:bg-fond-clair ${
                    liensInformations.some((l) => estLienActif(pathname, l.href)) ? 'text-primaire' : 'text-encre/60'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    Informations
                    {liensInformations.some((l) => !!l.badge) && (
                      <span className="pastille-vivante rounded-full bg-primaire px-1.5 normal-case text-white">
                        {liensInformations.reduce((total, l) => total + (l.badge ?? 0), 0)}
                      </span>
                    )}
                  </span>
                  <span className={`text-encre/40 transition-transform ${sousMenuOuvert === 'informations' ? 'rotate-180' : ''}`}>▾</span>
                </button>
                {sousMenuOuvert === 'informations' && (
                  <div className="flex flex-col pl-2">
                    {liensInformations.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        onClick={() => setOuvert(false)}
                        className={`flex items-center justify-between rounded px-3 py-2 hover:bg-fond-clair hover:text-primaire ${
                          estLienActif(pathname, l.href) ? 'font-semibold text-primaire' : 'text-encre/85'
                        }`}
                      >
                        {l.label}
                        {!!l.badge && <span className="pastille-vivante rounded-full bg-primaire px-2 text-xs text-white">{l.badge}</span>}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}

            {liensGestion.length > 0 && (
              <div className="mt-1">
                <button
                  type="button"
                  onClick={() => setSousMenuOuvert(sousMenuOuvert === 'gestion' ? null : 'gestion')}
                  className={`flex w-full items-center justify-between rounded px-3 py-2 text-xs font-semibold uppercase hover:bg-fond-clair ${
                    liensGestion.some((l) => estLienActif(pathname, l.href)) ? 'text-primaire' : 'text-encre/60'
                  }`}
                >
                  Gestion
                  <span className={`text-encre/40 transition-transform ${sousMenuOuvert === 'gestion' ? 'rotate-180' : ''}`}>▾</span>
                </button>
                {sousMenuOuvert === 'gestion' && (
                  <div className="flex flex-col pl-2">
                    {liensGestion.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        onClick={() => setOuvert(false)}
                        className={`rounded px-3 py-2 hover:bg-fond-clair hover:text-primaire ${
                          estLienActif(pathname, l.href) ? 'font-semibold text-primaire' : 'text-encre/85'
                        }`}
                      >
                        {l.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="my-3 border-t border-black/10" />

            {connecte ? (
              <>
                <a href="/profil" onClick={() => setOuvert(false)} className="flex items-center gap-2 px-3 py-2 text-encre">
                  {avatarUrl && <img src={avatarUrl} alt="" className="h-7 w-7 rounded-full object-cover" />}
                  {prenom}
                </a>
                <form action={deconnecter}>
                  <button type="submit" className="w-full rounded px-3 py-2 text-left text-erreur hover:bg-fond-clair">
                    Déconnexion
                  </button>
                </form>
              </>
            ) : (
              <>
                <a href="/connexion" onClick={() => setOuvert(false)} className="rounded px-3 py-2 text-encre/85 hover:bg-fond-clair">
                  Connexion
                </a>
                <a href="/inscription" onClick={() => setOuvert(false)} className="bouton bouton-primaire text-center">
                  S'inscrire
                </a>
              </>
            )}
          </nav>
        </div>,
        document.body
      )}
    </div>
  )
}