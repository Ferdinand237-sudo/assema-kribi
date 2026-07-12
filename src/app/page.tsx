import { createClient } from '@/lib/supabase/server'
import Reveal from '@/components/reveal'
import ZoomableImage from '@/components/zoomable-image'

export default async function PageAccueil() {
  const supabase = await createClient()

  const [
    { data: projets },
    { data: articles },
    { data: communiques },
    { data: talentsEpingles },
  ] = await Promise.all([
    supabase
      .from('projets')
      .select('id, titre, description, created_at')
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('articles')
      .select('id, title, content, published_at, commission_id, commissions(nom)')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(4),
    supabase
      .from('communiques')
      .select('id, title, content, created_at')
      .eq('canal_public', true)
      .order('created_at', { ascending: false })
      .limit(4),
    supabase
      .from('talents_mis_en_avant')
      .select('ordre, profiles!talents_mis_en_avant_profile_id_fkey(id, first_name, last_name, filiere, avatar_url)')
      .order('ordre')
      .limit(4),
  ])

  // Complète avec des talents automatiques si moins de 4 épinglés
  const idsEpingles = new Set((talentsEpingles ?? []).map((t: any) => t.profiles?.id))
  let talents = (talentsEpingles ?? []).map((t: any) => t.profiles).filter(Boolean)

  if (talents.length < 4) {
    const { data: automatiques } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, filiere, competences, avatar_url, profile_privacy!inner(show_competences)')
      .eq('profile_privacy.show_competences', true)
      .not('competences', 'is', null)
      .limit(8)

    const complement = (automatiques ?? []).filter((p: any) => !idsEpingles.has(p.id))
    talents = [...talents, ...complement].slice(0, 4)
  }

  const actualites = [
    ...(articles ?? []).map((a) => ({
      id: `article-${a.id}`,
      titre: a.title,
      extrait: a.content.slice(0, 140),
      date: a.published_at,
      source: (a.commissions as unknown as { nom: string } | null)?.nom ?? 'Commission',
    })),
    ...(communiques ?? []).map((c) => ({
      id: `communique-${c.id}`,
      titre: c.title,
      extrait: c.content.slice(0, 140),
      date: c.created_at,
      source: 'Communiqué du président',
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4)

  return (
    <div>
      <section className="bg-primaire px-6 py-20 text-center text-white">
        <h1 className="arrivee-douce font-display text-4xl font-semibold sm:text-5xl">
          Association des Étudiants Mabi de Kribi
        </h1>
        <p className="arrivee-douce mx-auto mt-4 max-w-xl text-white/90" style={{ animationDelay: '120ms' }}>
          Un espace communautaire pour connecter, valoriser et faire grandir les étudiants Mabi — à Kribi comme dans la diaspora.
        </p>
        <div className="arrivee-douce mt-6 flex justify-center gap-3" style={{ animationDelay: '240ms' }}>
          <a href="/inscription" className="bouton bg-white text-primaire hover:bg-fond-clair">
            Rejoindre l'association
          </a>
          <a href="/a-propos" className="bouton border border-white/70 text-white hover:bg-white/10">
            En savoir plus
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-12 text-center">
        <p className="text-encre/80">
          L'ASSEMA fédère les étudiants originaires de la communauté Mabi autour de projets culturels,
          éducatifs et communautaires. Retrouvez ici nos actualités, nos commissions et nos talents.
        </p>
      </section>

      <section className="bg-fond-clair px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-6 font-display text-2xl font-semibold text-encre">Projets réalisés</h2>
          {projets && projets.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-3">
              {projets.map((p, i) => (
                <Reveal key={p.id} delayMs={i * 80}>
                  <a href={`/projets/${p.id}`} className="carte-interactive block h-full rounded-lg border border-black/5 bg-white p-4 shadow-sm">
                    <h3 className="font-semibold text-encre">{p.titre}</h3>
                    <p className="mt-1 text-sm text-encre/70">{p.description?.slice(0, 100)}</p>
                  </a>
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="text-sm text-encre/60">Aucun projet publié pour le moment. Revenez bientôt !</p>
          )}
          <div className="mt-4 text-center">
            <a href="/projets" className="text-sm font-medium text-primaire hover:underline">Voir tous les projets →</a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="mb-6 font-display text-2xl font-semibold text-encre">Actualités récentes</h2>
        {actualites.length > 0 ? (
          <div className="space-y-4">
            {actualites.map((a, i) => (
              <Reveal key={a.id} delayMs={i * 80}>
                <div className="rounded-lg border border-black/5 bg-white p-4 shadow-sm">
                  <p className="font-mono text-xs font-medium uppercase tracking-wide text-primaire">{a.source}</p>
                  <h3 className="font-semibold text-encre">{a.titre}</h3>
                  <p className="mt-1 text-sm text-encre/70">{a.extrait}...</p>
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="text-sm text-encre/60">Aucune actualité pour le moment.</p>
        )}
      </section>

      <section className="bg-fond-clair px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-6 font-display text-2xl font-semibold text-encre">Talents à découvrir</h2>
          {talents.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-4">
              {talents.map((t: any, i: number) => (
                <Reveal key={t.id} delayMs={i * 80}>
                  <a href={`/membres/${t.id}`} className="carte-interactive block h-full rounded-lg border border-black/5 bg-white p-4 text-center shadow-sm">
                    {t.avatar_url && (
                      <ZoomableImage src={t.avatar_url} alt="" className="mx-auto mb-2 h-14 w-14 rounded-full object-cover" />
                    )}
                    <p className="font-medium text-encre">{t.first_name} {t.last_name}</p>
                    <p className="text-xs text-encre/60">{t.filiere}</p>
                  </a>
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="text-sm text-encre/60">Les profils des étudiants apparaîtront ici au fur et à mesure des inscriptions.</p>
          )}
        </div>
      </section>
    </div>
  )
}