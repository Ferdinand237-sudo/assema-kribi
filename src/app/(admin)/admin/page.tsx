import { requireAdminOuPresident } from '@/lib/auth/guards'

export const dynamic = 'force-dynamic'

const LIENS = [
  { href: '/admin/commissions', titre: 'Commissions', description: 'Créer et gérer les commissions' },
  { href: '/admin/membres', titre: 'Membres & rôles', description: 'Gérer les rôles et le bureau' },
  { href: '/admin/articles', titre: 'Articles à valider', description: 'Approuver ou rejeter' },
  { href: '/admin/communiques', titre: 'Communiqués & diffusion', description: 'Rédiger et diffuser un communiqué' },
  { href: '/admin/delegations', titre: 'Délégations', description: 'Désigner des gestionnaires de section' },
  { href: '/admin/contenu-pages', titre: 'Contenu des pages', description: 'Éditer À propos et Contact' },
]

export default async function PageAdminDashboard() {
  const { supabase, profile } = await requireAdminOuPresident()

  const compte = (table: string, filtre?: (q: any) => any) => {
    let requete = supabase.from(table).select('id', { count: 'exact', head: true })
    if (filtre) requete = filtre(requete)
    return requete
  }

  const [
    { count: nbMembres },
    { count: nbArticlesPublies },
    { count: nbArticlesAttente },
    { count: nbProjets },
    { count: nbCommissions },
    { count: nbCommuniques },
    { count: nbSujetsForum },
    { count: nbMessagesPrives },
    { count: nbAlbums },
    { count: nbPartenaires },
  ] = await Promise.all([
    compte('profiles'),
    compte('articles', (q) => q.eq('status', 'published')),
    compte('articles', (q) => q.eq('status', 'pending')),
    compte('projets'),
    compte('commissions'),
    compte('communiques'),
    compte('forum_topics'),
    compte('messages'),
    compte('galerie_albums'),
    compte('partenaires'),
  ])

  const statistiques = [
    { label: 'Membres', valeur: nbMembres ?? 0 },
    { label: 'Articles publiés', valeur: nbArticlesPublies ?? 0 },
    { label: 'Articles en attente', valeur: nbArticlesAttente ?? 0, alerte: (nbArticlesAttente ?? 0) > 0 },
    { label: 'Projets réalisés', valeur: nbProjets ?? 0 },
    { label: 'Commissions', valeur: nbCommissions ?? 0 },
    { label: 'Communiqués envoyés', valeur: nbCommuniques ?? 0 },
    { label: 'Sujets du forum', valeur: nbSujetsForum ?? 0 },
    { label: 'Messages privés', valeur: nbMessagesPrives ?? 0 },
    { label: 'Albums galerie', valeur: nbAlbums ?? 0 },
    { label: 'Partenaires', valeur: nbPartenaires ?? 0 },
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-1 font-display text-2xl font-semibold text-encre sm:text-3xl">
        Espace {profile.role === 'admin' ? 'Administrateur' : 'Président'}
      </h1>
      <p className="mb-8 text-sm text-encre/60">
        Connecté en tant que {profile.first_name} {profile.last_name}
      </p>

      <h2 className="mb-3 font-display text-lg font-semibold text-encre">Statistiques du site</h2>
      <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {statistiques.map((s) => (
          <div key={s.label} className="cadre border border-black/5 bg-white p-4 pt-5 shadow-sm">
            <p className={`font-display text-2xl font-semibold ${s.alerte ? 'text-attente' : 'text-primaire'}`}>{s.valeur}</p>
            <p className="text-xs text-encre/60">{s.label}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-3 font-display text-lg font-semibold text-encre">Gestion</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {LIENS.map((l) => (
          <a key={l.href} href={l.href} className="carte-interactive block border border-black/5 bg-white p-4 shadow-sm">
            <h3 className="font-semibold text-encre">{l.titre}</h3>
            <p className="text-sm text-encre/60">{l.description}</p>
          </a>
        ))}
      </div>
    </div>
  )
}