import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { envoyerMessagePrive, ajouterParticipant, retirerParticipant } from '../actions'
import DiscussionPriveeFil from '@/components/discussion-privee-fil'

export const dynamic = 'force-dynamic'

export default async function PageDiscussionPrivee({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: forumId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const { data: forum } = await supabase
    .from('forums_prives')
    .select('id, titre, created_by, profiles(first_name, last_name)')
    .eq('id', forumId)
    .single()

  if (!forum) notFound()

  const { data: participants } = await supabase
    .from('forum_prive_participants')
    .select('id, profile_id, profiles(id, first_name, last_name)')
    .eq('forum_id', forumId)

  const estCreateur = forum.created_by === user.id
  const estParticipant = (participants ?? []).some((p: any) => p.profile_id === user.id)
  if (!estCreateur && !estParticipant) redirect('/discussions')

  const { data: messages } = await supabase
    .from('forum_prive_messages')
    .select('id, author_id, content, created_at, profiles(first_name, last_name)')
    .eq('forum_id', forumId)
    .order('created_at', { ascending: true })

  let profilsAAjouter: { id: string; first_name: string | null; last_name: string | null }[] = []
  if (estCreateur) {
    const idsExclus = [user.id, ...(participants ?? []).map((p: any) => p.profile_id)]
    const { data } = await supabase
      .from('profiles')
      .select('id, first_name, last_name')
      .not('id', 'in', `(${idsExclus.join(',')})`)
      .order('first_name')
    profilsAAjouter = data ?? []
  }

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col">
      <div className="mx-auto flex w-full min-h-0 max-w-2xl flex-1 flex-col px-6 py-4">
        <div className="mb-2 border-b border-black/10 pb-3">
          <a href="/discussions" className="text-xs font-medium text-primaire hover:underline">← Discussions privées</a>
          <h1 className="mt-1 font-display text-xl font-semibold text-encre">{forum.titre}</h1>
          <p className="mt-1 text-xs text-encre/50">
            Créée par {(forum as any).profiles?.first_name} {(forum as any).profiles?.last_name}
            {participants && participants.length > 0 && (
              <> · avec {(participants as any[]).map((p) => `${p.profiles?.first_name} ${p.profiles?.last_name}`).join(', ')}</>
            )}
          </p>

          {estCreateur && (
            <details className="mt-2">
              <summary className="cursor-pointer text-xs font-medium text-primaire hover:underline">Gérer les participants</summary>
              <div className="mt-2 space-y-2">
                {(participants ?? []).map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between text-xs text-encre/70">
                    <span>{p.profiles?.first_name} {p.profiles?.last_name}</span>
                    <form action={retirerParticipant}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="forumId" value={forumId} />
                      <button type="submit" className="text-erreur hover:underline">Retirer</button>
                    </form>
                  </div>
                ))}
                {profilsAAjouter.length > 0 && (
                  <form action={ajouterParticipant} className="flex items-center gap-2">
                    <input type="hidden" name="forumId" value={forumId} />
                    <select name="profileId" required className="champ !w-auto !py-1 text-xs">
                      {profilsAAjouter.map((p) => (
                        <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
                      ))}
                    </select>
                    <button type="submit" className="bouton bouton-secondaire !py-1 text-xs">Ajouter</button>
                  </form>
                )}
              </div>
            </details>
          )}
        </div>

        <DiscussionPriveeFil
          messages={(messages ?? []) as any}
          userId={user.id}
          forumId={forumId}
          envoyerMessagePrive={envoyerMessagePrive}
        />
      </div>
    </div>
  )
}
