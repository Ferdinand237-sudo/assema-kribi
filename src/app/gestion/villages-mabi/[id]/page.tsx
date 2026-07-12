import { requireModuleManager } from '@/lib/auth/guards'
import { notFound } from 'next/navigation'
import { modifierVillage } from '../actions'
import EditeurFormatte from '@/components/editeur-formatte'
import BoutonEnvoi from '@/components/bouton-envoi'

export const dynamic = 'force-dynamic'

export default async function PageModifierVillage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { supabase } = await requireModuleManager('culture_villages')

  const { data: village } = await supabase
    .from('villages_mabi')
    .select('id, nom, description, histoire, population_estimee, chef_nom, chef_bio, chef_photo_url')
    .eq('id', id)
    .single()

  if (!village) notFound()

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <a href="/gestion/villages-mabi" className="text-xs font-medium text-primaire hover:underline">← Villages Mabi</a>
      <h1 className="mb-6 mt-2 font-display text-2xl font-semibold text-encre sm:text-3xl">Modifier le village</h1>

      <form action={modifierVillage} className="cadre space-y-3 border border-black/10 bg-white p-4 pt-5 shadow-sm">
        <input type="hidden" name="id" value={village.id} />
        <input name="nom" defaultValue={village.nom} placeholder="Nom du village" required className="champ" />
        <textarea name="description" defaultValue={village.description ?? ''} placeholder="Description courte" rows={2} className="champ" />
        <EditeurFormatte name="histoire" defaultValue={village.histoire ?? ''} placeholder="Histoire du village" rows={4} />
        <input name="populationEstimee" type="number" defaultValue={village.population_estimee ?? ''} placeholder="Population estimée" className="champ" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input name="chefNom" defaultValue={village.chef_nom ?? ''} placeholder="Nom du chef" className="champ" />
          <div>
            {village.chef_photo_url && <img src={village.chef_photo_url} alt="" className="mb-2 h-10 w-10 rounded-full object-cover" />}
            <input type="file" name="chefPhoto" accept="image/*" className="champ-fichier" />
          </div>
        </div>
        <EditeurFormatte name="chefBio" defaultValue={village.chef_bio ?? ''} placeholder="Petite bio du chef" rows={2} />
        <BoutonEnvoi texteEnvoi="Enregistrement...">Enregistrer les modifications</BoutonEnvoi>
      </form>
    </div>
  )
}
