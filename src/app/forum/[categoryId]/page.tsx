import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
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
  if (!user) redirect('/connexion')

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
    <div className="min-h-[calc(100dvh-4rem)]">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <a href="/forum" className="text-xs font-medium text-primaire hover:underline">← Toutes les catégories</a>
        <h1 className="mb-1 mt-2 text-2xl font-semibold text-encre">{categorie.nom}</h1>
        {categorie.description && <p className="mb-6 text-sm text-encre/70">{categorie.description}</p>}

        <form action={creerSujet} className="cadre mb-8 space-y-3 border border-black/10 bg-white p-4 pt-5 shadow-sm">
          <input type="hidden" name="categoryId" value={categoryId} />
          <h2 className="font-semibold text-encre">Nouveau sujet</h2>
          <input name="title" placeholder="Titre du sujet" required className="champ" />
          <EditeurFormatte name="content" placeholder="Ton message" rows={4} required />
          <button type="submit" className="bouton bouton-primaire">
            Publier
          </button>
        </form>

        <div className="space-y-2">
          {sujets?.map((s: any) => (
            <a
              key={s.id}
              href={`/forum/${categoryId}/${s.id}`}
              className="carte-interactive flex items-center justify-between gap-3 border border-black/5 bg-white p-3 pl-4 shadow-sm"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-encre">{s.title}</p>
                <p className="text-xs text-encre/50">
                  par {s.profiles?.first_name} {s.profiles?.last_name} — {new Date(s.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <span className="flex-shrink-0 whitespace-nowrap rounded-full bg-fond-clair px-2.5 py-1 text-xs font-medium text-primaire">
                {s.forum_posts?.length ?? 0} réponse{(s.forum_posts?.length ?? 0) > 1 ? 's' : ''}
              </span>
            </a>
          ))}
          {(!sujets || sujets.length === 0) && (
            <p className="text-sm text-encre/60">Aucun sujet pour le moment, sois le premier à en lancer un !</p>
          )}
        </div>
      </div>
    </div>
  )
}