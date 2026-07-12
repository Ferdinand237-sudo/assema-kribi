import { requireRedacteur } from '@/lib/auth/guards'
import { notFound } from 'next/navigation'
import { modifierArticle } from '../actions'
import EditeurFormatte from '@/components/editeur-formatte'

export default async function PageModifierArticle({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { supabase, profile } = await requireRedacteur()

  const { data: article } = await supabase
    .from('articles')
    .select('id, title, content, status, author_id')
    .eq('id', id)
    .single()

  if (!article || article.author_id !== profile.id) notFound()

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-6 font-display text-2xl font-semibold text-encre">Modifier l'article</h1>

      <form action={modifierArticle} className="cadre space-y-3 border border-black/10 bg-white p-4 pt-5 shadow-sm">
        <input type="hidden" name="articleId" value={article.id} />
        <input name="title" defaultValue={article.title} required className="champ" />
        <EditeurFormatte name="content" placeholder="Contenu de l'article" required />
        <div className="flex gap-2">
          <button type="submit" name="_action" value="brouillon" className="bouton bouton-secondaire">
            Enregistrer en brouillon
          </button>
          <button type="submit" name="_action" value="soumettre" className="bouton bouton-primaire">
            Soumettre au président
          </button>
        </div>
      </form>
    </div>
  )
}