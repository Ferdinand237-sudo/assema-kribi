'use client'

import { useState } from 'react'
import ZoomableImage from '@/components/zoomable-image'
import ContenuFormatte from '@/components/contenu-formatte'
import EditeurFormatte from '@/components/editeur-formatte'
import BoutonEnvoi from '@/components/bouton-envoi'

type Auteur = { first_name: string | null; last_name: string | null; avatar_url?: string | null }
type MessageCite = { id: string; content: string; profiles: Auteur | null }

type Message = {
  id: string
  content: string
  created_at: string
  author_id: string
  profiles: Auteur | null
  // PostgREST renvoie l'embed auto-référencé sous forme de tableau (0 ou 1 élément)
  message_cite: MessageCite[]
}

function nomComplet(a: Auteur | null | undefined) {
  if (!a) return 'Membre'
  return `${a.first_name ?? ''} ${a.last_name ?? ''}`.trim() || 'Membre'
}

export default function ForumFil({
  messages,
  topicId,
  categoryId,
  repondreSujet,
}: {
  messages: Message[]
  topicId: string
  categoryId: string
  repondreSujet: (formData: FormData) => void
}) {
  const [citeId, setCiteId] = useState<string | null>(null)
  const messageCite = messages.find((m) => m.id === citeId) ?? null

  return (
    <div>
      <div className="mb-6 space-y-3">
        {messages.map((m) => {
          const cite = m.message_cite?.[0]
          return (
            <div key={m.id} id={`message-${m.id}`} className="cadre group border border-black/5 bg-white p-3 pt-4 shadow-sm">
              <div className="mb-1.5 flex items-center gap-2">
                {m.profiles?.avatar_url ? (
                  <ZoomableImage src={m.profiles.avatar_url} alt="" className="h-7 w-7 rounded-full object-cover" />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-fond-clair font-display text-xs text-primaire">
                    {m.profiles?.first_name?.[0] ?? '?'}
                  </div>
                )}
                <p className="text-sm font-medium text-encre">{nomComplet(m.profiles)}</p>
                <p className="font-mono text-[11px] text-encre/40">
                  {new Date(m.created_at).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {cite && (
                <a
                  href={`#message-${cite.id}`}
                  className="mb-2 block rounded-md border-l-[3px] border-primaire/50 bg-fond-clair/60 px-3 py-1.5 text-xs text-encre/70 hover:bg-fond-clair"
                >
                  <span className="font-medium text-primaire">{nomComplet(cite.profiles)}</span>
                  <span className="ml-1 line-clamp-1 opacity-80">{cite.content}</span>
                </a>
              )}

              <ContenuFormatte texte={m.content} />

              <button
                type="button"
                onClick={() => setCiteId(m.id)}
                className="mt-2 text-xs font-medium text-primaire opacity-0 transition-opacity hover:underline group-hover:opacity-100 focus:opacity-100"
              >
                ↩ Répondre
              </button>
            </div>
          )
        })}
        {messages.length === 0 && (
          <p className="text-sm text-encre/60">Aucun message pour l'instant, sois le premier à répondre !</p>
        )}
      </div>

      <form action={repondreSujet} className="cadre space-y-2 border border-black/10 bg-white p-3 pt-4 shadow-sm">
        <input type="hidden" name="topicId" value={topicId} />
        <input type="hidden" name="categoryId" value={categoryId} />
        <input type="hidden" name="replyToId" value={citeId ?? ''} />

        {messageCite && (
          <div className="flex items-start justify-between gap-2 rounded-md border-l-[3px] border-primaire/50 bg-fond-clair/60 px-3 py-1.5 text-xs text-encre/70">
            <div className="min-w-0">
              <span className="font-medium text-primaire">Réponse à {nomComplet(messageCite.profiles)}</span>
              <p className="line-clamp-1 opacity-80">{messageCite.content}</p>
            </div>
            <button type="button" onClick={() => setCiteId(null)} aria-label="Annuler la réponse" className="flex-shrink-0 text-encre/50 hover:text-encre">
              ✕
            </button>
          </div>
        )}

        <EditeurFormatte name="content" placeholder="Ta réponse..." rows={3} required />
        <div className="flex justify-end">
          <BoutonEnvoi texteEnvoi="Envoi...">Répondre</BoutonEnvoi>
        </div>
      </form>
    </div>
  )
}
