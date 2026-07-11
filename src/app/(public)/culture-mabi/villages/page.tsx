import { createClient } from '@/lib/supabase/server'
import Reveal from '@/components/reveal'

export const dynamic = 'force-dynamic'

export default async function PageVillagesMabi() {
  const supabase = await createClient()

  const { data: villages } = await supabase
    .from('villages_mabi')
    .select('id, nom, description, population_estimee, chef_nom, chef_photo_url, village_medias(url)')
    .order('nom')

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <a href="/culture-mabi" className="text-xs font-medium text-primaire hover:underline">← Culture Mabi</a>
      <h1 className="mb-2 mt-2 font-display text-3xl font-semibold text-encre">Villages Mabi</h1>
      <p className="mb-8 text-encre/70">Le recensement et la mémoire des villages de notre communauté.</p>

      {villages && villages.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-3">
          {villages.map((v: any, i: number) => {
            const photoCouverture = v.village_medias?.[0]?.url
            return (
              <Reveal key={v.id} delayMs={i * 80}>
                <a href={`/culture-mabi/villages/${v.id}`} className="carte-interactive block h-full overflow-hidden rounded-lg border border-black/5 bg-white shadow-sm">
                  {photoCouverture && <img src={photoCouverture} alt="" className="h-32 w-full object-cover" />}
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