import { requireModuleManager } from '@/lib/auth/guards'
import { notFound } from 'next/navigation'
import { modifierPartenaire } from '../actions'
import BoutonEnvoi from '@/components/bouton-envoi'

export const dynamic = 'force-dynamic'

export default async function PageModifierPartenaire({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { supabase } = await requireModuleManager('partenaires')

  const { data: partenaire } = await supabase
    .from('partenaires')
    .select('id, nom, description, lien, logo_url')
    .eq('id', id)
    .single()

  if (!partenaire) notFound()

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <a href="/gestion/partenaires" className="text-xs font-medium text-primaire hover:underline">← Gestion des partenaires</a>
      <h1 className="mb-6 mt-2 font-display text-2xl font-semibold text-encre sm:text-3xl">Modifier le partenaire</h1>

      <form action={modifierPartenaire} className="cadre space-y-3 border border-black/10 bg-white p-4 pt-5 shadow-sm">
        <input type="hidden" name="id" value={partenaire.id} />
        <div>
          <label className="mb-1 block text-xs font-medium text-encre/70">Nom</label>
          <input name="nom" defaultValue={partenaire.nom} placeholder="Nom du partenaire" required className="champ" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-encre/70">Description</label>
          <textarea name="description" defaultValue={partenaire.description ?? ''} placeholder="Description" rows={2} className="champ" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-encre/70">Site web</label>
          <input name="lien" type="url" defaultValue={partenaire.lien ?? ''} placeholder="https://..." className="champ" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-encre/70">Logo</label>
          {partenaire.logo_url && <img src={partenaire.logo_url} alt="" className="mb-2 h-10 w-10 object-contain" />}
          <input type="file" name="logo" accept="image/*" className="champ-fichier" />
          <p className="mt-1 text-xs text-encre/50">Laisser vide pour conserver le logo actuel.</p>
        </div>
        <BoutonEnvoi texteEnvoi="Enregistrement...">Enregistrer les modifications</BoutonEnvoi>
      </form>
    </div>
  )
}
