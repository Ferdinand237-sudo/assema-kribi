import { requireAdminOuPresident } from '@/lib/auth/guards'
import { creerCommunique, supprimerCommunique } from './actions'
import EditeurFormatte from '@/components/editeur-formatte'
import BoutonEnvoi from '@/components/bouton-envoi'
import BoutonConfirmation from '@/components/bouton-confirmation'

export const dynamic = 'force-dynamic'

export default async function PageAdminCommuniques() {
  const { supabase } = await requireAdminOuPresident()

  const [{ data: commissions }, { data: communiques }] = await Promise.all([
    supabase.from('commissions').select('id, nom'),
    supabase
      .from('communiques')
      .select('id, title, canal_public, canal_bureau, canal_groupe_cible, created_at, date_evenement, lieu_evenement, commissions(nom), communique_destinataires(id)')
      .order('created_at', { ascending: false }),
  ])

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <a href="/admin" className="text-xs font-medium text-primaire hover:underline">← Tableau de bord</a>
      <h1 className="mb-6 mt-2 font-display text-2xl font-semibold text-encre sm:text-3xl">Communiqués & diffusion</h1>

      <form action={creerCommunique} className="cadre mb-8 space-y-3 border border-black/10 bg-white p-4 pt-5 shadow-sm">
        <h2 className="font-semibold text-encre">Nouveau communiqué</h2>
        <input name="title" placeholder="Titre" required className="champ" />
        <EditeurFormatte name="content" placeholder="Contenu" rows={5} required />

        <div className="space-y-2 border-t border-black/10 pt-3">
          <p className="text-sm font-medium text-encre">Rencontre liée (optionnel)</p>
          <p className="text-xs text-encre/60">Si ce communiqué annonce un évènement, indique la date et le lieu pour qu'ils soient bien visibles.</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-encre/60">Date de l'évènement</label>
              <input name="date_evenement" type="datetime-local" className="champ" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-encre/60">Lieu</label>
              <input name="lieu_evenement" placeholder="ex : Salle des fêtes de Kribi" className="champ" />
            </div>
          </div>
        </div>

        <div className="space-y-2 border-t border-black/10 pt-3">
          <p className="text-sm font-medium text-encre">Canaux de diffusion (cumulables)</p>

          <label className="flex items-center gap-2 text-sm text-encre/85">
            <input type="checkbox" name="canal_public" className="accent-primaire" /> Public (visible sur l'accueil)
          </label>
          <label className="flex items-center gap-2 text-sm text-encre/85">
            <input type="checkbox" name="canal_bureau" className="accent-primaire" /> Bureau exécutif uniquement
          </label>

          <div className="flex items-center gap-2 text-sm text-encre/85">
            <label>Commission spécifique :</label>
            <select name="canal_commission_id" className="champ !w-auto !py-1.5 text-sm">
              <option value="">— aucune —</option>
              {commissions?.map((c) => (
                <option key={c.id} value={c.id}>{c.nom}</option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm text-encre/85">
            <input type="checkbox" name="canal_groupe_cible" className="accent-primaire" /> Message de groupe ciblé (messagerie)
          </label>

          <div className="ml-6 space-y-2 rounded-lg bg-fond-clair p-3 text-sm">
            <p className="text-xs text-encre/60">Filtres pour le groupe ciblé (laisser vide = tout le monde) :</p>
            <input name="critere_niveau" placeholder="Niveau d'étude (ex: Terminale)" className="champ !py-1.5 text-sm" />
            <input name="critere_filiere" placeholder="Filière (ex: Génie Numérique)" className="champ !py-1.5 text-sm" />
            <select name="critere_commission_id" className="champ !py-1.5 text-sm">
              <option value="">— toutes commissions —</option>
              {commissions?.map((c) => (
                <option key={c.id} value={c.id}>{c.nom}</option>
              ))}
            </select>
          </div>
        </div>

        <BoutonEnvoi texteEnvoi="Envoi en cours...">Envoyer</BoutonEnvoi>
      </form>

      <h2 className="mb-3 font-semibold text-encre">Historique</h2>
      <div className="space-y-3">
        {communiques?.map((c: any) => (
          <div key={c.id} className="cadre border border-black/5 bg-white p-3 pt-4 text-sm shadow-sm">
            <p className="font-medium text-encre">{c.title}</p>
            <p className="text-xs text-encre/50">
              {new Date(c.created_at).toLocaleDateString('fr-FR')} —{' '}
              {[
                c.canal_public && 'Public',
                c.canal_bureau && 'Bureau',
                c.commissions?.nom && `Commission: ${c.commissions.nom}`,
                c.canal_groupe_cible && `Groupe ciblé (${c.communique_destinataires?.length ?? 0} destinataires)`,
              ].filter(Boolean).join(' · ')}
            </p>
            {(c.date_evenement || c.lieu_evenement) && (
              <p className="mt-1 text-xs font-medium text-primaire">
                📅 {c.date_evenement && new Date(c.date_evenement).toLocaleString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                {c.date_evenement && c.lieu_evenement && ' · '}
                {c.lieu_evenement && `📍 ${c.lieu_evenement}`}
              </p>
            )}
            <div className="mt-2 flex gap-3 border-t border-black/5 pt-2">
              <a href={`/admin/communiques/${c.id}`} className="text-xs font-medium text-primaire hover:underline">Modifier</a>
              <form action={supprimerCommunique}>
                <input type="hidden" name="communiqueId" value={c.id} />
                <BoutonConfirmation message="Supprimer définitivement ce communiqué ?" className="text-xs font-medium text-erreur hover:underline">
                  Supprimer
                </BoutonConfirmation>
              </form>
            </div>
          </div>
        ))}
        {(!communiques || communiques.length === 0) && (
          <p className="text-sm text-encre/60">Aucun communiqué envoyé pour le moment.</p>
        )}
      </div>
    </div>
  )
}