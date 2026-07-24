import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://assema-kribi.netlify.app'

const PAGES_STATIQUES = [
  '', '/a-propos', '/contact', '/bureau-executif', '/culture-mabi',
  '/culture-mabi/villages', '/culture-mabi/figures', '/culture-mabi/contes', '/culture-mabi/culinaire',
  '/projets', '/partenaires', '/galerie',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )

  const [
    { data: villages },
    { data: figures },
    { data: projets },
    { data: articles },
    { data: communiques },
    { data: annonces },
  ] = await Promise.all([
    supabase.from('villages_mabi').select('id'),
    supabase.from('figures_mabi').select('id'),
    supabase.from('projets').select('id'),
    supabase.from('articles').select('id').eq('status', 'published'),
    supabase.from('communiques').select('id').eq('canal_public', true),
    supabase.from('annonces_partenaires').select('id').eq('status', 'published'),
  ])

  const pagesStatiques: MetadataRoute.Sitemap = PAGES_STATIQUES.map((chemin) => ({
    url: `${SITE_URL}${chemin}`,
    lastModified: new Date(),
  }))

  const pagesDynamiques: MetadataRoute.Sitemap = [
    ...(villages ?? []).map((v) => ({ url: `${SITE_URL}/culture-mabi/villages/${v.id}` })),
    ...(figures ?? []).map((f) => ({ url: `${SITE_URL}/culture-mabi/figures/${f.id}` })),
    ...(projets ?? []).map((p) => ({ url: `${SITE_URL}/projets/${p.id}` })),
    ...(articles ?? []).map((a) => ({ url: `${SITE_URL}/articles/${a.id}` })),
    ...(communiques ?? []).map((c) => ({ url: `${SITE_URL}/communiques/${c.id}` })),
    ...(annonces ?? []).map((a) => ({ url: `${SITE_URL}/partenaires/annonces/${a.id}` })),
  ]

  return [...pagesStatiques, ...pagesDynamiques]
}
