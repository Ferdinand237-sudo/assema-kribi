import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function SiteFooter() {
  const supabase = await createClient()
  const { data } = await supabase.from('pages_contenu').select('contenu').eq('slug', 'contact').single()
  const c = data?.contenu ?? {}

  return (
    <footer className="mt-16 bg-encre text-white/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-3">
        <div>
          <a href="/" className="flex items-center gap-2">
            <img src="/logo-assema.jpeg" alt="ASSEMA Kribi" className="h-9 w-9 rounded-full object-cover" />
            <span className="font-display text-lg font-semibold text-white">ASSEMA</span>
          </a>
          <p className="mt-3 text-sm text-white/60">
            Association des Étudiants Mabi de Kribi — un espace communautaire pour connecter, valoriser
            et faire grandir les étudiants Mabi, à Kribi comme dans la diaspora.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-white/40">Navigation</p>
          <nav className="mt-3 flex flex-col gap-2 text-sm">
            <a href="/culture-mabi" className="transition-colors hover:text-primaire">Culture Mabi</a>
            <a href="/projets" className="transition-colors hover:text-primaire">Projets</a>
            <a href="/bureau-executif" className="transition-colors hover:text-primaire">Bureau exécutif</a>
            <a href="/partenaires" className="transition-colors hover:text-primaire">Partenaires</a>
            <a href="/galerie" className="transition-colors hover:text-primaire">Galerie</a>
            <a href="/forum" className="transition-colors hover:text-primaire">Forum</a>
          </nav>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-white/40">Contact</p>
          <div className="mt-3 space-y-2 text-sm text-white/70">
            {c.adresse && <p>{c.adresse}</p>}
            {c.reseaux_sociaux && <p>{c.reseaux_sociaux}</p>}
            <a href="/contact" className="inline-block font-medium text-primaire hover:underline">
              Nous contacter →
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-4 text-center text-xs text-white/40">
        © {new Date().getFullYear()} ASSEMA Kribi. Tous droits réservés.
      </div>
    </footer>
  )
}
