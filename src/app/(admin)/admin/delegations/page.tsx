import { requireAdminOuPresident } from '@/lib/auth/guards'
import { assignerGestionnaire, retirerGestionnaire } from './actions'

export const dynamic = 'force-dynamic'

const MODULES = [
  { valeur: 'partenaires', label: 'Partenaires & annonces' },
  { valeur: 'galerie', label: 'Galerie média' },
  { valeur: 'culture_villages', label: 'Culture Mabi — Villages' },
  { valeur: 'culture_figures', label: 'Culture Mabi — Grandes figures' },
  { valeur: 'culture_contes', label: 'Culture Mabi — Contes & légendes' },
  { valeur: 'culture_culinaire', label: 'Culture Mabi — Arts culinaires' },
]

export default async function PageDelegations() {
  const { supabase } = await requireAdminOuPresident()

  const [{ data: profiles }, { data: gestionnaires }] = await Promise.all([
    supabase.from('profiles').select('id, first_name, last_name').order('first_name'),
    supabase
      .from('gestionnaires_module')
      .select('id, module, profiles(first_name, last_name)')
      .order('module'),
  ])

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-2 text-2xl font-bold">Délégations</h1>
      <p className="mb-6 text-sm text-gray-600">
        Désigne des membres pour gérer certaines sections du site, indépendamment des commissions.
      </p>

      <form action={assignerGestionnaire} className="mb-8 flex flex-wrap items-end gap-3 rounded border p-4">
        <div>
          <label className="mb-1 block text-xs text-gray-500">Module</label>
          <select name="module" required className="rounded border p-2 text-sm">
            {MODULES.map((m) => (
              <option key={m.valeur} value={m.valeur}>{m.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-500">Membre</label>
          <select name="profileId" required className="rounded border p-2 text-sm">
            {profiles?.map((p) => (
              <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="rounded bg-primaire px-4 py-2 text-sm text-white hover:bg-primaire-fonce">
          Assigner
        </button>
      </form>

      <div className="space-y-4">
        {MODULES.map((m) => {
          const assignes = (gestionnaires ?? []).filter((g: any) => g.module === m.valeur)
          return (
            <div key={m.valeur} className="rounded border p-3">
              <p className="mb-2 text-sm font-semibold">{m.label}</p>
              {assignes.length > 0 ? (
                <ul className="space-y-1">
                  {assignes.map((g: any) => (
                    <li key={g.id} className="flex items-center justify-between text-sm">
                      <span>{g.profiles?.first_name} {g.profiles?.last_name}</span>
                      <form action={retirerGestionnaire}>
                        <input type="hidden" name="id" value={g.id} />
                        <button type="submit" className="text-xs text-red-600 hover:underline">Retirer</button>
                      </form>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-400">Personne assigné — géré par défaut par l'admin/président.</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}