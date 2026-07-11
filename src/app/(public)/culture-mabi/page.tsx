import { createClient } from '@/lib/supabase/server'
import Reveal from '@/components/reveal'

export const dynamic = 'force-dynamic'

export default async function PageCultureMabi() {
  const supabase = await createClient()

  const [{ count: nbVillages }, { count: nbFigures }, { count: nbContes }, { count: nbCulinaire }] = await Promise.all([
    supabase.from('villages_mabi').select('id', { count: 'exact', head: true }),
    supabase.from('figures_mabi').select('id', { count: 'exact', head: true }),
    supabase.from('articles').select('id', { count: 'exact', head: true }).eq('categorie', 'culture_contes').eq('status', 'published'),
    supabase.from('articles').select('id', { count: 'exact', head: true }).eq('categorie', 'culture_culinaire').eq('status', 'published'),
  ])

  const rubriques = [
    {
      href: '/culture-mabi/villages',
      titre: 'Villages Mabi',
      description: 'Le recensement et la mémoire de nos villages : histoire, chefferie et population.',
      compte: `${nbVillages ?? 0} village(s)`,
    },
    {
      href: '/culture-mabi/figures',
      titre: 'Grandes figures Mabi',
      description: 'Les élites, sages et héros qui ont marqué l\'histoire de notre peuple.',
      compte: `${nbFigures ?? 0} figure(s)`,
    },
    {
      href: '/culture-mabi/contes',
      titre: 'Contes & légendes',
      description: 'Le folklore Mabi transmis de génération en génération.',
      compte: `${nbContes ?? 0} récit(s)`,
    },
    {
      href: '/culture-mabi/culinaire',
      titre: 'Arts culinaires',
      description: 'Recettes, saveurs et traditions culinaires de notre peuple.',
      compte: `${nbCulinaire ?? 0} article(s)`,
    },
  ]

  return (
    <div>
      <section className="bg-primaire px-6 py-16 text-center text-white">
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">Culture Mabi</h1>
        <p className="mx-auto mt-4 max-w-xl text-white/90">
          Un peuple fier de la côte kribienne. Cet espace est dédié à la préservation et à la
          transmission de notre histoire, de nos traditions et de notre mémoire collective —
          pour que chaque jeune Mabi, où qu'il se trouve, puisse se reconnecter à ses racines.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-2">
          {rubriques.map((r, i) => (
            <Reveal key={r.href} delayMs={i * 80}>
              <a href={r.href} className="carte-interactive block h-full rounded-lg border border-black/5 bg-white p-6 shadow-sm">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="font-display text-xl font-semibold text-primaire">{r.titre}</h2>
                  <span className="font-mono text-xs text-encre/50">{r.compte}</span>
                </div>
                <p className="text-sm text-encre/70">{r.description}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-fond-clair px-6 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-3 font-display text-xl font-semibold text-encre">Notre histoire, notre langue, notre patrimoine</h2>
          <p className="text-encre/80">
            Le peuple Mabi possède une histoire riche ancrée dans la région de Kribi, marquée par des
            traditions transmises de génération en génération. Danses, rites, gastronomie et savoir-faire
            traditionnels constituent une part importante de notre identité, que l'ASSEMA s'efforce de
            documenter et de faire vivre à travers cette plateforme.
          </p>
        </div>
      </section>
    </div>
  )
}