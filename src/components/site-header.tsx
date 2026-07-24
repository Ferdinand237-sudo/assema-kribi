import { createClient } from '@/lib/supabase/server'
import { deconnecter } from '@/app/(auth)/actions'
import MenuMobile from './menu-mobile'
import NavDropdown from './nav-dropdown'

const LIENS_PUBLICS_BASE = [
  { href: '/', label: 'Accueil' },
  { href: '/bureau-executif', label: 'Bureau' },
  { href: '/culture-mabi', label: 'Culture Mabi' },
  { href: '/partenaires', label: 'Partenaires' },
  { href: '/galerie', label: 'Galerie' },
]

const LIEN_FORUM = { href: '/forum', label: 'Forum' }

const LIENS_PUBLICS_FIN = [
  { href: '/a-propos', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
]

// Correspondance module -> route de gestion. On ajoute une ligne ici
// à chaque nouveau module construit.
const ROUTES_GESTION: Record<string, { href: string; label: string }> = {
  partenaires: { href: '/gestion/partenaires', label: 'Gérer les partenaires' },
  galerie: { href: '/gestion/galerie', label: 'Gérer la galerie' },
  culture_villages: { href: '/gestion/villages-mabi', label: 'Gérer les villages Mabi' },
  culture_figures: { href: '/gestion/figures-mabi', label: 'Gérer les grandes figures' },
  projets: { href: '/gestion/projets', label: 'Gérer les projets' },
  talents: { href: '/gestion/talents', label: 'Épingler des talents' },
}

export const dynamic = 'force-dynamic'

export default async function SiteHeader() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile: any = null
  let messagesNonLus = 0
  let communiquesNonLus = 0
  let estRedacteur = false
  let estAdminOuPresident = false
  let modulesGeres: string[] = []

  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, avatar_url, role')
      .eq('id', user.id)
      .single()
    profile = data

    if (profile) {
      estAdminOuPresident = ['admin', 'president'].includes(profile.role)

      const [{ count: nbMessages }, { count: nbCommuniques }, { data: commissionsMembre }, { data: gestions }] = await Promise.all([
        supabase
          .from('messages')
          .select('id', { count: 'exact', head: true })
          .eq('receiver_id', user.id)
          .eq('read', false),
        supabase
          .from('communique_destinataires')
          .select('id', { count: 'exact', head: true })
          .eq('profile_id', user.id)
          .eq('read', false),
        supabase.from('commission_members').select('id').eq('profile_id', user.id).limit(1),
        supabase.from('gestionnaires_module').select('module').eq('profile_id', user.id),
      ])

      messagesNonLus = nbMessages ?? 0
      communiquesNonLus = nbCommuniques ?? 0
      estRedacteur = estAdminOuPresident || (commissionsMembre?.length ?? 0) > 0
      modulesGeres = (gestions ?? []).map((g: any) => g.module)
    }
  }

  // Menu "Informations" : messagerie, communiqués, rédaction
  const liensInformations = user
    ? [
        { href: '/messagerie', label: 'Messagerie', badge: messagesNonLus },
        { href: '/discussions', label: 'Discussions privées' },
        { href: '/communiques', label: 'Communiqués', badge: communiquesNonLus },
        ...(estRedacteur ? [{ href: '/redaction', label: 'Rédaction' }] : []),
      ]
    : []
  const badgeInformations = messagesNonLus + communiquesNonLus

  // Menu "Gestion" : administration + tous les modules délégués
  const liensModules = estAdminOuPresident
    ? Object.values(ROUTES_GESTION)
    : modulesGeres.filter((m) => ROUTES_GESTION[m]).map((m) => ROUTES_GESTION[m])

  const liensGestion = [
    ...(estAdminOuPresident
        ? [
            { href: '/admin', label: 'Administration' },
            { href: '/admin/delegations', label: 'Délégations' },
        ]
        : []),
    ...liensModules,
    ]

  // Le forum n'est accessible qu'aux membres connectés (échanges internes) ;
  // "À propos" vient juste après, qu'il soit affiché ou non.
  const liensPublics = [
    ...LIENS_PUBLICS_BASE,
    ...(user ? [LIEN_FORUM] : []),
    ...LIENS_PUBLICS_FIN,
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-fond-clair/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="/" className="flex items-center gap-2">
          <img src="/logo-assema.jpeg" alt="ASSEMA Kribi" className="h-10 w-10 rounded-full object-cover" />
          <span className="font-display text-lg font-semibold text-encre">ASSEMA</span>
        </a>

        <nav className="hidden items-center gap-4 lg:flex">
          {liensPublics.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-encre/80 transition-colors hover:text-primaire">
              {l.label}
            </a>
          ))}

          <NavDropdown label="Informations" items={liensInformations} badgeTotal={badgeInformations} />
          <NavDropdown label="Gestion" items={liensGestion} />
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {user && profile ? (
            <>
              <a href="/profil" className="flex items-center gap-2 text-sm text-encre">
                {profile.avatar_url && (
                  <img src={profile.avatar_url} alt="" className="h-8 w-8 rounded-full object-cover" />
                )}
                {profile.first_name}
              </a>
              <form action={deconnecter}>
                <button type="submit" className="text-sm text-encre/60 transition-colors hover:text-erreur">
                  Déconnexion
                </button>
              </form>
            </>
          ) : (
            <>
              <a href="/connexion" className="text-sm text-encre/80 transition-colors hover:text-primaire">Connexion</a>
              <a href="/inscription" className="bouton bouton-primaire !py-1.5">
                S'inscrire
              </a>
            </>
          )}
        </div>

        <MenuMobile
          liensPublics={liensPublics}
          liensInformations={liensInformations}
          liensGestion={liensGestion}
          connecte={!!user}
          prenom={profile?.first_name}
          avatarUrl={profile?.avatar_url}
        />
      </div>
    </header>
  )
}