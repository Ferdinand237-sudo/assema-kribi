import { requireModuleManager } from '@/lib/auth/guards'
import { notFound } from 'next/navigation'
import { modifierAnnonce } from '../../actions'
import EditeurFormatte from '@/components/editeur-formatte'
import BoutonEnvoi from '@/components/bouton-envoi'

export const dynamic = 'force-dynamic'

export default async function PageModifierAnnonce({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { supabase } = await requireModuleManager('partenaires')

  const { data: annonce } = await supabase
    .from('annonces_partenaires')
    .select('id, title, content, image_url, partenaires(nom)')
    .eq('id', id)
    .single()

  if (!annonce) notFound()

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <a href="/gestion/partenaires" className="text-xs font-medium text-primaire hover:underline">← Gestion des partenaires</a>
      <h1 className="mb-1 mt-2 font-display text-2xl font-semibold text-encre sm:text-3xl">Modifier l'annonce</h1>
      <p className="mb-6 text-sm text-encre/60">{(annonce.partenaires as any)?.nom}</p>

      <form action={modifierAnnonce} className="cadre space-y-3 border border-black/10 bg-white p-4 pt-5 shadow-sm">
        <input type="hidden" name="id" value={annonce.id} />
        <input name="title" defaultValue={annonce.title} placeholder="Titre de l'annonce" required className="champ" />
        <EditeurFormatte name="content" defaultValue={annonce.content} placeholder="Contenu de l'annonce" required />
        <div>
          <label className="mb-1 block text-xs font-medium text-encre/70">Image</label>
          {annonce.image_url && <img src={annonce.image_url} alt="" className="mb-2 h-24 w-full rounded-lg object-cover" />}
          <input type="file" name="image" accept="image/*" className="champ-fichier" />
          <p className="mt-1 text-xs text-encre/50">Laisser vide pour conserver l'image actuelle.</p>
        </div>
        <BoutonEnvoi texteEnvoi="Enregistrement...">Enregistrer les modifications</BoutonEnvoi>
      </form>
    </div>
  )
}
