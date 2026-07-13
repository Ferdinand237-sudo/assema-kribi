'use client'

import { useOptimistic, useState } from 'react'
import EditeurFormatte from '@/components/editeur-formatte'
import BoutonEnvoi from '@/components/bouton-envoi'
import BoutonConfirmation from '@/components/bouton-confirmation'

type Article = {
  id: string
  title: string
  status: string
  categorie: string
  rejection_reason: string | null
  commissions: { nom: string } | null
}

type Commission = { id: string; nom: string }
type RubriqueCulture = { valeur: string; label: string }

type ActionListe =
  | { type: 'ajouter'; article: Article }
  | { type: 'retirer'; id: string }

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

export default function RedactionFil({
  mesArticles,
  commissions,
  rubriquesCulture,
  estAdminOuPresident,
  creerArticle,
  supprimerArticle,
  uploaderImageContenu,
}: {
  mesArticles: Article[]
  commissions: Commission[]
  rubriquesCulture: RubriqueCulture[]
  estAdminOuPresident: boolean
  creerArticle: (formData: FormData) => Promise<void>
  supprimerArticle: (formData: FormData) => Promise<void>
  uploaderImageContenu: (formData: FormData) => Promise<{ url: string } | { erreur: string }>
}) {
  const [articlesOptimistes, appliquer] = useOptimistic(
    mesArticles,
    (etat: Article[], action: ActionListe) => {
      if (action.type === 'ajouter') return [action.article, ...etat]
      return etat.filter((a) => a.id !== action.id)
    }
  )
  const [cleFormulaire, setCleFormulaire] = useState(0)

  async function creerArticleOptimiste(formData: FormData) {
    const title = formData.get('title') as string
    const categorie = formData.get('categorie') as string
    const commissionId = formData.get('commissionId') as string
    const actionSoumission = formData.get('_action') as string
    const status = actionSoumission === 'publier_directement' ? 'published' : actionSoumission === 'soumettre' ? 'pending' : 'draft'
    const commissionNom = categorie === 'commission' ? commissions.find((c) => c.id === commissionId)?.nom ?? null : null

    appliquer({
      type: 'ajouter',
      article: {
        id: `temp-${Date.now()}`,
        title,
        status,
        categorie,
        rejection_reason: null,
        commissions: commissionNom ? { nom: commissionNom } : null,
      },
    })
    setCleFormulaire((n) => n + 1)

    await creerArticle(formData)
  }

  async function supprimerArticleOptimiste(id: string, formData: FormData) {
    appliquer({ type: 'retirer', id })
    await supprimerArticle(formData)
  }

  return (
    <>
      <form key={cleFormulaire} action={creerArticleOptimiste} className="cadre mb-8 space-y-3 border border-black/10 bg-white p-4 pt-5 shadow-sm">
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
        <EditeurFormatte name="content" placeholder="Contenu de l'article" required televerserImage={uploaderImageContenu} />
        <div className="flex flex-wrap gap-2">
          <BoutonEnvoi name="_action" value="brouillon" className="bouton bouton-secondaire" texteEnvoi="Enregistrement...">
            Enregistrer en brouillon
          </BoutonEnvoi>
          {estAdminOuPresident ? (
            <BoutonEnvoi name="_action" value="publier_directement" className="bouton bouton-primaire" texteEnvoi="Publication...">
              Publier directement
            </BoutonEnvoi>
          ) : (
            <BoutonEnvoi name="_action" value="soumettre" className="bouton bouton-primaire" texteEnvoi="Envoi...">
              Soumettre au président
            </BoutonEnvoi>
          )}
        </div>
      </form>

      <h2 className="mb-3 font-semibold text-encre">Mes articles</h2>
      <div className="space-y-3">
        {articlesOptimistes.map((a) => {
          const statut = LABELS_STATUT[a.status]
          const sourceLabel = a.categorie === 'commission' ? a.commissions?.nom : LABELS_CATEGORIE[a.categorie]
          const enAttenteEnvoi = a.id.startsWith('temp-')
          return (
            <div key={a.id} className={`cadre border border-black/10 bg-white p-3 pt-4 shadow-sm ${enAttenteEnvoi ? 'opacity-60' : ''}`}>
              <div className="flex items-center justify-between">
                <p className="font-medium text-encre">{a.title}</p>
                <span className={`badge-statut ${statut.classe}`}>{statut.label}</span>
              </div>
              <p className="text-xs text-encre/50">{sourceLabel}</p>
              {a.status === 'rejected' && a.rejection_reason && (
                <p className="mt-1 text-xs text-erreur">Motif du rejet : {a.rejection_reason}</p>
              )}
              {!enAttenteEnvoi && (
                <div className="mt-2 flex items-center gap-3">
                  <a href={`/redaction/${a.id}`} className="text-xs font-medium text-primaire hover:underline">
                    Modifier
                  </a>
                  <form action={supprimerArticleOptimiste.bind(null, a.id)}>
                    <input type="hidden" name="articleId" value={a.id} />
                    <BoutonConfirmation
                      message={`Supprimer définitivement l'article "${a.title}" ?`}
                      className="text-xs font-medium text-erreur hover:underline"
                    >
                      Supprimer
                    </BoutonConfirmation>
                  </form>
                </div>
              )}
            </div>
          )
        })}
        {articlesOptimistes.length === 0 && (
          <p className="text-sm text-encre/60">Tu n'as encore rédigé aucun article.</p>
        )}
      </div>
    </>
  )
}
