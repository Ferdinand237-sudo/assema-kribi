import { requireAdminOuPresident } from '@/lib/auth/guards'
import { notFound } from 'next/navigation'
import { modifierCommunique } from '../actions'
import EditeurFormatte from '@/components/editeur-formatte'
import BoutonEnvoi from '@/components/bouton-envoi'

export const dynamic = 'force-dynamic'

export default async function PageModifierCommunique({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { supabase } = await requireAdminOuPresident()

  const [{ data: commissions }, { data: communique }] = await Promise.all([
    supabase.from('commissions').select('id, nom'),
    supabase
      .from('communiques')
      .select('id, title, content, date_evenement, lieu_evenement, canal_public, canal_bureau, canal_commission_id, canal_groupe_cible, criteres_ciblage')
      .eq('id', id)
      .single(),
  ])

  if (!communique) notFound()

  const criteres = (communique.criteres_ciblage ?? {}) as { niveau_etude?: string; filiere?: string; commission_id?: string }
  const dateEvenementLocale = communique.date_evenement
    ? new Date(communique.date_evenement).toISOString().slice(0, 16)
    : ''

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <a href="/admin/communiques" className="text-xs font-medium text-primaire hover:underline">← Communiqués & diffusion</a>
      <h1 className="mb-6 mt-2 font-display text-2xl font-semibold text-encre sm:text-3xl">Modifier le communiqué</h1>

      <form action={modifierCommunique} className="cadre space-y-3 border border-black/10 bg-white p-4 pt-5 shadow-sm">
        <input type="hidden" name="communiqueId" value={communique.id} />
        <input name="title" defaultValue={communique.title} placeholder="Titre" required className="champ" />
        <EditeurFormatte name="content" defaultValue={communique.content} placeholder="Contenu" rows={5} required />

        <div className="space-y-2 border-t border-black/10 pt-3">
          <p className="text-sm font-medium text-encre">Rencontre liée (optionnel)</p>
          <p className="text-xs text-encre/60">Si ce communiqué annonce un évènement, indique la date et le lieu pour qu'ils soient bien visibles.</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-encre/60">Date de l'évènement</label>
              <input name="date_evenement" type="datetime-local" defaultValue={dateEvenementLocale} className="champ" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-encre/60">Lieu</label>
              <input name="lieu_evenement" defaultValue={communique.lieu_evenement ?? ''} placeholder="ex : Salle des fêtes de Kribi" className="champ" />
            </div>
          </div>
        </div>

        <div className="space-y-2 border-t border-black/10 pt-3">
          <p className="text-sm font-medium text-encre">Canaux de diffusion (cumulables)</p>

          <label className="flex items-center gap-2 text-sm text-encre/85">
            <input type="checkbox" name="canal_public" defaultChecked={communique.canal_public} className="accent-primaire" /> Public (visible sur l'accueil)
          </label>
          <label className="flex items-center gap-2 text-sm text-encre/85">
            <input type="checkbox" name="canal_bureau" defaultChecked={communique.canal_bureau} className="accent-primaire" /> Bureau exécutif uniquement
          </label>

          <div className="flex items-center gap-2 text-sm text-encre/85">
            <label>Commission spécifique :</label>
            <select name="canal_commission_id" defaultValue={communique.canal_commission_id ?? ''} className="champ !w-auto !py-1.5 text-sm">
              <option value="">— aucune —</option>
              {commissions?.map((c) => (
                <option key={c.id} value={c.id}>{c.nom}</option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm text-encre/85">
            <input type="checkbox" name="canal_groupe_cible" defaultChecked={communique.canal_groupe_cible} className="accent-primaire" /> Message de groupe ciblé (messagerie)
          </label>

          <div className="ml-6 space-y-2 rounded-lg bg-fond-clair p-3 text-sm">
            <p className="text-xs text-encre/60">Filtres pour le groupe ciblé (laisser vide = tout le monde) :</p>
            <input name="critere_niveau" defaultValue={criteres.niveau_etude ?? ''} placeholder="Niveau d'étude (ex: Terminale)" className="champ !py-1.5 text-sm" />
            <input name="critere_filiere" defaultValue={criteres.filiere ?? ''} placeholder="Filière (ex: Génie Numérique)" className="champ !py-1.5 text-sm" />
            <select name="critere_commission_id" defaultValue={criteres.commission_id ?? ''} className="champ !py-1.5 text-sm">
              <option value="">— toutes commissions —</option>
              {commissions?.map((c) => (
                <option key={c.id} value={c.id}>{c.nom}</option>
              ))}
            </select>
          </div>
        </div>

        <BoutonEnvoi texteEnvoi="Enregistrement...">Enregistrer les modifications</BoutonEnvoi>
      </form>
    </div>
  )
}
