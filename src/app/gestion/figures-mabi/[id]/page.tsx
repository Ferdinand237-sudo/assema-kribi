import { requireModuleManager } from '@/lib/auth/guards'
import { notFound } from 'next/navigation'
import { modifierFigure } from '../actions'
import EditeurFormatte from '@/components/editeur-formatte'
import BoutonEnvoi from '@/components/bouton-envoi'

export const dynamic = 'force-dynamic'

export default async function PageModifierFigure({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { supabase } = await requireModuleManager('culture_figures')

  const { data: figure } = await supabase
    .from('figures_mabi')
    .select('id, nom, biographie, date_naissance, date_deces, vivant, village, photo_url')
    .eq('id', id)
    .single()

  if (!figure) notFound()

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <a href="/gestion/figures-mabi" className="text-xs font-medium text-primaire hover:underline">← Grandes figures Mabi</a>
      <h1 className="mb-6 mt-2 font-display text-2xl font-semibold text-encre sm:text-3xl">Modifier la figure</h1>

      <form action={modifierFigure} className="cadre space-y-3 border border-black/10 bg-white p-4 pt-5 shadow-sm">
        <input type="hidden" name="id" value={figure.id} />
        <input name="nom" defaultValue={figure.nom} placeholder="Nom complet" required className="champ" />
        <EditeurFormatte name="biographie" defaultValue={figure.biographie ?? ''} placeholder="Biographie" rows={5} />
        <input name="village" defaultValue={figure.village ?? ''} placeholder="Village d'origine" className="champ" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-encre/60">Date de naissance</label>
            <input name="dateNaissance" type="date" defaultValue={figure.date_naissance ?? ''} className="champ" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-encre/60">Date de décès (si applicable)</label>
            <input name="dateDeces" type="date" defaultValue={figure.date_deces ?? ''} className="champ" />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-encre/85">
          <input type="checkbox" name="vivant" defaultChecked={figure.vivant} className="accent-primaire" /> Toujours en vie
        </label>
        <div>
          <label className="mb-1 block text-xs text-encre/60">Photo</label>
          {figure.photo_url && <img src={figure.photo_url} alt="" className="mb-2 h-16 w-16 rounded-full object-cover" />}
          <input type="file" name="photo" accept="image/*" className="champ-fichier" />
          <p className="mt-1 text-xs text-encre/50">Laisser vide pour conserver la photo actuelle.</p>
        </div>
        <BoutonEnvoi texteEnvoi="Enregistrement...">Enregistrer les modifications</BoutonEnvoi>
      </form>
    </div>
  )
}
