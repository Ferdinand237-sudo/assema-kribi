'use client'

import { useOptimistic, useRef } from 'react'
import BoutonEnvoiFleche from '@/components/bouton-envoi-fleche'

type Auteur = { first_name: string | null; last_name: string | null }
type Message = {
  id: string
  author_id: string
  content: string
  created_at: string
  profiles: Auteur | null
}

function nomComplet(a: Auteur | null | undefined) {
  if (!a) return 'Membre'
  return `${a.first_name ?? ''} ${a.last_name ?? ''}`.trim() || 'Membre'
}

export default function DiscussionPriveeFil({
  messages,
  userId,
  forumId,
  envoyerMessagePrive,
}: {
  messages: Message[]
  userId: string
  forumId: string
  envoyerMessagePrive: (formData: FormData) => Promise<void>
}) {
  const [messagesOptimistes, ajouterOptimiste] = useOptimistic(
    messages,
    (etat: Message[], contenu: string) => [
      ...etat,
      { id: `temp-${Date.now()}`, author_id: userId, content: contenu, created_at: new Date().toISOString(), profiles: null },
    ]
  )
  const formRef = useRef<HTMLFormElement>(null)

  async function envoyerAvecOptimisme(formData: FormData) {
    const contenu = (formData.get('content') as string)?.trim()
    if (!contenu) return
    ajouterOptimiste(contenu)
    formRef.current?.reset()
    await envoyerMessagePrive(formData)
  }

  return (
    <>
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto py-3">
        {messagesOptimistes.map((m) => {
          const estMoi = m.author_id === userId
          return (
            <div key={m.id} className={`flex ${estMoi ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                  estMoi ? 'rounded-br-md bg-primaire text-white' : 'rounded-bl-md bg-white text-encre'
                } ${m.id.startsWith('temp-') ? 'opacity-60' : ''}`}
              >
                {!estMoi && <p className="mb-0.5 text-xs font-medium text-primaire">{nomComplet(m.profiles)}</p>}
                <p className="whitespace-pre-wrap break-words">{m.content}</p>
                <p className={`mt-1 text-right font-mono text-[10px] ${estMoi ? 'text-white/60' : 'text-encre/35'}`}>
                  {new Date(m.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )
        })}
        {messagesOptimistes.length === 0 && (
          <p className="text-sm text-encre/60">Aucun message pour l'instant. Lance la discussion !</p>
        )}
      </div>

      <form ref={formRef} action={envoyerAvecOptimisme} className="flex items-end gap-2 border-t border-black/10 pt-3">
        <input type="hidden" name="forumId" value={forumId} />
        <textarea
          name="content"
          placeholder="Écris ton message... (retour à la ligne autorisé)"
          required
          rows={2}
          className="champ max-h-32 flex-1 resize-none"
        />
        <BoutonEnvoiFleche />
      </form>
    </>
  )
}
