import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { creerCategorie } from './actions'

export const dynamic = 'force-dynamic'

export default async function PageForum() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

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
    <div className="min-h-[calc(100dvh-4rem)]">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="mb-1 text-2xl font-semibold text-encre">Forum communautaire</h1>
        <p className="mb-6 text-sm text-encre/60">Les échanges entre membres de l'ASSEMA, par catégorie.</p>

        {estAdminOuPresident && (
          <form action={creerCategorie} className="cadre mb-8 space-y-3 border border-black/10 bg-white p-4 pt-5 shadow-sm">
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
            <a
              key={c.id}
              href={`/forum/${c.id}`}
              className="carte-interactive flex items-center justify-between gap-3 border border-black/5 bg-white p-4 pl-5 shadow-sm"
            >
              <div>
                <h3 className="font-semibold text-encre">{c.nom}</h3>
                {c.description && <p className="mt-1 text-sm text-encre/70">{c.description}</p>}
              </div>
              <span className="flex-shrink-0 whitespace-nowrap rounded-full bg-fond-clair px-2.5 py-1 text-xs font-medium text-primaire">
                {c.forum_topics?.length ?? 0} sujet{(c.forum_topics?.length ?? 0) > 1 ? 's' : ''}
              </span>
            </a>
          ))}
          {(!categories || categories.length === 0) && (
            <p className="text-sm text-encre/60">
              Aucune catégorie pour le moment{estAdminOuPresident ? ', crée la première !' : '.'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}