import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { envoyerMessage } from '../actions'
import ZoomableImage from '@/components/zoomable-image'
import MessagerieFil from '@/components/messagerie-fil'

export const dynamic = 'force-dynamic'

export default async function PageConversation({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ erreur?: string }>
}) {
  const { id: autreId } = await params
  const { erreur } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const { data: autreProfil } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, avatar_url, allow_messages')
    .eq('id', autreId)
    .single()

  if (!autreProfil) notFound()

  await supabase
    .from('messages')
    .update({ read: true })
    .eq('sender_id', autreId)
    .eq('receiver_id', user.id)
    .eq('read', false)

  const { data: messages } = await supabase
    .from('messages')
    .select('id, sender_id, content, created_at')
    .or(`and(sender_id.eq.${user.id},receiver_id.eq.${autreId}),and(sender_id.eq.${autreId},receiver_id.eq.${user.id})`)
    .order('created_at', { ascending: true })

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col">
      <div className="mx-auto flex w-full min-h-0 max-w-2xl flex-1 flex-col px-6 py-4">
        <div className="mb-2 flex items-center gap-3 border-b border-black/10 pb-3">
          {autreProfil.avatar_url && (
            <ZoomableImage src={autreProfil.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover" />
          )}
          <div>
            <p className="font-semibold text-encre">{autreProfil.first_name} {autreProfil.last_name}</p>
            <a href={`/membres/${autreId}`} className="text-xs text-primaire hover:underline">Voir le profil</a>
          </div>
        </div>

        {erreur === 'refuse' && (
          <p className="badge-erreur mb-3 mt-3 block w-fit rounded-lg px-4 py-3 text-sm">
            Ce membre n'accepte pas les messages privés pour le moment.
          </p>
        )}

        {autreProfil.allow_messages ? (
          <MessagerieFil messages={messages ?? []} userId={user.id} autreId={autreId} envoyerMessage={envoyerMessage} />
        ) : (
          <>
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto py-3">
              {messages?.map((m) => {
                const estMoi = m.sender_id === user.id
                return (
                  <div key={m.id} className={`flex ${estMoi ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                        estMoi ? 'rounded-br-md bg-primaire text-white' : 'rounded-bl-md bg-white text-encre'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{m.content}</p>
                      <p className={`mt-1 text-right font-mono text-[10px] ${estMoi ? 'text-white/60' : 'text-encre/35'}`}>
                        {new Date(m.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                )
              })}
              {(!messages || messages.length === 0) && (
                <p className="text-sm text-encre/60">Aucun message pour l'instant. Lance la conversation !</p>
              )}
            </div>
            <p className="border-t border-black/10 pt-3 text-sm text-encre/60">
              Ce membre n'accepte pas les messages privés.
            </p>
          </>
        )}
      </div>
    </div>
  )
}