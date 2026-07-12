'use client'

import { useRef, useState } from 'react'
import ContenuFormatte from '@/components/contenu-formatte'

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
  const [valeur, setValeur] = useState(defaultValue ?? '')
  const [ongletApercu, setOngletApercu] = useState(false)

  function inserer(avant: string, apres: string = '') {
    const textarea = ref.current
    if (!textarea) return

    const debut = textarea.selectionStart
    const fin = textarea.selectionEnd
    const texte = textarea.value
    const selection = texte.slice(debut, fin)

    const nouveauTexte = texte.slice(0, debut) + avant + selection + apres + texte.slice(fin)
    setValeur(nouveauTexte)
    textarea.focus()

    requestAnimationFrame(() => {
      const nouvellePosition = debut + avant.length + selection.length + apres.length
      textarea.setSelectionRange(nouvellePosition, nouvellePosition)
    })
  }

  const boutons = [
    { label: 'Titre', avant: '## ', apres: '', icone: <span className="font-display text-sm font-semibold">H</span> },
    { label: 'Gras', avant: '**', apres: '**', icone: <span className="font-semibold">G</span> },
    { label: 'Italique', avant: '*', apres: '*', icone: <span className="italic">I</span> },
    { label: 'Citation', avant: '> ', apres: '', icone: <span className="text-base leading-none">”</span> },
    { label: 'Liste à puces', avant: '- ', apres: '', icone: <span className="text-base leading-none">•</span> },
    { label: 'Liste numérotée', avant: '1. ', apres: '', icone: <span className="text-xs font-medium">1.</span> },
    { label: 'Lien', avant: '[texte](', apres: 'https://)', icone: <span className="text-sm">🔗</span> },
  ]

  return (
    <div className="overflow-hidden rounded-lg border border-[#D1D9E0]">
      <div className="flex flex-wrap items-center gap-1 border-b border-[#D1D9E0] bg-fond-clair p-1.5">
        {boutons.map((b) => (
          <button
            key={b.label}
            type="button"
            title={b.label}
            disabled={ongletApercu}
            onClick={() => inserer(b.avant, b.apres)}
            className="flex h-7 w-7 items-center justify-center rounded text-encre/80 hover:bg-white disabled:opacity-30"
          >
            {b.icone}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-1 rounded-md bg-white/70 p-0.5">
          <button
            type="button"
            onClick={() => setOngletApercu(false)}
            className={`rounded px-2 py-1 text-xs font-medium transition-colors ${!ongletApercu ? 'bg-primaire text-white' : 'text-encre/60 hover:text-encre'}`}
          >
            Écrire
          </button>
          <button
            type="button"
            onClick={() => setOngletApercu(true)}
            className={`rounded px-2 py-1 text-xs font-medium transition-colors ${ongletApercu ? 'bg-primaire text-white' : 'text-encre/60 hover:text-encre'}`}
          >
            Aperçu
          </button>
        </div>
      </div>

      {ongletApercu && (
        <div className="p-3" style={{ minHeight: `${rows * 1.6}rem` }}>
          {valeur.trim() ? (
            <ContenuFormatte texte={valeur} />
          ) : (
            <p className="text-sm text-encre/40">Rien à prévisualiser pour l'instant.</p>
          )}
        </div>
      )}
      {/* Le textarea reste monté même sous l'aperçu : sinon son contenu disparaît de l'envoi du formulaire */}
      <textarea
        ref={ref}
        name={name}
        value={valeur}
        onChange={(e) => setValeur(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className={`w-full border-0 p-2 text-encre focus:outline-none focus:ring-1 focus:ring-primaire ${ongletApercu ? 'hidden' : ''}`}
      />

      {!ongletApercu && (
        <p className="border-t border-[#D1D9E0] bg-fond-clair/50 px-2 py-1 text-[11px] text-encre/40">
          Markdown supporté — utilise les boutons ci-dessus ou l'onglet Aperçu pour vérifier le rendu final.
        </p>
      )}
    </div>
  )
}
