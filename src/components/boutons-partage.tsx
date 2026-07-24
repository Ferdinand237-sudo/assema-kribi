'use client'

import { useState } from 'react'

function IconeCopier() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  )
}

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
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-xs font-medium text-encre/50">Partager :</span>

      <a
        href={`https://wa.me/?text=${texte}%20${lien}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Partager sur WhatsApp"
        title="Partager sur WhatsApp"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm transition-transform hover:scale-105"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
          <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.7.31 1.26.49 1.69.62.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z" />
          <path d="M12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.31-1.65a11.88 11.88 0 005.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89A11.82 11.82 0 0012.05 0zm0 21.77h-.01a9.87 9.87 0 01-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 01-1.51-5.26C2.16 6.44 6.6 2 12.05 2c2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 012.89 6.99c0 5.44-4.44 9.88-9.88 9.88z" />
        </svg>
      </a>

      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${lien}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Partager sur Facebook"
        title="Partager sur Facebook"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-sm transition-transform hover:scale-105"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
          <path d="M9.2 21.5h4v-8.01h3.6l.4-3.98h-4V7.5a1 1 0 011-1h3v-4h-3a5 5 0 00-5 5v2.01H6.8l-.4 3.98h2.8z" />
        </svg>
      </a>

      <a
        href={`https://twitter.com/intent/tweet?url=${lien}&text=${texte}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Partager sur X"
        title="Partager sur X"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white shadow-sm transition-transform hover:scale-105"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-[15px] w-[15px]">
          <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.22-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23zm-1.16 17.52h1.83L7.08 4.13H5.12z" />
        </svg>
      </a>

      <button
        type="button"
        onClick={copierLien}
        aria-label="Copier le lien"
        title="Copier le lien"
        className="flex h-9 items-center gap-1.5 rounded-full bg-fond-clair px-3 text-xs font-medium text-encre/80 transition-colors hover:bg-primaire hover:text-white"
      >
        <IconeCopier />
        {copie ? 'Copié !' : 'Copier le lien'}
      </button>
    </div>
  )
}
