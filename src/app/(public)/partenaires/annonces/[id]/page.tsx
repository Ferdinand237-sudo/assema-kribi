import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ContenuFormatte from '@/components/contenu-formatte'
import ZoomableImage from '@/components/zoomable-image'

export const dynamic = 'force-dynamic'

export default async function PageAnnoncePartenaire({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: annonce } = await supabase
    .from('annonces_partenaires')
    .select('id, title, content, image_url, created_at, partenaires(nom, lien)')
    .eq('id', id)
    .eq('status', 'published')
    .single()

  if (!annonce) notFound()

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <a href="/partenaires" className="text-xs font-medium text-primaire hover:underline">← Nos partenaires</a>

      <p className="mb-1 mt-4 font-mono text-xs font-medium uppercase tracking-wide text-primaire">
        {(annonce.partenaires as any)?.nom}
      </p>
      <h1 className="mb-2 font-display text-3xl font-semibold text-encre">{annonce.title}</h1>
      <p className="mb-6 text-xs text-encre/50">
        {new Date(annonce.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>

      {annonce.image_url && (
        <ZoomableImage src={annonce.image_url} alt="" className="mb-6 h-64 w-full rounded-lg object-cover" />
      )}

      <ContenuFormatte texte={annonce.content} />
    </div>
  )
}
