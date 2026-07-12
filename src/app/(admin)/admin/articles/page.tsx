import { requireAdminOuPresident } from '@/lib/auth/guards'
import { validerArticle, rejeterArticle } from './actions'
import ContenuFormatte from '@/components/contenu-formatte'

export const dynamic = 'force-dynamic'

export default async function PageAdminArticles() {
  const { supabase } = await requireAdminOuPresident()

  const { data: articles } = await supabase
    .from('articles')
    .select('id, title, content, created_at, categorie, commissions(nom), profiles!articles_author_id_fkey(first_name, last_name)')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-6 font-display text-2xl font-semibold text-encre sm:text-3xl">Articles à valider</h1>

      {articles && articles.length > 0 ? (
        <div className="space-y-4">
          {articles.map((a: any) => (
            <div key={a.id} className="cadre border border-black/5 bg-white p-4 pt-5 shadow-sm">
              <p className="font-mono text-xs uppercase tracking-wide text-primaire">
                {a.categorie === 'commission' ? a.commissions?.nom : (a.categorie === 'culture_contes' ? 'Contes & légendes Mabi' : 'Arts culinaires Mabi')}
              </p>
              <h3 className="font-semibold text-encre">{a.title}</h3>
              <p className="text-xs text-encre/50">Par {a.profiles?.first_name} {a.profiles?.last_name}</p>
              <ContenuFormatte texte={a.content} />

              <div className="mt-3 flex flex-wrap gap-2">
                <form action={validerArticle}>
                  <input type="hidden" name="articleId" value={a.id} />
                  <button type="submit" className="bouton bouton-primaire !py-1.5">
                    Valider et publier
                  </button>
                </form>
                <form action={rejeterArticle} className="flex flex-wrap gap-2">
                  <input type="hidden" name="articleId" value={a.id} />
                  <input name="raison" placeholder="Raison du rejet (optionnel)" className="champ !w-auto flex-1 !py-1.5 text-sm" />
                  <button type="submit" className="bouton bouton-danger !py-1.5">
                    Rejeter
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-encre/60">Aucun article en attente de validation.</p>
      )}
    </div>
  )
}