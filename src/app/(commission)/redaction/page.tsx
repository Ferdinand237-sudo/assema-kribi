import { requireRedacteur } from '@/lib/auth/guards'
import { creerArticle } from './actions'
import EditeurFormatte from '@/components/editeur-formatte'

export const dynamic = 'force-dynamic'

const LABELS_STATUT: Record<string, { label: string; classe: string }> = {
  draft: { label: 'Brouillon', classe: 'badge-neutre' },
  pending: { label: 'En attente de validation', classe: 'badge-attente' },
  published: { label: 'Publié', classe: 'badge-succes' },
  rejected: { label: 'Rejeté', classe: 'badge-erreur' },
}

const LABELS_CATEGORIE: Record<string, string> = {
  commission: 'Commission',
  culture_contes: 'Contes & légendes Mabi',
  culture_culinaire: 'Arts culinaires Mabi',
}

export default async function PageRedaction() {
  const { supabase, profile, commissions, rubriquesCulture } = await requireRedacteur()

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

      <form action={creerArticle} className="cadre mb-8 space-y-3 border border-black/10 bg-white p-4 pt-5 shadow-sm">
        <h2 className="font-semibold text-encre">Nouvel article</h2>

        {commissions.length > 0 && (
          <div className="rounded-lg border border-black/10 p-3">
            <label className="flex items-center gap-2 text-sm text-encre/85">
              <input type="radio" name="categorie" value="commission" defaultChecked required className="accent-primaire" />
              Article de commission
            </label>
            <select name="commissionId" className="champ mt-2 text-sm">
              {commissions.map((c) => (
                <option key={c.id} value={c.id}>{c.nom}</option>
              ))}
            </select>
          </div>
        )}

        {rubriquesCulture.map((r) => (
          <label key={r.valeur} className="flex items-center gap-2 rounded-lg border border-black/10 p-3 text-sm text-encre/85">
            <input type="radio" name="categorie" value={r.valeur} required={commissions.length === 0} className="accent-primaire" />
            {r.label}
          </label>
        ))}

        <input name="title" placeholder="Titre" required className="champ" />
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

      <h2 className="mb-3 font-semibold text-encre">Mes articles</h2>
      <div className="space-y-3">
        {mesArticles?.map((a: any) => {
          const statut = LABELS_STATUT[a.status]
          const sourceLabel = a.categorie === 'commission' ? a.commissions?.nom : LABELS_CATEGORIE[a.categorie]
          return (
            <div key={a.id} className="cadre border border-black/10 bg-white p-3 pt-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="font-medium text-encre">{a.title}</p>
                <span className={`badge-statut ${statut.classe}`}>{statut.label}</span>
              </div>
              <p className="text-xs text-encre/50">{sourceLabel}</p>
              {a.status === 'rejected' && a.rejection_reason && (
                <p className="mt-1 text-xs text-erreur">Motif du rejet : {a.rejection_reason}</p>
              )}
              {(a.status === 'draft' || a.status === 'rejected') && (
                <a href={`/redaction/${a.id}`} className="mt-1 inline-block text-xs font-medium text-primaire hover:underline">
                  Modifier
                </a>
              )}
            </div>
          )
        })}
        {(!mesArticles || mesArticles.length === 0) && (
          <p className="text-sm text-encre/60">Tu n'as encore rédigé aucun article.</p>
        )}
      </div>
    </div>
  )
}