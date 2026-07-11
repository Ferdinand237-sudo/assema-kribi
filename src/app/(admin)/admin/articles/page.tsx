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
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Articles à valider</h1>

      {articles && articles.length > 0 ? (
        <div className="space-y-4">
          {articles.map((a: any) => (
            <div key={a.id} className="rounded border p-4">
              <p className="text-xs uppercase text-primaire">
                {a.categorie === 'commission' ? a.commissions?.nom : (a.categorie === 'culture_contes' ? 'Contes & légendes Mabi' : 'Arts culinaires Mabi')}
              </p>
              <h3 className="font-semibold">{a.title}</h3>
              <p className="text-xs text-gray-500">Par {a.profiles?.first_name} {a.profiles?.last_name}</p>
              <ContenuFormatte texte={a.content} />

              <div className="mt-3 flex gap-2">
                <form action={validerArticle}>
                  <input type="hidden" name="articleId" value={a.id} />
                  <button type="submit" className="rounded bg-primaire px-3 py-1 text-sm text-white hover:bg-primaire-fonce">
                    Valider et publier
                  </button>
                </form>
                <form action={rejeterArticle} className="flex gap-2">
                  <input type="hidden" name="articleId" value={a.id} />
                  <input name="raison" placeholder="Raison du rejet (optionnel)" className="rounded border p-1 text-sm" />
                  <button type="submit" className="bouton bouton-danger !py-1">
                    Rejeter
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">Aucun article en attente de validation.</p>
      )}
    </div>
  )
}