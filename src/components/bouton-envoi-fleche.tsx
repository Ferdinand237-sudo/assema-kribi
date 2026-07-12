'use client'

import { useFormStatus } from 'react-dom'

export default function BoutonEnvoiFleche() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" disabled={pending} className="bouton-fleche" aria-label="Envoyer le message">
      {pending ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="M12 19V5" />
          <path d="M6 11l6-6 6 6" />
        </svg>
      )}
    </button>
  )
}
