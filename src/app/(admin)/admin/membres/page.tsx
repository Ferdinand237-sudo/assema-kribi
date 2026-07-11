import { requireAdminOuPresident } from '@/lib/auth/guards'
import { changerRole, changerPosteBureau } from './actions'

export default async function PageAdminMembres() {
  const { supabase, profile: moi } = await requireAdminOuPresident()

  const { data: membres } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, filiere, role, poste_bureau')
    .order('first_name')

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Membres & rôles</h1>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="pb-2">Nom</th>
            <th className="pb-2">Filière</th>
            <th className="pb-2">Rôle</th>
            <th className="pb-2">Poste bureau</th>
          </tr>
        </thead>
        <tbody>
          {membres?.map((m) => (
            <tr key={m.id} className="border-b">
              <td className="py-2">{m.first_name} {m.last_name}</td>
              <td className="py-2">{m.filiere}</td>
              <td className="py-2">
                <form action={changerRole} className="flex items-center gap-2">
                  <input type="hidden" name="profileId" value={m.id} />
                  <select
                    name="role"
                    defaultValue={m.role}
                    disabled={moi.role !== 'admin' && (m.role === 'president' || m.role === 'admin')}
                    className="rounded border p-1"
                  >
                    <option value="membre">Membre</option>
                    <option value="responsable_commission">Responsable commission</option>
                    {moi.role === 'admin' && <option value="president">Président</option>}
                    {moi.role === 'admin' && <option value="admin">Admin</option>}
                  </select>
                  <button type="submit" className="text-xs text-primaire hover:underline">OK</button>
                </form>
              </td>
              <td className="py-2">
                <form action={changerPosteBureau} className="flex items-center gap-2">
                  <input type="hidden" name="profileId" value={m.id} />
                  <input
                    name="poste"
                    defaultValue={m.poste_bureau ?? ''}
                    placeholder="ex: Trésorier"
                    className="w-32 rounded border p-1"
                  />
                  <button type="submit" className="text-xs text-primaire hover:underline">OK</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}