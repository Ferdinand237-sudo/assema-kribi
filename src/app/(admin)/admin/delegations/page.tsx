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
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <a href="/admin" className="text-xs font-medium text-primaire hover:underline">← Tableau de bord</a>
      <h1 className="mb-2 mt-2 font-display text-2xl font-semibold text-encre sm:text-3xl">Délégations</h1>
      <p className="mb-6 text-sm text-encre/60">
        Désigne des membres pour gérer certaines sections du site, indépendamment des commissions.
      </p>

      <form action={assignerGestionnaire} className="cadre mb-8 flex flex-wrap items-end gap-3 border border-black/10 bg-white p-4 pt-5 shadow-sm">
        <div>
          <label className="mb-1 block text-xs text-encre/60">Module</label>
          <select name="module" required className="champ !w-auto !py-1.5 text-sm">
            {MODULES.map((m) => (
              <option key={m.valeur} value={m.valeur}>{m.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-encre/60">Membre</label>
          <select name="profileId" required className="champ !w-auto !py-1.5 text-sm">
            {profiles?.map((p) => (
              <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="bouton bouton-primaire !py-1.5">
          Assigner
        </button>
      </form>

      <div className="space-y-4">
        {MODULES.map((m) => {
          const assignes = (gestionnaires ?? []).filter((g: any) => g.module === m.valeur)
          return (
            <div key={m.valeur} className="cadre border border-black/5 bg-white p-3 pt-4 shadow-sm">
              <p className="mb-2 text-sm font-semibold text-encre">{m.label}</p>
              {assignes.length > 0 ? (
                <ul className="space-y-1">
                  {assignes.map((g: any) => (
                    <li key={g.id} className="flex items-center justify-between text-sm text-encre/85">
                      <span>{g.profiles?.first_name} {g.profiles?.last_name}</span>
                      <form action={retirerGestionnaire}>
                        <input type="hidden" name="id" value={g.id} />
                        <button type="submit" className="text-xs text-erreur hover:underline">Retirer</button>
                      </form>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-encre/40">Personne assigné — géré par défaut par l'admin/président.</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}