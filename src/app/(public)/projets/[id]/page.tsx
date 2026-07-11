import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ContenuFormatte from '@/components/contenu-formatte'

export const dynamic = 'force-dynamic'

export default async function PageProjet({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: projet } = await supabase
    .from('projets')
    .select('id, titre, description, resultats, projet_medias(id, url, type)')
    .eq('id', id)
    .single()

  if (!projet) notFound()

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <a href="/projets" className="text-xs font-medium text-primaire hover:underline">← Tous les projets</a>
      <h1 className="mb-6 mt-2 font-display text-3xl font-semibold text-encre">{projet.titre}</h1>

      {projet.projet_medias?.length > 0 && (
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {projet.projet_medias.map((m: any) => (
            <div key={m.id} className="overflow-hidden rounded-lg border border-black/5">
              {m.type === 'video' ? (
                <video src={m.url} controls className="h-40 w-full object-cover" />
              ) : (
                <img src={m.url} alt="" className="h-40 w-full object-cover" />
              )}
            </div>
          ))}
        </div>
      )}

      {projet.description && (
        <section className="mb-6">
          <h2 className="mb-2 font-display text-xl font-semibold text-primaire">Description</h2>
          <ContenuFormatte texte={projet.description} />
        </section>
      )}

      {projet.resultats && (
        <section>
          <h2 className="mb-2 font-display text-xl font-semibold text-primaire">Résultats et impacts</h2>
          <ContenuFormatte texte={projet.resultats} />
        </section>
      )}
    </div>
  )
}