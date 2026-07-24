'use client'

import { useState } from 'react'

export default function BoutonsPartage({ url, titre }: { url: string; titre: string }) {
  const [copie, setCopie] = useState(false)

  const texte = encodeURIComponent(titre)
  const lien = encodeURIComponent(url)

  async function copierLien() {
    await navigator.clipboard.writeText(url)
    setCopie(true)
    setTimeout(() => setCopie(false), 2000)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-encre/50">Partager :</span>
      <a
        href={`https://wa.me/?text=${texte}%20${lien}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-fond-clair px-3 py-1.5 text-xs font-medium text-encre/80 transition-colors hover:bg-primaire hover:text-white"
      >
        WhatsApp
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${lien}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-fond-clair px-3 py-1.5 text-xs font-medium text-encre/80 transition-colors hover:bg-primaire hover:text-white"
      >
        Facebook
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${lien}&text=${texte}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-fond-clair px-3 py-1.5 text-xs font-medium text-encre/80 transition-colors hover:bg-primaire hover:text-white"
      >
        X
      </a>
      <button
        type="button"
        onClick={copierLien}
        className="rounded-full bg-fond-clair px-3 py-1.5 text-xs font-medium text-encre/80 transition-colors hover:bg-primaire hover:text-white"
      >
        {copie ? 'Copié !' : 'Copier le lien'}
      </button>
    </div>
  )
}
