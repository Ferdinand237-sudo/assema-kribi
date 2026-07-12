'use client'

import { useFormStatus } from 'react-dom'

export default function BoutonEnvoi({
  children,
  texteEnvoi = 'Envoi...',
  className = 'bouton bouton-primaire',
  ...props
}: {
  children: React.ReactNode
  texteEnvoi?: string
  className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { pending } = useFormStatus()

  return (
    <button type="submit" disabled={pending} className={className} {...props}>
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          {texteEnvoi}
        </span>
      ) : (
        children
      )}
    </button>
  )
}
