import { createClient } from '@/lib/supabase/server'
import Reveal from '@/components/reveal'
import ZoomableImage from '@/components/zoomable-image'
import { extraireTexte } from '@/lib/texte'

const LABELS_CATEGORIE_CULTURE: Record<string, string> = {
  culture_contes: 'Contes & légendes Mabi',
  culture_culinaire: 'Arts culinaires Mabi',
}

export default async function PageAccueil() {
  const supabase = await createClient()

  const [
    { data: projets },
    { data: articles },
    { data: communiques },
    { data: talentsEpingles },
    { data: annoncesPartenaires },
    { data: albumsRecents },
    { data: villagesRecents },
    { data: figuresRecentes },
  ] = await Promise.all([
    supabase
      .from('projets')
      .select('id, titre, description, created_at, projet_medias(url)')
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('articles')
      .select('id, title, content, published_at, categorie, commission_id, commissions(nom)')
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
    supabase
      .from('annonces_partenaires')
      .select('id, title, content, image_url, created_at, partenaires(nom)')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('galerie_albums')
      .select('id, nom, galerie_medias(id, url, type)')
      .order('created_at', { ascending: false })
      .limit(1),
    supabase
      .from('villages_mabi')
      .select('id, nom, village_medias(url)')
      .order('created_at', { ascending: false })
      .limit(2),
    supabase
      .from('figures_mabi')
      .select('id, nom, photo_url')
      .order('created_at', { ascending: false })
      .limit(2),
  ])

  const dernierAlbum = albumsRecents?.[0] ?? null
  const mediasRecents = (dernierAlbum?.galerie_medias ?? []).slice(0, 6)

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
      href: `/articles/${a.id}`,
      titre: a.title,
      extrait: extraireTexte(a.content, 140),
      date: a.published_at,
      source: a.categorie === 'commission'
        ? ((a.commissions as unknown as { nom: string } | null)?.nom ?? 'Commission')
        : (LABELS_CATEGORIE_CULTURE[a.categorie] ?? 'Culture Mabi'),
    })),
    ...(communiques ?? []).map((c) => ({
      id: `communique-${c.id}`,
      href: `/communiques/${c.id}`,
      titre: c.title,
      extrait: extraireTexte(c.content, 140),
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
          Association des Étudiants Mabi
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
              {projets.map((p: any, i) => {
                const couverture = p.projet_medias?.[0]?.url
                return (
                  <Reveal key={p.id} delayMs={i * 80}>
                    <a href={`/projets/${p.id}`} className="carte-interactive block h-full overflow-hidden border border-black/5 bg-white shadow-sm">
                      {couverture && <ZoomableImage src={couverture} alt="" className="h-32 w-full object-cover" />}
                      <div className="p-4">
                        <h3 className="font-semibold text-encre">{p.titre}</h3>
                        <p className="mt-1 text-sm text-encre/70">{extraireTexte(p.description ?? '', 100)}</p>
                      </div>
                    </a>
                  </Reveal>
                )
              })}
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
                <a href={a.href} className="carte-interactive block border border-black/5 bg-white p-4 pt-5 shadow-sm">
                  <p className="font-mono text-xs font-medium uppercase tracking-wide text-primaire">{a.source}</p>
                  <h3 className="font-semibold text-encre">{a.titre}</h3>
                  <p className="mt-1 text-sm text-encre/70">{a.extrait}...</p>
                  <p className="mt-2 text-xs font-medium text-primaire">Lire l'article →</p>
                </a>
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

      {((villagesRecents && villagesRecents.length > 0) || (figuresRecentes && figuresRecentes.length > 0)) && (
        <section className="px-6 py-12">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-1 font-display text-2xl font-semibold text-encre">Notre patrimoine</h2>
            <p className="mb-6 text-sm text-encre/60">Villages et grandes figures de la communauté Mabi, récemment ajoutés.</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {(villagesRecents ?? []).map((v: any, i: number) => {
                const couverture = v.village_medias?.[0]?.url
                return (
                  <Reveal key={`village-${v.id}`} delayMs={i * 80}>
                    <a href={`/culture-mabi/villages/${v.id}`} className="carte-interactive block h-full overflow-hidden border border-black/5 bg-white shadow-sm">
                      {couverture ? (
                        <ZoomableImage src={couverture} alt="" className="h-28 w-full object-cover sm:h-32" />
                      ) : (
                        <div className="flex h-28 w-full items-center justify-center bg-fond-clair text-3xl sm:h-32">🏘️</div>
                      )}
                      <div className="p-3">
                        <p className="font-mono text-[10px] font-medium uppercase tracking-wide text-primaire">Village</p>
                        <h3 className="font-semibold text-encre">{v.nom}</h3>
                      </div>
                    </a>
                  </Reveal>
                )
              })}
              {(figuresRecentes ?? []).map((f: any, i: number) => (
                <Reveal key={`figure-${f.id}`} delayMs={(i + 2) * 80}>
                  <a href={`/culture-mabi/figures/${f.id}`} className="carte-interactive block h-full overflow-hidden border border-black/5 bg-white shadow-sm">
                    {f.photo_url ? (
                      <ZoomableImage src={f.photo_url} alt="" className="h-28 w-full object-cover sm:h-32" />
                    ) : (
                      <div className="flex h-28 w-full items-center justify-center bg-fond-clair text-3xl sm:h-32">🧑🏾</div>
                    )}
                    <div className="p-3">
                      <p className="font-mono text-[10px] font-medium uppercase tracking-wide text-primaire">Figure Mabi</p>
                      <h3 className="font-semibold text-encre">{f.nom}</h3>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>
            <div className="mt-4 text-center">
              <a href="/culture-mabi" className="text-sm font-medium text-primaire hover:underline">Découvrir la culture Mabi →</a>
            </div>
          </div>
        </section>
      )}

      {annoncesPartenaires && annoncesPartenaires.length > 0 && (
        <section className="px-6 py-12">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-6 font-display text-2xl font-semibold text-encre">Actualités de nos partenaires</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {annoncesPartenaires.map((an: any, i: number) => (
                <Reveal key={an.id} delayMs={i * 80}>
                  <a href={`/partenaires/annonces/${an.id}`} className="carte-interactive block h-full overflow-hidden border border-black/5 bg-white shadow-sm">
                    {an.image_url && <ZoomableImage src={an.image_url} alt="" className="h-32 w-full object-cover" />}
                    <div className="p-4">
                      <p className="font-mono text-xs uppercase tracking-wide text-primaire">{an.partenaires?.nom}</p>
                      <h3 className="font-semibold text-encre">{an.title}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-encre/70">{extraireTexte(an.content, 160)}</p>
                      <p className="mt-2 text-xs font-medium text-primaire">Lire l'article →</p>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>
            <div className="mt-4 text-center">
              <a href="/partenaires" className="text-sm font-medium text-primaire hover:underline">Voir tous nos partenaires →</a>
            </div>
          </div>
        </section>
      )}

      {dernierAlbum && mediasRecents.length > 0 && (
        <section className="bg-fond-clair px-6 py-12">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-1 font-display text-2xl font-semibold text-encre">Activités récentes</h2>
            <p className="mb-6 text-sm text-encre/60">Quelques images de « {dernierAlbum.nom} », notre dernier souvenir en date.</p>
            <a href={`/galerie/${dernierAlbum.id}`} className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {mediasRecents.map((m: any) => (
                <div key={m.id} className="carte-interactive block aspect-square overflow-hidden border border-black/5">
                  {m.type === 'video' ? (
                    <video src={m.url} className="h-full w-full object-cover" />
                  ) : (
                    <img src={m.url} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
              ))}
            </a>
            <div className="mt-4 text-center">
              <a href="/galerie" className="text-sm font-medium text-primaire hover:underline">Voir toute la galerie →</a>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}