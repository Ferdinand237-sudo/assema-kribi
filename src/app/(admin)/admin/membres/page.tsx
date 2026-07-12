import { requireAdminOuPresident } from '@/lib/auth/guards'
import { changerRole, changerPosteBureau } from './actions'

export default async function PageAdminMembres() {
  const { supabase, profile: moi } = await requireAdminOuPresident()

  const { data: membres } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, filiere, role, poste_bureau')
    .order('first_name')

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-6 font-display text-2xl font-semibold text-encre sm:text-3xl">Membres & rôles</h1>

      <div className="cadre overflow-x-auto border border-black/5 bg-white p-4 pt-5 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/10 text-left text-encre/60">
              <th className="pb-2 pr-3 font-medium">Nom</th>
              <th className="pb-2 pr-3 font-medium">Filière</th>
              <th className="pb-2 pr-3 font-medium">Rôle</th>
              <th className="pb-2 font-medium">Poste bureau</th>
            </tr>
          </thead>
          <tbody>
            {membres?.map((m) => (
              <tr key={m.id} className="border-b border-black/5">
                <td className="py-2 pr-3 text-encre">{m.first_name} {m.last_name}</td>
                <td className="py-2 pr-3 text-encre/70">{m.filiere}</td>
                <td className="py-2 pr-3">
                  <form action={changerRole} className="flex items-center gap-2">
                    <input type="hidden" name="profileId" value={m.id} />
                    <select
                      name="role"
                      defaultValue={m.role}
                      disabled={moi.role !== 'admin' && (m.role === 'president' || m.role === 'admin')}
                      className="champ !w-auto !py-1 text-xs"
                    >
                      <option value="membre">Membre</option>
                      <option value="responsable_commission">Responsable commission</option>
                      {moi.role === 'admin' && <option value="president">Président</option>}
                      {moi.role === 'admin' && <option value="admin">Admin</option>}
                    </select>
                    <button type="submit" className="text-xs font-medium text-primaire hover:underline">OK</button>
                  </form>
                </td>
                <td className="py-2">
                  <form action={changerPosteBureau} className="flex items-center gap-2">
                    <input type="hidden" name="profileId" value={m.id} />
                    <input
                      name="poste"
                      defaultValue={m.poste_bureau ?? ''}
                      placeholder="ex: Trésorier"
                      className="champ !w-32 !py-1 text-xs"
                    />
                    <button type="submit" className="text-xs font-medium text-primaire hover:underline">OK</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}