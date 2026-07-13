'use client'

import { useOptimistic, useRef } from 'react'
import BoutonEnvoiFleche from '@/components/bouton-envoi-fleche'

type Message = {
  id: string
  sender_id: string
  content: string
  created_at: string
}

export default function MessagerieFil({
  messages,
  userId,
  autreId,
  envoyerMessage,
}: {
  messages: Message[]
  userId: string
  autreId: string
  envoyerMessage: (formData: FormData) => Promise<void>
}) {
  const [messagesOptimistes, ajouterOptimiste] = useOptimistic(
    messages,
    (etat: Message[], contenu: string) => [
      ...etat,
      { id: `temp-${Date.now()}`, sender_id: userId, content: contenu, created_at: new Date().toISOString() },
    ]
  )
  const formRef = useRef<HTMLFormElement>(null)

  async function envoyerAvecOptimisme(formData: FormData) {
    const contenu = (formData.get('content') as string)?.trim()
    if (!contenu) return
    ajouterOptimiste(contenu)
    formRef.current?.reset()
    await envoyerMessage(formData)
  }

  return (
    <>
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto py-3">
        {messagesOptimistes.map((m) => {
          const estMoi = m.sender_id === userId
          return (
            <div key={m.id} className={`flex ${estMoi ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                  estMoi ? 'rounded-br-md bg-primaire text-white' : 'rounded-bl-md bg-white text-encre'
                } ${m.id.startsWith('temp-') ? 'opacity-60' : ''}`}
              >
                <p className="whitespace-pre-wrap break-words">{m.content}</p>
                <p className={`mt-1 text-right font-mono text-[10px] ${estMoi ? 'text-white/60' : 'text-encre/35'}`}>
                  {new Date(m.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )
        })}
        {messagesOptimistes.length === 0 && (
          <p className="text-sm text-encre/60">Aucun message pour l'instant. Lance la conversation !</p>
        )}
      </div>

      <form ref={formRef} action={envoyerAvecOptimisme} className="flex items-end gap-2 border-t border-black/10 pt-3">
        <input type="hidden" name="receiverId" value={autreId} />
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
