import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { repondreSujet } from '../../actions'
import ContenuFormatte from '@/components/contenu-formatte'
import EditeurFormatte from '@/components/editeur-formatte'

export const dynamic = 'force-dynamic'

export default async function PageSujet({
  params,
}: {
  params: Promise<{ categoryId: string; topicId: string }>
}) {
  const { categoryId, topicId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: sujet } = await supabase
    .from('forum_topics')
    .select('id, title, profiles(first_name, last_name)')
    .eq('id', topicId)
    .single()

  if (!sujet) notFound()

  const { data: messages } = await supabase
    .from('forum_posts')
    .select('id, content, created_at, profiles(first_name, last_name, avatar_url)')
    .eq('topic_id', topicId)
    .order('created_at', { ascending: true })

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <a href={`/forum/${categoryId}`} className="text-xs font-medium text-primaire hover:underline">← Retour à la catégorie</a>
      <h1 className="mb-1 mt-2 text-2xl font-semibold text-encre">{sujet.title}</h1>
      <p className="mb-6 text-xs text-encre/50">
        Lancé par {(sujet.profiles as any)?.first_name} {(sujet.profiles as any)?.last_name}
      </p>

      <div className="mb-6 space-y-3">
        {messages?.map((m: any) => (
          <div key={m.id} className="rounded-lg border border-black/10 p-3">
            <div className="mb-1 flex items-center gap-2">
              {m.profiles?.avatar_url && (
                <img src={m.profiles.avatar_url} alt="" className="h-6 w-6 rounded-full object-cover" />
              )}
              <p className="text-sm font-medium text-encre">{m.profiles?.first_name} {m.profiles?.last_name}</p>
              <p className="font-mono text-xs text-encre/40">{new Date(m.created_at).toLocaleString('fr-FR')}</p>
            </div>
            <ContenuFormatte texte={m.content} />
          </div>
        ))}
      </div>

      {user ? (
        <form action={repondreSujet} className="space-y-2">
          <input type="hidden" name="topicId" value={topicId} />
          <input type="hidden" name="categoryId" value={categoryId} />
          <EditeurFormatte name="content" placeholder="Ta réponse..." rows={3} required />
          <button type="submit" className="bouton bouton-primaire">
            Répondre
          </button>
        </form>
      ) : (
        <p className="text-sm text-encre/60">
          <a href="/connexion" className="text-primaire hover:underline">Connecte-toi</a> pour répondre.
        </p>
      )}
    </div>
  )
}