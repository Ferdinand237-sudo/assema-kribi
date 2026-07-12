import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ContenuFormatte from '@/components/contenu-formatte'
import ZoomableImage from '@/components/zoomable-image'

export const dynamic = 'force-dynamic'

export default async function PageVillage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: village } = await supabase
    .from('villages_mabi')
    .select('*, village_medias(id, url, legende), village_chefferie_membres(id, nom, fonction, photo_url, bio)')
    .eq('id', id)
    .single()

  if (!village) notFound()

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <a href="/culture-mabi/villages" className="text-xs font-medium text-primaire hover:underline">← Tous les villages</a>
      <h1 className="mb-2 mt-2 font-display text-3xl font-semibold text-encre">{village.nom}</h1>
      {village.population_estimee && (
        <p className="mb-4 font-mono text-sm text-encre/60">Population estimée : ~{village.population_estimee} habitants</p>
      )}

      {village.description && <p className="mb-6 text-encre/80">{village.description}</p>}

      {village.village_medias?.length > 0 && (
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {village.village_medias.map((m: any) => (
            <div key={m.id}>
              <ZoomableImage src={m.url} alt={m.legende ?? ''} className="h-32 w-full rounded-lg object-cover" />
              {m.legende && <p className="mt-1 text-xs text-encre/60">{m.legende}</p>}
            </div>
          ))}
        </div>
      )}

      {village.histoire && (
        <section className="mb-8">
          <h2 className="mb-2 font-display text-xl font-semibold text-primaire">Histoire</h2>
          <ContenuFormatte texte={village.histoire} />
        </section>
      )}

      {village.chef_nom && (
        <section className="mb-8 rounded-lg border border-black/5 bg-fond-clair p-4">
          <h2 className="mb-3 font-display text-xl font-semibold text-primaire">Autorité traditionnelle</h2>
          <div className="flex items-center gap-3">
            {village.chef_photo_url && (
              <ZoomableImage src={village.chef_photo_url} alt="" className="h-16 w-16 rounded-full object-cover" />
            )}
            <div>
              <p className="font-semibold text-encre">{village.chef_nom}</p>
              <p className="text-xs text-encre/60">Chef du village</p>
            </div>
          </div>
          {village.chef_bio && <div className="mt-3 text-sm text-encre/80"><ContenuFormatte texte={village.chef_bio} /></div>}
        </section>
      )}

      {village.village_chefferie_membres?.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-xl font-semibold text-primaire">Membres de la chefferie</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {village.village_chefferie_membres.map((m: any) => (
              <div key={m.id} className="rounded-lg border border-black/5 bg-white p-3 text-center shadow-sm">
                {m.photo_url && <ZoomableImage src={m.photo_url} alt="" className="mx-auto mb-2 h-14 w-14 rounded-full object-cover" />}
                <p className="font-medium text-encre">{m.nom}</p>
                {m.fonction && <p className="text-xs text-primaire">{m.fonction}</p>}
                {m.bio && <p className="mt-1 text-xs text-encre/60">{m.bio}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}