import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { creerSujet } from '../actions'
import EditeurFormatte from '@/components/editeur-formatte'

export const dynamic = 'force-dynamic'

export default async function PageCategorie({
  params,
}: {
  params: Promise<{ categoryId: string }>
}) {
  const { categoryId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: categorie } = await supabase
    .from('forum_categories')
    .select('id, nom, description')
    .eq('id', categoryId)
    .single()

  if (!categorie) notFound()

  const { data: sujets } = await supabase
    .from('forum_topics')
    .select('id, title, created_at, profiles(first_name, last_name), forum_posts(id)')
    .eq('category_id', categoryId)
    .order('created_at', { ascending: false })

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <a href="/forum" className="text-xs font-medium text-primaire hover:underline">← Toutes les catégories</a>
      <h1 className="mb-1 mt-2 text-2xl font-semibold text-encre">{categorie.nom}</h1>
      {categorie.description && <p className="mb-6 text-sm text-encre/70">{categorie.description}</p>}

      {user ? (
        <form action={creerSujet} className="mb-8 space-y-3 rounded-lg border border-black/10 p-4">
          <input type="hidden" name="categoryId" value={categoryId} />
          <h2 className="font-semibold text-encre">Nouveau sujet</h2>
          <input name="title" placeholder="Titre du sujet" required className="champ" />
          <EditeurFormatte name="content" placeholder="Ton message" rows={4} required />
          <button type="submit" className="bouton bouton-primaire">
            Publier
          </button>
        </form>
      ) : (
        <p className="mb-8 text-sm text-encre/60">
          <a href="/connexion" className="text-primaire hover:underline">Connecte-toi</a> pour participer à la discussion.
        </p>
      )}

      <div className="space-y-2">
        {sujets?.map((s: any) => (
          <a key={s.id} href={`/forum/${categoryId}/${s.id}`} className="block rounded-lg border border-black/10 p-3 transition-colors hover:bg-fond-clair">
            <div className="flex items-center justify-between">
              <p className="font-medium text-encre">{s.title}</p>
              <span className="text-xs text-encre/50">{s.forum_posts?.length ?? 0} réponse(s)</span>
            </div>
            <p className="text-xs text-encre/50">
              par {s.profiles?.first_name} {s.profiles?.last_name} — {new Date(s.created_at).toLocaleDateString('fr-FR')}
            </p>
          </a>
        ))}
        {(!sujets || sujets.length === 0) && (
          <p className="text-sm text-encre/60">Aucun sujet pour le moment, sois le premier à en lancer un !</p>
        )}
      </div>
    </div>
  )
}