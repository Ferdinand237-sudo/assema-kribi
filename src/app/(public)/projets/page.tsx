import { createClient } from '@/lib/supabase/server'
import Reveal from '@/components/reveal'
import ZoomableImage from '@/components/zoomable-image'

export const dynamic = 'force-dynamic'

export default async function PageProjets() {
  const supabase = await createClient()

  const { data: projets } = await supabase
    .from('projets')
    .select('id, titre, description, projet_medias(url)')
    .order('created_at', { ascending: false })

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="mb-8 font-display text-3xl font-semibold text-encre">Projets réalisés</h1>

      {projets && projets.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-3">
          {projets.map((p: any, i: number) => {
            const couverture = p.projet_medias?.[0]?.url
            return (
              <Reveal key={p.id} delayMs={i * 80}>
                <a href={`/projets/${p.id}`} className="carte-interactive block h-full overflow-hidden rounded-lg border border-black/5 bg-white shadow-sm">
                  {couverture && <ZoomableImage src={couverture} alt="" className="h-32 w-full object-cover" />}
                  <div className="p-3">
                    <h3 className="font-semibold text-encre">{p.titre}</h3>
                    {p.description && <p className="mt-1 text-xs text-encre/60">{p.description.slice(0, 80)}</p>}
                  </div>
                </a>
              </Reveal>
            )
          })}
        </div>
      ) : (
        <p className="text-sm text-encre/60">Aucun projet publié pour le moment.</p>
      )}
    </div>
  )
}