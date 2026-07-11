import { requireModuleManager } from '@/lib/auth/guards'
import { creerFigure, supprimerFigure } from './actions'
import EditeurFormatte from '@/components/editeur-formatte'

export const dynamic = 'force-dynamic'

export default async function PageGestionFigures() {
  const { supabase } = await requireModuleManager('culture_figures')

  const { data: figures } = await supabase
    .from('figures_mabi')
    .select('id, nom, photo_url, vivant, date_naissance, date_deces, village')
    .order('nom')

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-2 text-2xl font-bold">Grandes figures Mabi</h1>
      <p className="mb-6 text-sm text-gray-600">Les élites et héros historiques de la communauté.</p>

      <form action={creerFigure} className="mb-10 space-y-3 rounded border p-4">
        <h2 className="font-semibold">Nouvelle figure</h2>
        <input name="nom" placeholder="Nom complet" required className="w-full rounded border p-2" />
        <EditeurFormatte name="biographie" placeholder="Biographie" rows={5} />
        <input name="village" placeholder="Village d'origine" className="w-full rounded border p-2" />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs text-gray-500">Date de naissance</label>
            <input name="dateNaissance" type="date" className="w-full rounded border p-2" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">Date de décès (si applicable)</label>
            <input name="dateDeces" type="date" className="w-full rounded border p-2" />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="vivant" defaultChecked /> Toujours en vie
        </label>
        <div>
          <label className="mb-1 block text-xs text-gray-500">Photo</label>
          <input type="file" name="photo" accept="image/*" className="text-sm" />
        </div>
        <button type="submit" className="rounded bg-primaire px-4 py-2 text-sm text-white hover:bg-primaire-fonce">
          Ajouter
        </button>
      </form>

      <div className="space-y-2">
        {figures?.map((f) => (
          <div key={f.id} className="flex items-center justify-between rounded border p-3">
            <div className="flex items-center gap-3">
              {f.photo_url && <img src={f.photo_url} alt="" className="h-10 w-10 rounded-full object-cover" />}
              <div>
                <p className="font-medium">{f.nom}</p>
                <p className="text-xs text-gray-500">
                  {f.village && `${f.village} · `}
                  {f.vivant ? 'En vie' : 'Décédé(e)'}
                </p>
              </div>
            </div>
            <form action={supprimerFigure}>
              <input type="hidden" name="id" value={f.id} />
              <button type="submit" className="text-xs text-red-600 hover:underline">Supprimer</button>
            </form>
          </div>
        ))}
        {(!figures || figures.length === 0) && (
          <p className="text-sm text-gray-500">Aucune figure enregistrée pour le moment.</p>
        )}
      </div>
    </div>
  )
}