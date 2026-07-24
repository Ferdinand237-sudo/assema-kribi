import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ContenuFormatte from '@/components/contenu-formatte'
import ZoomableImage from '@/components/zoomable-image'
import BoutonsPartage from '@/components/boutons-partage'
import { extraireTexte } from '@/lib/texte'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()

  const { data: annonce } = await supabase
    .from('annonces_partenaires')
    .select('title, content, image_url')
    .eq('id', id)
    .eq('status', 'published')
    .single()

  if (!annonce) return {}

  const description = extraireTexte(annonce.content, 160)
  const url = `/partenaires/annonces/${id}`
  const images = annonce.image_url ? [annonce.image_url] : undefined

  return {
    title: annonce.title,
    description,
    alternates: { canonical: url },
    openGraph: { title: annonce.title, description, url, type: 'article', images },
    twitter: { title: annonce.title, description, images },
  }
}

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

      <p className="mb-1 mt-4 text-center font-mono text-xs font-medium uppercase tracking-wide text-primaire">
        {(annonce.partenaires as any)?.nom}
      </p>
      <h1 className="mb-2 text-center font-display text-3xl font-semibold text-encre">{annonce.title}</h1>
      <p className="mb-6 text-center text-xs text-encre/50">
        {new Date(annonce.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>

      {annonce.image_url && (
        <ZoomableImage src={annonce.image_url} alt={annonce.title} className="mb-6 h-64 w-full rounded-lg object-cover" />
      )}

      <div className="text-justify">
        <ContenuFormatte texte={annonce.content} />
      </div>

      <div className="mt-8 border-t border-black/10 pt-4">
        <BoutonsPartage url={`${process.env.NEXT_PUBLIC_SITE_URL}/partenaires/annonces/${annonce.id}`} titre={annonce.title} />
      </div>
    </div>
  )
}
