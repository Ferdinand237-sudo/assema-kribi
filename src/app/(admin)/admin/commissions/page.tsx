import { requireAdminOuPresident } from '@/lib/auth/guards'
import { creerCommission, ajouterMembreCommission, retirerMembreCommission } from './actions'

export default async function PageAdminCommissions() {
  const { supabase } = await requireAdminOuPresident()

  const [{ data: commissions }, { data: profiles }] = await Promise.all([
    supabase
      .from('commissions')
      .select('id, nom, description, commission_members(id, role_commission, profiles(id, first_name, last_name))')
      .order('created_at', { ascending: false }),
    supabase.from('profiles').select('id, first_name, last_name').order('first_name'),
  ])

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Gestion des commissions</h1>

      <form action={creerCommission} className="mb-8 space-y-3 rounded border p-4">
        <h2 className="font-semibold">Créer une commission</h2>
        <input name="nom" placeholder="Nom de la commission" required className="w-full rounded border p-2" />
        <textarea name="description" placeholder="Rôle et missions" rows={2} className="w-full rounded border p-2" />
        <button type="submit" className="rounded bg-primaire px-4 py-2 text-white hover:bg-primaire-fonce">
          Créer
        </button>
      </form>

      <div className="space-y-6">
        {commissions?.map((c) => (
          <div key={c.id} className="rounded border p-4">
            <h3 className="font-semibold">{c.nom}</h3>
            <p className="mb-3 text-sm text-gray-600">{c.description}</p>

            <ul className="mb-3 space-y-1 text-sm">
              {(c.commission_members ?? []).map((m: any) => (
                <li key={m.id} className="flex items-center justify-between">
                  <span>
                    {m.profiles?.first_name} {m.profiles?.last_name}
                    {m.role_commission === 'responsable' && (
                      <span className="ml-2 text-xs text-primaire">(responsable)</span>
                    )}
                  </span>
                  <form action={retirerMembreCommission}>
                    <input type="hidden" name="id" value={m.id} />
                    <button type="submit" className="text-xs text-red-600 hover:underline">Retirer</button>
                  </form>
                </li>
              ))}
            </ul>

            <form action={ajouterMembreCommission} className="flex gap-2">
              <input type="hidden" name="commissionId" value={c.id} />
              <select name="profileId" required className="flex-1 rounded border p-1 text-sm">
                <option value="">Ajouter un membre...</option>
                {profiles?.map((p) => (
                  <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
                ))}
              </select>
              <select name="roleCommission" className="rounded border p-1 text-sm">
                <option value="membre">Membre</option>
                <option value="responsable">Responsable</option>
              </select>
              <button type="submit" className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300">
                Ajouter
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  )
}