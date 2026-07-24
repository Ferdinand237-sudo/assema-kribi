import { createClient } from '@/lib/supabase/server'
import Reveal from '@/components/reveal'
import ZoomableImage from '@/components/zoomable-image'
import CarteVillages from '@/components/carte-villages'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Villages Mabi',
  description: "Recensement des villages du peuple Mabi à Kribi, Sud Cameroun : population, chefferie traditionnelle, histoire et patrimoine.",
  alternates: { canonical: '/culture-mabi/villages' },
}

export default async function PageVillagesMabi() {
  const supabase = await createClient()

  const { data: villages } = await supabase
    .from('villages_mabi')
    .select('id, nom, description, population_estimee, chef_nom, chef_photo_url, latitude, longitude, village_medias(url)')
    .order('nom')

  const villagesLocalises = (villages ?? []).filter(
    (v): v is typeof v & { latitude: number; longitude: number } => v.latitude != null && v.longitude != null
  )

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <a href="/culture-mabi" className="text-xs font-medium text-primaire hover:underline">← Culture Mabi</a>
      <h1 className="mb-2 mt-2 font-display text-3xl font-semibold text-encre">Villages Mabi</h1>
      <p className="mb-8 text-encre/70">Le recensement et la mémoire des villages de notre communauté.</p>

      {villagesLocalises.length > 0 && (
        <div className="mb-8">
          <CarteVillages villages={villagesLocalises} />
        </div>
      )}

      {villages && villages.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-3">
          {villages.map((v: any, i: number) => {
            const photoCouverture = v.village_medias?.[0]?.url
            return (
              <Reveal key={v.id} delayMs={i * 80}>
                <a href={`/culture-mabi/villages/${v.id}`} className="carte-interactive block h-full overflow-hidden rounded-lg border border-black/5 bg-white shadow-sm">
                  {photoCouverture && <ZoomableImage src={photoCouverture} alt="" className="h-32 w-full object-cover" />}
                  <div className="p-3">
                    <h3 className="font-semibold text-encre">{v.nom}</h3>
                    {v.population_estimee && <p className="font-mono text-xs text-encre/60">~{v.population_estimee} habitants</p>}
                    {v.chef_nom && <p className="text-xs text-encre/60">Chef : {v.chef_nom}</p>}
                  </div>
                </a>
              </Reveal>
            )
          })}
        </div>
      ) : (
        <p className="text-sm text-encre/60">Le recensement des villages n'a pas encore commencé.</p>
      )}
    </div>
  )
}