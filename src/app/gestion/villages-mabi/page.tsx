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
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-2 font-display text-2xl font-semibold text-encre sm:text-3xl">Villages Mabi</h1>
      <p className="mb-6 text-sm text-encre/60">Recensement et mémoire des villages du département.</p>

      <form action={creerVillage} className="cadre mb-10 space-y-3 border border-black/10 bg-white p-4 pt-5 shadow-sm">
        <h2 className="font-semibold text-encre">Nouveau village</h2>
        <input name="nom" placeholder="Nom du village" required className="champ" />
        <textarea name="description" placeholder="Description courte" rows={2} className="champ" />
        <EditeurFormatte name="histoire" placeholder="Histoire du village" rows={4} />
        <input name="populationEstimee" type="number" placeholder="Population estimée" className="champ" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input name="chefNom" placeholder="Nom du chef" className="champ" />
          <input type="file" name="chefPhoto" accept="image/*" className="champ-fichier" />
        </div>
        <EditeurFormatte name="chefBio" placeholder="Petite bio du chef" rows={2} />
        <button type="submit" className="bouton bouton-primaire">
          Créer le village
        </button>
      </form>

      <div className="space-y-8">
        {villages?.map((v: any) => (
          <div key={v.id} className="cadre border border-black/5 bg-white p-4 pt-5 shadow-sm">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                {v.chef_photo_url && <img src={v.chef_photo_url} alt="" className="h-12 w-12 rounded-full object-cover" />}
                <div>
                  <h3 className="font-semibold text-encre">{v.nom}</h3>
                  <p className="text-xs text-encre/60">
                    {v.population_estimee ? `~${v.population_estimee} habitants` : ''}
                    {v.chef_nom ? ` · Chef : ${v.chef_nom}` : ''}
                  </p>
                </div>
              </div>
              <form action={supprimerVillage}>
                <input type="hidden" name="id" value={v.id} />
                <button type="submit" className="text-xs text-erreur hover:underline">Supprimer le village</button>
              </form>
            </div>

            {/* Photos du village */}
            <div className="mb-4 border-t border-black/10 pt-3">
              <p className="mb-2 text-xs font-medium text-encre/60">Photos du village</p>
              {(v.village_medias ?? []).length > 0 && (
                <div className="mb-2 grid grid-cols-4 gap-2 sm:grid-cols-6">
                  {v.village_medias.map((m: any) => (
                    <div key={m.id} className="group relative overflow-hidden rounded-lg border border-black/10">
                      <img src={m.url} alt={m.legende ?? ''} className="h-16 w-full object-cover" />
                      <form action={supprimerPhotoVillage} className="absolute right-1 top-1">
                        <input type="hidden" name="id" value={m.id} />
                        <button type="submit" className="rounded bg-erreur px-1 text-xs text-white opacity-0 group-hover:opacity-100">✕</button>
                      </form>
                    </div>
                  ))}
                </div>
              )}
              <form action={ajouterPhotosVillage} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <input type="hidden" name="villageId" value={v.id} />
                <input name="legende" placeholder="Légende (optionnel)" className="champ !w-auto !py-1.5 text-xs" />
                <input type="file" name="photos" accept="image/*" multiple className="champ-fichier flex-1" />
                <button type="submit" className="bouton bouton-secondaire !py-1.5 text-xs">Ajouter</button>
              </form>
            </div>

            {/* Chefferie */}
            <div className="border-t border-black/10 pt-3">
              <p className="mb-2 text-xs font-medium text-encre/60">Autorités traditionnelles / chefferie</p>
              {(v.village_chefferie_membres ?? []).length > 0 && (
                <ul className="mb-2 space-y-1">
                  {v.village_chefferie_membres.map((m: any) => (
                    <li key={m.id} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-encre/85">
                        {m.photo_url && <img src={m.photo_url} alt="" className="h-6 w-6 rounded-full object-cover" />}
                        {m.nom} {m.fonction && <span className="text-xs text-encre/50">— {m.fonction}</span>}
                      </span>
                      <form action={supprimerMembreChefferie}>
                        <input type="hidden" name="id" value={m.id} />
                        <button type="submit" className="text-xs text-erreur hover:underline">Retirer</button>
                      </form>
                    </li>
                  ))}
                </ul>
              )}
              <form action={ajouterMembreChefferie} className="flex flex-wrap items-center gap-2">
                <input type="hidden" name="villageId" value={v.id} />
                <input name="nom" placeholder="Nom" required className="champ !w-auto !py-1.5 text-xs" />
                <input name="fonction" placeholder="Fonction" className="champ !w-auto !py-1.5 text-xs" />
                <input type="file" name="photo" accept="image/*" className="champ-fichier flex-1" />
                <button type="submit" className="bouton bouton-secondaire !py-1.5 text-xs">Ajouter</button>
              </form>
            </div>
          </div>
        ))}
        {(!villages || villages.length === 0) && (
          <p className="text-sm text-encre/60">Aucun village recensé pour le moment.</p>
        )}
      </div>
    </div>
  )
}