import { createClient } from '@/lib/supabase/server'
import ContenuFormatte from '@/components/contenu-formatte'

export const dynamic = 'force-dynamic'

export default async function PageArtsCulinaires() {
  const supabase = await createClient()

  const { data: articles } = await supabase
    .from('articles')
    .select('id, title, content, published_at, profiles!articles_author_id_fkey(first_name, last_name)')
    .eq('categorie', 'culture_culinaire')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <a href="/culture-mabi" className="text-xs font-medium text-primaire hover:underline">← Culture Mabi</a>
      <h1 className="mb-2 mt-2 font-display text-3xl font-semibold text-encre">Arts culinaires Mabi</h1>
      <p className="mb-8 text-encre/70">Recettes, saveurs et traditions culinaires de notre peuple.</p>

      {articles && articles.length > 0 ? (
        <div className="space-y-8">
          {articles.map((a: any) => (
            <article key={a.id} className="border-b border-black/10 pb-8">
              <h2 className="mb-1 font-display text-xl font-semibold text-encre">{a.title}</h2>
              <p className="mb-3 font-mono text-xs text-encre/50">
                Par {a.profiles?.first_name} {a.profiles?.last_name} — {new Date(a.published_at).toLocaleDateString('fr-FR')}
              </p>
              <ContenuFormatte texte={a.content} />
            </article>
          ))}
        </div>
      ) : (
        <p className="text-sm text-encre/60">Aucun article culinaire publié pour le moment.</p>
      )}
    </div>
  )
}