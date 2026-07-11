import { requireAdminOuPresident } from '@/lib/auth/guards'
import { creerCommunique } from './actions'
import EditeurFormatte from '@/components/editeur-formatte'

export const dynamic = 'force-dynamic'

export default async function PageAdminCommuniques() {
  const { supabase } = await requireAdminOuPresident()

  const [{ data: commissions }, { data: communiques }] = await Promise.all([
    supabase.from('commissions').select('id, nom'),
    supabase
      .from('communiques')
      .select('id, title, canal_public, canal_bureau, canal_groupe_cible, created_at, commissions(nom), communique_destinataires(id)')
      .order('created_at', { ascending: false }),
  ])

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Communiqués & diffusion</h1>

      <form action={creerCommunique} className="mb-8 space-y-3 rounded border p-4">
        <h2 className="font-semibold">Nouveau communiqué</h2>
        <input name="title" placeholder="Titre" required className="w-full rounded border p-2" />
        <EditeurFormatte name="content" placeholder="Contenu" rows={5} required />
        <div className="space-y-2 border-t pt-3">
          <p className="text-sm font-medium">Canaux de diffusion (cumulables)</p>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="canal_public" /> Public (visible sur l'accueil)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="canal_bureau" /> Bureau exécutif uniquement
          </label>

          <div className="flex items-center gap-2 text-sm">
            <label>Commission spécifique :</label>
            <select name="canal_commission_id" className="rounded border p-1">
              <option value="">— aucune —</option>
              {commissions?.map((c) => (
                <option key={c.id} value={c.id}>{c.nom}</option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="canal_groupe_cible" /> Message de groupe ciblé (messagerie)
          </label>

          <div className="ml-6 space-y-2 rounded bg-gray-50 p-3 text-sm">
            <p className="text-xs text-gray-500">Filtres pour le groupe ciblé (laisser vide = tout le monde) :</p>
            <input name="critere_niveau" placeholder="Niveau d'étude (ex: Terminale)" className="w-full rounded border p-1" />
            <input name="critere_filiere" placeholder="Filière (ex: Génie Numérique)" className="w-full rounded border p-1" />
            <select name="critere_commission_id" className="w-full rounded border p-1">
              <option value="">— toutes commissions —</option>
              {commissions?.map((c) => (
                <option key={c.id} value={c.id}>{c.nom}</option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className="rounded bg-primaire px-4 py-2 text-sm text-white hover:bg-primaire-fonce">
          Envoyer
        </button>
      </form>

      <h2 className="mb-3 font-semibold">Historique</h2>
      <div className="space-y-3">
        {communiques?.map((c: any) => (
          <div key={c.id} className="rounded border p-3 text-sm">
            <p className="font-medium">{c.title}</p>
            <p className="text-xs text-gray-500">
              {new Date(c.created_at).toLocaleDateString('fr-FR')} —{' '}
              {[
                c.canal_public && 'Public',
                c.canal_bureau && 'Bureau',
                c.commissions?.nom && `Commission: ${c.commissions.nom}`,
                c.canal_groupe_cible && `Groupe ciblé (${c.communique_destinataires?.length ?? 0} destinataires)`,
              ].filter(Boolean).join(' · ')}
            </p>
          </div>
        ))}
        {(!communiques || communiques.length === 0) && (
          <p className="text-sm text-gray-500">Aucun communiqué envoyé pour le moment.</p>
        )}
      </div>
    </div>
  )
}