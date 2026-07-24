import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ContenuFormatte from '@/components/contenu-formatte'
import ZoomableImage from '@/components/zoomable-image'
import { extraireTexte } from '@/lib/texte'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

function formaterDate(date: string | null) {
  if (!date) return null
  return new Date(date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()

  const { data: figure } = await supabase
    .from('figures_mabi')
    .select('nom, biographie, village, photo_url')
    .eq('id', id)
    .single()

  if (!figure) return {}

  const description = figure.biographie
    ? extraireTexte(figure.biographie, 160)
    : `${figure.nom}, grande figure du peuple Mabi${figure.village ? ` originaire de ${figure.village}` : ''}, Kribi, Sud Cameroun.`
  const url = `/culture-mabi/figures/${id}`
  const images = figure.photo_url ? [figure.photo_url] : undefined

  return {
    title: `${figure.nom} — Grande figure Mabi`,
    description,
    alternates: { canonical: url },
    openGraph: { title: `${figure.nom} — Grande figure Mabi`, description, url, type: 'profile', images },
  }
}

export default async function PageFigure({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: figure } = await supabase
    .from('figures_mabi')
    .select('id, nom, photo_url, biographie, date_naissance, date_deces, vivant, village')
    .eq('id', id)
    .single()

  if (!figure) notFound()

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <a href="/culture-mabi/figures" className="text-xs font-medium text-primaire hover:underline">← Grandes figures Mabi</a>

      <div className="mb-6 mt-4 flex items-center gap-4">
        {figure.photo_url && <ZoomableImage src={figure.photo_url} alt={figure.nom} className="h-20 w-20 rounded-full object-cover" />}
        <div>
          <h1 className="font-display text-2xl font-semibold text-encre">{figure.nom}</h1>
          <p className="text-xs text-encre/60">
            {figure.village}
            {figure.village && ' · '}
            <span className={figure.vivant ? 'text-succes' : 'text-encre/60'}>
              {figure.vivant ? 'En vie' : 'Décédé(e)'}
            </span>
          </p>
          {(figure.date_naissance || figure.date_deces) && (
            <p className="font-mono text-xs text-encre/40">
              {formaterDate(figure.date_naissance)}
              {!figure.vivant && figure.date_deces && ` — ${formaterDate(figure.date_deces)}`}
            </p>
          )}
        </div>
      </div>

      {figure.biographie ? (
        <ContenuFormatte texte={figure.biographie} />
      ) : (
        <p className="text-sm text-encre/60">Aucune biographie renseignée pour le moment.</p>
      )}
    </div>
  )
}
