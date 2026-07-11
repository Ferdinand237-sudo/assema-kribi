'use client'

import { useState } from 'react'
import { deconnecter } from '@/app/(auth)/actions'

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

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOuvert(!ouvert)}
        aria-label="Ouvrir le menu"
        className="rounded p-2 text-2xl text-encre/80 hover:bg-fond-clair"
      >
        {ouvert ? '✕' : '☰'}
      </button>

      {ouvert && (
        <div className="fixed inset-0 top-[57px] z-40 overflow-y-auto bg-white p-4">
          <nav className="flex flex-col gap-1 text-sm">
            {liensPublics.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOuvert(false)} className="rounded px-3 py-2 text-encre/85 hover:bg-fond-clair hover:text-primaire">
                {l.label}
              </a>
            ))}

            {liensInformations.length > 0 && (
              <>
                <p className="mt-3 px-3 text-xs font-semibold uppercase text-encre/40">Informations</p>
                {liensInformations.map((l) => (
                  <a key={l.href} href={l.href} onClick={() => setOuvert(false)} className="flex items-center justify-between rounded px-3 py-2 text-encre/85 hover:bg-fond-clair hover:text-primaire">
                    {l.label}
                    {!!l.badge && <span className="pastille-vivante rounded-full bg-primaire px-2 text-xs text-white">{l.badge}</span>}
                  </a>
                ))}
              </>
            )}

            {liensGestion.length > 0 && (
              <>
                <p className="mt-3 px-3 text-xs font-semibold uppercase text-encre/40">Gestion</p>
                {liensGestion.map((l) => (
                  <a key={l.href} href={l.href} onClick={() => setOuvert(false)} className="rounded px-3 py-2 text-encre/85 hover:bg-fond-clair hover:text-primaire">
                    {l.label}
                  </a>
                ))}
              </>
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
        </div>
      )}
    </div>
  )
}