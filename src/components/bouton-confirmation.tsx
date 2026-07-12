'use client'

export default function BoutonConfirmation({
  message,
  className = 'bouton bouton-danger',
  children,
}: {
  message: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault()
      }}
    >
      {children}
    </button>
  )
}
