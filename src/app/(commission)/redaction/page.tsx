import { requireRedacteur } from '@/lib/auth/guards'
import { creerArticle, supprimerArticle, uploaderImageContenu } from './actions'
import RedactionFil from '@/components/redaction-fil'

export const dynamic = 'force-dynamic'

export default async function PageRedaction() {
  const { supabase, profile, commissions, rubriquesCulture } = await requireRedacteur()
  const estAdminOuPresident = ['admin', 'president'].includes(profile.role)

  const { data: mesArticles } = await supabase
    .from('articles')
    .select('id, title, status, categorie, rejection_reason, created_at, commissions(nom)')
    .eq('author_id', profile.id)
    .order('created_at', { ascending: false })

  const aucunAcces = commissions.length === 0 && rubriquesCulture.length === 0

  if (aucunAcces) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="mb-2 text-2xl font-semibold text-encre">Espace rédaction</h1>
        <p className="text-sm text-encre/70">
          Tu n'es actuellement affecté à aucune commission ni rubrique Culture Mabi. Contacte le président ou l'administrateur.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-encre">Espace rédaction</h1>

      <RedactionFil
        mesArticles={(mesArticles ?? []) as any}
        commissions={commissions}
        rubriquesCulture={rubriquesCulture}
        estAdminOuPresident={estAdminOuPresident}
        creerArticle={creerArticle}
        supprimerArticle={supprimerArticle}
        uploaderImageContenu={uploaderImageContenu}
      />
    </div>
  )
}
