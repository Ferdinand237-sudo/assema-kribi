import { requireModuleManager } from '@/lib/auth/guards'
import { notFound } from 'next/navigation'
import { modifierProjet } from '../actions'
import EditeurFormatte from '@/components/editeur-formatte'
import BoutonEnvoi from '@/components/bouton-envoi'

export const dynamic = 'force-dynamic'

export default async function PageModifierProjet({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { supabase } = await requireModuleManager('projets')

  const { data: projet } = await supabase
    .from('projets')
    .select('id, titre, description, resultats')
    .eq('id', id)
    .single()

  if (!projet) notFound()

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <a href="/gestion/projets" className="text-xs font-medium text-primaire hover:underline">← Gestion des projets réalisés</a>
      <h1 className="mb-6 mt-2 font-display text-2xl font-semibold text-encre sm:text-3xl">Modifier le projet</h1>

      <form action={modifierProjet} className="cadre space-y-3 border border-black/10 bg-white p-4 pt-5 shadow-sm">
        <input type="hidden" name="id" value={projet.id} />
        <input name="titre" defaultValue={projet.titre} placeholder="Titre du projet" required className="champ" />
        <EditeurFormatte name="description" defaultValue={projet.description ?? ''} placeholder="Description" rows={3} />
        <EditeurFormatte name="resultats" defaultValue={projet.resultats ?? ''} placeholder="Résultats et impacts" rows={3} />
        <div>
          <label className="mb-1 block text-xs text-encre/60">Ajouter des photos / vidéos</label>
          <input type="file" name="medias" accept="image/*,video/*" multiple className="champ-fichier" />
          <p className="mt-1 text-xs text-encre/50">Les médias existants restent inchangés ; gère-les depuis la liste après l'enregistrement.</p>
        </div>
        <BoutonEnvoi texteEnvoi="Enregistrement...">Enregistrer les modifications</BoutonEnvoi>
      </form>
    </div>
  )
}
