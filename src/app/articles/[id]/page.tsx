import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ContenuFormatte from '@/components/contenu-formatte'
import ZoomableImage from '@/components/zoomable-image'
import BoutonsPartage from '@/components/boutons-partage'
import { extraireTexte } from '@/lib/texte'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

const LABELS_CATEGORIE: Record<string, string> = {
  culture_contes: 'Contes & légendes Mabi',
  culture_culinaire: 'Arts culinaires Mabi',
}

const RETOUR: Record<string, { href: string; label: string }> = {
  culture_contes: { href: '/culture-mabi/contes', label: '← Contes & légendes Mabi' },
  culture_culinaire: { href: '/culture-mabi/culinaire', label: '← Arts culinaires Mabi' },
  commission: { href: '/', label: "← Retour à l'accueil" },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()

  const { data: article } = await supabase
    .from('articles')
    .select('title, content, cover_image_url')
    .eq('id', id)
    .eq('status', 'published')
    .single()

  if (!article) return {}

  const description = extraireTexte(article.content, 160)
  const url = `/articles/${id}`
  const images = article.cover_image_url ? [article.cover_image_url] : undefined

  return {
    title: article.title,
    description,
    alternates: { canonical: url },
    openGraph: { title: article.title, description, url, type: 'article', images },
    twitter: { title: article.title, description, images },
  }
}

export default async function PageArticle({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: article } = await supabase
    .from('articles')
    .select('id, title, content, cover_image_url, published_at, categorie, commissions(nom), profiles!articles_author_id_fkey(first_name, last_name)')
    .eq('id', id)
    .eq('status', 'published')
    .single()

  if (!article) notFound()

  const source = article.categorie === 'commission'
    ? (article.commissions as any)?.nom ?? 'Commission'
    : LABELS_CATEGORIE[article.categorie]
  const retour = RETOUR[article.categorie] ?? RETOUR.commission

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <a href={retour.href} className="text-xs font-medium text-primaire hover:underline">{retour.label}</a>

      <p className="mb-1 mt-4 text-center font-mono text-xs font-medium uppercase tracking-wide text-primaire">{source}</p>
      <h1 className="mb-2 text-center font-display text-3xl font-semibold text-encre">{article.title}</h1>
      <p className="mb-6 text-center text-xs text-encre/50">
        Par {(article.profiles as any)?.first_name} {(article.profiles as any)?.last_name}
        {article.published_at && ` — ${new Date(article.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`}
      </p>

      {article.cover_image_url && (
        <ZoomableImage src={article.cover_image_url} alt="" className="mb-6 h-64 w-full rounded-lg object-cover" />
      )}

      <div className="text-justify">
        <ContenuFormatte texte={article.content} />
      </div>

      <div className="mt-8 border-t border-black/10 pt-4">
        <BoutonsPartage url={`${process.env.NEXT_PUBLIC_SITE_URL}/articles/${article.id}`} titre={article.title} />
      </div>
    </div>
  )
}
