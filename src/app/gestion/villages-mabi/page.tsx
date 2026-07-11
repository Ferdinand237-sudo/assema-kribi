import { requireModuleManager } from '@/lib/auth/guards'
import {
  creerVillage,
  supprimerVillage,
  ajouterPhotosVillage,
  supprimerPhotoVillage,
  ajouterMembreChefferie,
  supprimerMembreChefferie,
} from './actions'
import EditeurFormatte from '@/components/editeur-formatte'

export const dynamic = 'force-dynamic'

export default async function PageGestionVillages() {
  const { supabase } = await requireModuleManager('culture_villages')

  const { data: villages } = await supabase
    .from('villages_mabi')
    .select('id, nom, description, population_estimee, chef_nom, chef_photo_url, village_medias(id, url, legende), village_chefferie_membres(id, nom, fonction, photo_url)')
    .order('nom')

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-2 text-2xl font-bold">Villages Mabi</h1>
      <p className="mb-6 text-sm text-gray-600">Recensement et mémoire des villages du département.</p>

      <form action={creerVillage} className="mb-10 space-y-3 rounded border p-4">
        <h2 className="font-semibold">Nouveau village</h2>
        <input name="nom" placeholder="Nom du village" required className="w-full rounded border p-2" />
        <textarea name="description" placeholder="Description courte" rows={2} className="w-full rounded border p-2" />
        <EditeurFormatte name="histoire" placeholder="Histoire du village" rows={4} />
        <input name="populationEstimee" type="number" placeholder="Population estimée" className="w-full rounded border p-2" />
        <div className="grid grid-cols-2 gap-3">
          <input name="chefNom" placeholder="Nom du chef" className="rounded border p-2" />
          <input type="file" name="chefPhoto" accept="image/*" className="text-sm" />
        </div>
        <EditeurFormatte name="chefBio" placeholder="Petite bio du chef" rows={2} />
        <button type="submit" className="rounded bg-primaire px-4 py-2 text-sm text-white hover:bg-primaire-fonce">
          Créer le village
        </button>
      </form>

      <div className="space-y-8">
        {villages?.map((v: any) => (
          <div key={v.id} className="rounded border p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {v.chef_photo_url && <img src={v.chef_photo_url} alt="" className="h-12 w-12 rounded-full object-cover" />}
                <div>
                  <h3 className="font-semibold">{v.nom}</h3>
                  <p className="text-xs text-gray-500">
                    {v.population_estimee ? `~${v.population_estimee} habitants` : ''}
                    {v.chef_nom ? ` · Chef : ${v.chef_nom}` : ''}
                  </p>
                </div>
              </div>
              <form action={supprimerVillage}>
                <input type="hidden" name="id" value={v.id} />
                <button type="submit" className="text-xs text-red-600 hover:underline">Supprimer le village</button>
              </form>
            </div>

            {/* Photos du village */}
            <div className="mb-4 border-t pt-3">
              <p className="mb-2 text-xs font-medium text-gray-500">Photos du village</p>
              {(v.village_medias ?? []).length > 0 && (
                <div className="mb-2 grid grid-cols-4 gap-2 sm:grid-cols-6">
                  {v.village_medias.map((m: any) => (
                    <div key={m.id} className="group relative overflow-hidden rounded border">
                      <img src={m.url} alt={m.legende ?? ''} className="h-16 w-full object-cover" />
                      <form action={supprimerPhotoVillage} className="absolute right-1 top-1">
                        <input type="hidden" name="id" value={m.id} />
                        <button type="submit" className="rounded bg-red-600 px-1 text-xs text-white opacity-0 group-hover:opacity-100">✕</button>
                      </form>
                    </div>
                  ))}
                </div>
              )}
              <form action={ajouterPhotosVillage} className="flex items-center gap-2">
                <input type="hidden" name="villageId" value={v.id} />
                <input name="legende" placeholder="Légende (optionnel)" className="rounded border p-1 text-xs" />
                <input type="file" name="photos" accept="image/*" multiple className="flex-1 text-xs" />
                <button type="submit" className="rounded bg-gray-200 px-2 py-1 text-xs hover:bg-gray-300">Ajouter</button>
              </form>
            </div>

            {/* Chefferie */}
            <div className="border-t pt-3">
              <p className="mb-2 text-xs font-medium text-gray-500">Autorités traditionnelles / chefferie</p>
              {(v.village_chefferie_membres ?? []).length > 0 && (
                <ul className="mb-2 space-y-1">
                  {v.village_chefferie_membres.map((m: any) => (
                    <li key={m.id} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        {m.photo_url && <img src={m.photo_url} alt="" className="h-6 w-6 rounded-full object-cover" />}
                        {m.nom} {m.fonction && <span className="text-xs text-gray-500">— {m.fonction}</span>}
                      </span>
                      <form action={supprimerMembreChefferie}>
                        <input type="hidden" name="id" value={m.id} />
                        <button type="submit" className="text-xs text-red-600 hover:underline">Retirer</button>
                      </form>
                    </li>
                  ))}
                </ul>
              )}
              <form action={ajouterMembreChefferie} className="flex flex-wrap items-center gap-2">
                <input type="hidden" name="villageId" value={v.id} />
                <input name="nom" placeholder="Nom" required className="rounded border p-1 text-xs" />
                <input name="fonction" placeholder="Fonction" className="rounded border p-1 text-xs" />
                <input type="file" name="photo" accept="image/*" className="text-xs" />
                <button type="submit" className="rounded bg-gray-200 px-2 py-1 text-xs hover:bg-gray-300">Ajouter</button>
              </form>
            </div>
          </div>
        ))}
        {(!villages || villages.length === 0) && (
          <p className="text-sm text-gray-500">Aucun village recensé pour le moment.</p>
        )}
      </div>
    </div>
  )
}