import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function PageAPropos() {
  const supabase = await createClient()
  const { data } = await supabase.from('pages_contenu').select('contenu').eq('slug', 'a-propos').single()
  const c = data?.contenu ?? {}

  const missions = (c.missions ?? '').split('\n').filter(Boolean)
  const objectifs = (c.objectifs ?? '').split('\n').filter(Boolean)

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-8 font-display text-3xl font-semibold text-encre">À propos de l'ASSEMA</h1>

      {c.histoire && (
        <section className="mb-8">
          <h2 className="mb-2 font-display text-xl font-semibold text-primaire">Histoire</h2>
          <p className="text-encre/80">{c.histoire}</p>
        </section>
      )}

      {c.vision && (
        <section className="mb-8">
          <h2 className="mb-2 font-display text-xl font-semibold text-primaire">Vision</h2>
          <p className="text-encre/80">{c.vision}</p>
        </section>
      )}

      {missions.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-2 font-display text-xl font-semibold text-primaire">Missions</h2>
          <ul className="list-inside list-disc space-y-1 text-encre/80">
            {missions.map((m: string, i: number) => <li key={i}>{m}</li>)}
          </ul>
        </section>
      )}

      {objectifs.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-2 font-display text-xl font-semibold text-primaire">Objectifs</h2>
          <ul className="list-inside list-disc space-y-1 text-encre/80">
            {objectifs.map((o: string, i: number) => <li key={i}>{o}</li>)}
          </ul>
        </section>
      )}

      {c.valeurs && (
        <section>
          <h2 className="mb-2 font-display text-xl font-semibold text-primaire">Valeurs</h2>
          <p className="text-encre/80">{c.valeurs}</p>
        </section>
      )}
    </div>
  )
}