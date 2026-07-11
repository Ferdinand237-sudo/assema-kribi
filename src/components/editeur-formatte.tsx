'use client'

import { useRef } from 'react'

export default function EditeurFormatte({
  name,
  defaultValue,
  placeholder,
  rows = 6,
  required = false,
}: {
  name: string
  defaultValue?: string
  placeholder?: string
  rows?: number
  required?: boolean
}) {
  const ref = useRef<HTMLTextAreaElement>(null)

  function inserer(avant: string, apres: string = '') {
    const textarea = ref.current
    if (!textarea) return

    const debut = textarea.selectionStart
    const fin = textarea.selectionEnd
    const texte = textarea.value
    const selection = texte.slice(debut, fin)

    const nouveauTexte = texte.slice(0, debut) + avant + selection + apres + texte.slice(fin)
    textarea.value = nouveauTexte
    textarea.focus()

    const nouvellePosition = debut + avant.length + selection.length + apres.length
    textarea.setSelectionRange(nouvellePosition, nouvellePosition)
  }

  const boutons = [
    { label: 'Gras', icone: 'G', avant: '**', apres: '**' },
    { label: 'Italique', icone: 'I', avant: '*', apres: '*' },
    { label: 'Titre', icone: 'H', avant: '## ', apres: '' },
    { label: 'Liste', icone: '•', avant: '- ', apres: '' },
    { label: 'Citation', icone: '"', avant: '> ', apres: '' },
    { label: 'Lien', icone: '🔗', avant: '[texte](', apres: 'https://)' },
  ]

  return (
    <div className="overflow-hidden rounded-lg border border-[#D1D9E0]">
      <div className="flex flex-wrap gap-1 border-b border-[#D1D9E0] bg-fond-clair p-1.5">
        {boutons.map((b) => (
          <button
            key={b.label}
            type="button"
            title={b.label}
            onClick={() => inserer(b.avant, b.apres)}
            className="rounded px-2 py-1 text-sm font-medium text-encre/80 hover:bg-white"
          >
            {b.icone}
          </button>
        ))}
        <span className="ml-auto self-center text-xs text-encre/40">Markdown supporté</span>
      </div>
      <textarea
        ref={ref}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className="w-full border-0 p-2 text-encre focus:outline-none focus:ring-1 focus:ring-primaire"
      />
    </div>
  )
}