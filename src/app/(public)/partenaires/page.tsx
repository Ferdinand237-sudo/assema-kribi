import { createClient } from '@/lib/supabase/server'
import ContenuFormatte from '@/components/contenu-formatte'
import Reveal from '@/components/reveal'
import ZoomableImage from '@/components/zoomable-image'

export const dynamic = 'force-dynamic'

export default async function PagePartenaires() {
  const supabase = await createClient()

  const [{ data: partenaires }, { data: annonces }] = await Promise.all([
    supabase.from('partenaires').select('id, nom, logo_url, description, lien').order('created_at', { ascending: false }),
    supabase
      .from('annonces_partenaires')
      .select('id, title, content, image_url, created_at, partenaires(nom)')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(6),
  ])

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-8 font-display text-3xl font-semibold text-encre">Nos partenaires</h1>

      {partenaires && partenaires.length > 0 ? (
        <div className="mb-12 grid gap-6 sm:grid-cols-3">
          {partenaires.map((p, i) => (
            <Reveal key={p.id} delayMs={i * 80}>
              <a
                href={p.lien ?? '#'}
                target={p.lien ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="carte-interactive block h-full rounded-lg border border-black/5 bg-white p-4 text-center shadow-sm"
              >
                {p.logo_url && <img src={p.logo_url} alt={p.nom} className="mx-auto mb-3 h-16 object-contain" />}
                <p className="font-semibold text-encre">{p.nom}</p>
                {p.description && <p className="mt-1 text-xs text-encre/60">{p.description}</p>}
              </a>
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="mb-12 text-sm text-encre/60">Aucun partenaire à afficher pour le moment.</p>
      )}

      {annonces && annonces.length > 0 && (
        <section>
          <h2 className="mb-4 font-display text-xl font-semibold text-encre">Actualités de nos partenaires</h2>
          <div className="space-y-4">
            {annonces.map((a: any) => (
              <div key={a.id} className="flex gap-4 rounded-lg border border-black/5 bg-white p-4 shadow-sm">
                {a.image_url && (
                  <ZoomableImage src={a.image_url} alt="" className="h-20 w-20 flex-shrink-0 rounded-lg object-cover" />
                )}
                <div>
                  <p className="font-mono text-xs uppercase tracking-wide text-primaire">{a.partenaires?.nom}</p>
                  <h3 className="font-semibold text-encre">{a.title}</h3>
                  <ContenuFormatte texte={a.content} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}