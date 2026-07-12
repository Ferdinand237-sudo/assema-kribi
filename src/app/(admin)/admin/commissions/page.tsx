import { requireAdminOuPresident } from '@/lib/auth/guards'
import { creerCommission, modifierCommission, supprimerCommission, ajouterMembreCommission, retirerMembreCommission } from './actions'
import BoutonConfirmation from '@/components/bouton-confirmation'
import BoutonEnvoi from '@/components/bouton-envoi'

export const dynamic = 'force-dynamic'

export default async function PageAdminCommissions({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string }>
}) {
  const { erreur } = await searchParams
  const { supabase } = await requireAdminOuPresident()

  const [{ data: commissions }, { data: profiles }] = await Promise.all([
    supabase
      .from('commissions')
      .select('id, nom, description, commission_members(id, role_commission, profiles(id, first_name, last_name))')
      .order('created_at', { ascending: false }),
    supabase.from('profiles').select('id, first_name, last_name').order('first_name'),
  ])

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-6 font-display text-2xl font-semibold text-encre sm:text-3xl">Gestion des commissions</h1>

      {erreur && <p className="confirmation-douce badge-erreur mb-4 block w-fit rounded-lg px-4 py-3 text-sm">{erreur}</p>}

      <form action={creerCommission} className="cadre mb-8 space-y-3 border border-black/10 bg-white p-4 pt-5 shadow-sm">
        <h2 className="font-semibold text-encre">Créer une commission</h2>
        <input name="nom" placeholder="Nom de la commission" required className="champ" />
        <textarea name="description" placeholder="Rôle et missions" rows={2} className="champ" />
        <button type="submit" className="bouton bouton-primaire">
          Créer
        </button>
      </form>

      <div className="space-y-6">
        {commissions?.map((c) => (
          <div key={c.id} className="cadre border border-black/5 bg-white p-4 pt-5 shadow-sm">
            <div className="mb-1 flex items-start justify-between gap-2">
              <h3 className="font-semibold text-encre">{c.nom}</h3>
              <form action={supprimerCommission}>
                <input type="hidden" name="id" value={c.id} />
                <BoutonConfirmation message={`Supprimer la commission "${c.nom}" ?`} className="flex-shrink-0 text-xs text-erreur hover:underline">
                  Supprimer
                </BoutonConfirmation>
              </form>
            </div>
            <p className="mb-2 text-sm text-encre/60">{c.description}</p>

            <details className="mb-3">
              <summary className="cursor-pointer text-xs font-medium text-primaire hover:underline">Modifier le nom / la description</summary>
              <form action={modifierCommission} className="mt-2 space-y-2">
                <input type="hidden" name="id" value={c.id} />
                <input name="nom" defaultValue={c.nom} required className="champ !py-1.5 text-sm" />
                <textarea name="description" defaultValue={c.description ?? ''} rows={2} className="champ !py-1.5 text-sm" />
                <BoutonEnvoi className="bouton bouton-secondaire !py-1.5 text-xs" texteEnvoi="Enregistrement...">Enregistrer</BoutonEnvoi>
              </form>
            </details>

            <ul className="mb-3 space-y-1 text-sm">
              {(c.commission_members ?? []).map((m: any) => (
                <li key={m.id} className="flex items-center justify-between">
                  <span className="text-encre/85">
                    {m.profiles?.first_name} {m.profiles?.last_name}
                    {m.role_commission === 'responsable' && (
                      <span className="ml-2 text-xs text-primaire">(responsable)</span>
                    )}
                  </span>
                  <form action={retirerMembreCommission}>
                    <input type="hidden" name="id" value={m.id} />
                    <button type="submit" className="text-xs text-erreur hover:underline">Retirer</button>
                  </form>
                </li>
              ))}
            </ul>

            <form action={ajouterMembreCommission} className="flex flex-wrap gap-2">
              <input type="hidden" name="commissionId" value={c.id} />
              <select name="profileId" required className="champ !w-auto flex-1 !py-1.5 text-sm">
                <option value="">Ajouter un membre...</option>
                {profiles?.map((p) => (
                  <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
                ))}
              </select>
              <select name="roleCommission" className="champ !w-auto !py-1.5 text-sm">
                <option value="membre">Membre</option>
                <option value="responsable">Responsable</option>
              </select>
              <button type="submit" className="bouton bouton-secondaire !py-1.5">
                Ajouter
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  )
}