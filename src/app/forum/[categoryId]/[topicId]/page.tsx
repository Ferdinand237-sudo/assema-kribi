import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { repondreSujet } from '../../actions'
import ForumFil from '@/components/forum-fil'

export const dynamic = 'force-dynamic'

export default async function PageSujet({
  params,
}: {
  params: Promise<{ categoryId: string; topicId: string }>
}) {
  const { categoryId, topicId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const { data: sujet } = await supabase
    .from('forum_topics')
    .select('id, title, profiles(first_name, last_name)')
    .eq('id', topicId)
    .single()

  if (!sujet) notFound()

  const { data: messages } = await supabase
    .from('forum_posts')
    .select(
      'id, content, created_at, author_id, profiles(first_name, last_name, avatar_url), message_cite:forum_posts!forum_posts_reply_to_id_fkey(id, content, profiles(first_name, last_name))'
    )
    .eq('topic_id', topicId)
    .order('created_at', { ascending: true })

  return (
    <div className="min-h-[calc(100dvh-4rem)]">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <a href={`/forum/${categoryId}`} className="text-xs font-medium text-primaire hover:underline">← Retour à la catégorie</a>
        <h1 className="mb-1 mt-2 text-2xl font-semibold text-encre">{sujet.title}</h1>
        <p className="mb-6 text-xs text-encre/50">
          Lancé par {(sujet.profiles as any)?.first_name} {(sujet.profiles as any)?.last_name}
        </p>

        <ForumFil
          messages={(messages ?? []) as any}
          topicId={topicId}
          categoryId={categoryId}
          repondreSujet={repondreSujet}
        />
      </div>
    </div>
  )
}