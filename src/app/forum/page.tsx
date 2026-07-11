import { createClient } from '@/lib/supabase/server'
import { creerCategorie } from './actions'

export const dynamic = 'force-dynamic'

export default async function PageForum() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let estAdminOuPresident = false
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    estAdminOuPresident = !!profile && ['admin', 'president'].includes(profile.role)
  }

  const { data: categories } = await supabase
    .from('forum_categories')
    .select('id, nom, description, forum_topics(id)')
    .order('nom')

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-encre">Forum communautaire</h1>

      {estAdminOuPresident && (
        <form action={creerCategorie} className="mb-8 space-y-3 rounded-lg border border-black/10 p-4">
          <h2 className="font-semibold text-encre">Créer une catégorie</h2>
          <input name="nom" placeholder="Nom (ex: Entraide)" required className="champ" />
          <textarea name="description" placeholder="Description" rows={2} className="champ" />
          <button type="submit" className="bouton bouton-primaire">
            Créer
          </button>
        </form>
      )}

      <div className="space-y-3">
        {categories?.map((c: any) => (
          <a key={c.id} href={`/forum/${c.id}`} className="block rounded-lg border border-black/10 p-4 transition-colors hover:bg-fond-clair">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-encre">{c.nom}</h3>
              <span className="text-xs text-encre/50">{c.forum_topics?.length ?? 0} sujet(s)</span>
            </div>
            {c.description && <p className="mt-1 text-sm text-encre/70">{c.description}</p>}
          </a>
        ))}
        {(!categories || categories.length === 0) && (
          <p className="text-sm text-encre/60">
            Aucune catégorie pour le moment{estAdminOuPresident ? ', crée la première !' : '.'}
          </p>
        )}
      </div>
    </div>
  )
}