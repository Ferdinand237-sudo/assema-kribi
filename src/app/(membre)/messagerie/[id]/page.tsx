import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { envoyerMessage } from '../actions'

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
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-2xl flex-col px-6 py-6">
      <div className="mb-4 flex items-center gap-3 border-b border-black/10 pb-3">
        {autreProfil.avatar_url && (
          <img src={autreProfil.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover" />
        )}
        <div>
          <p className="font-semibold text-encre">{autreProfil.first_name} {autreProfil.last_name}</p>
          <a href={`/membres/${autreId}`} className="text-xs text-primaire hover:underline">Voir le profil</a>
        </div>
      </div>

      {erreur === 'refuse' && (
        <p className="badge-erreur mb-3 block w-fit rounded-lg px-4 py-3 text-sm">
          Ce membre n'accepte pas les messages privés pour le moment.
        </p>
      )}

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
        {messages?.map((m) => (
          <div
            key={m.id}
            className={`max-w-[70%] rounded-lg p-2 text-sm ${
              m.sender_id === user.id ? 'ml-auto bg-primaire text-white' : 'bg-fond-clair text-encre'
            }`}
          >
            {m.content}
          </div>
        ))}
        {(!messages || messages.length === 0) && (
          <p className="text-sm text-encre/60">Aucun message pour l'instant. Lance la conversation !</p>
        )}
      </div>

      {autreProfil.allow_messages ? (
        <form action={envoyerMessage} className="mt-3 flex gap-2 border-t border-black/10 pt-3">
          <input type="hidden" name="receiverId" value={autreId} />
          <input name="content" placeholder="Écris ton message..." required className="champ flex-1" />
          <button type="submit" className="bouton bouton-primaire">
            Envoyer
          </button>
        </form>
      ) : (
        <p className="mt-3 border-t border-black/10 pt-3 text-sm text-encre/60">
          Ce membre n'accepte pas les messages privés.
        </p>
      )}
    </div>
  )
}