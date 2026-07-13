import { createClient } from '@/lib/supabase/server'
import Reveal from '@/components/reveal'
import ZoomableImage from '@/components/zoomable-image'
import { extraireTexte } from '@/lib/texte'

export const dynamic = 'force-dynamic'

export default async function PageArtsCulinaires() {
  const supabase = await createClient()

  const { data: articles } = await supabase
    .from('articles')
    .select('id, title, content, cover_image_url, published_at, profiles!articles_author_id_fkey(first_name, last_name)')
    .eq('categorie', 'culture_culinaire')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <a href="/culture-mabi" className="text-xs font-medium text-primaire hover:underline">← Culture Mabi</a>
      <h1 className="mb-2 mt-2 font-display text-3xl font-semibold text-encre">Arts culinaires Mabi</h1>
      <p className="mb-8 text-encre/70">Recettes, saveurs et traditions culinaires de notre peuple.</p>

      {articles && articles.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {articles.map((a: any, i: number) => (
            <Reveal key={a.id} delayMs={i * 80}>
              <a href={`/articles/${a.id}`} className="carte-interactive block h-full overflow-hidden border border-black/5 bg-white shadow-sm">
                {a.cover_image_url && <ZoomableImage src={a.cover_image_url} alt="" className="h-40 w-full object-cover" />}
                <div className="p-4">
                  <h2 className="font-display text-lg font-semibold text-encre">{a.title}</h2>
                  <p className="mb-2 font-mono text-xs text-encre/50">
                    Par {a.profiles?.first_name} {a.profiles?.last_name} — {new Date(a.published_at).toLocaleDateString('fr-FR')}
                  </p>
                  <p className="line-clamp-2 text-sm text-encre/70">{extraireTexte(a.content, 160)}</p>
                  <p className="mt-2 text-xs font-medium text-primaire">Lire l'article →</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="text-sm text-encre/60">Aucun article culinaire publié pour le moment.</p>
      )}
    </div>
  )
}