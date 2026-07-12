import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ZoomableImage from '@/components/zoomable-image'

export const dynamic = 'force-dynamic'

const RESEAUX: { cle: string; label: string; icone: React.ReactNode; construireHref: (v: string) => string }[] = [
  {
    cle: 'facebook',
    label: 'Facebook',
    construireHref: (v) => v,
    icone: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14C17.17 2.1 15.95 2 14.66 2 11.98 2 10 3.66 10 6.7v2.8H7v4h3V22h4v-8.5z"/></svg>
    ),
  },
  {
    cle: 'linkedin',
    label: 'LinkedIn',
    construireHref: (v) => v,
    icone: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.68-2.91V8.48z"/></svg>
    ),
  },
  {
    cle: 'x',
    label: 'X',
    construireHref: (v) => v,
    icone: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M18.9 2H22l-7.6 8.7L23.3 22h-7.2l-5.6-7.3L4 22H1l8.1-9.3L1 2h7.4l5 6.7L18.9 2zm-1.3 18h1.9L7.5 4H5.4l12.2 16z"/></svg>
    ),
  },
  {
    cle: 'email',
    label: 'Email',
    construireHref: (v) => `mailto:${v}`,
    icone: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
    ),
  },
  {
    cle: 'whatsapp',
    label: 'WhatsApp',
    construireHref: (v) => `https://wa.me/${v.replace(/[^0-9]/g, '')}`,
    icone: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.42-1.34a9.9 9.9 0 0 0 4.62 1.14h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2zm5.8 14.14c-.25.7-1.24 1.3-2.02 1.46-.55.11-1.26.2-3.65-.78-3.06-1.27-5.03-4.38-5.19-4.58-.15-.2-1.24-1.65-1.24-3.15 0-1.5.79-2.24 1.07-2.55.28-.31.6-.38.8-.38h.58c.19 0 .43-.07.68.52.25.6.85 2.09.93 2.24.08.15.13.33.02.53-.1.2-.15.33-.3.5-.15.18-.3.4-.44.53-.15.15-.3.31-.13.61.17.31.75 1.24 1.62 2.02 1.11 1 2.05 1.31 2.36 1.46.3.15.48.13.65-.08.18-.2.75-.87.95-1.17.2-.3.4-.25.68-.15.28.1 1.77.84 2.07.99.3.15.5.23.58.35.07.13.07.7-.18 1.4z"/></svg>
    ),
  },
]

export default async function PageProfilPublic({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: profile }, { data: privacy }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', id).single(),
    supabase.from('profile_privacy').select('*').eq('profile_id', id).single(),
  ])

  if (!profile) notFound()

  const peutEcrire = user && user.id !== id && profile.allow_messages

  let cvSignedUrl: string | null = null
  if (privacy?.show_cv && profile.cv_url) {
    const { data } = await supabase.storage.from('cvs').createSignedUrl(profile.cv_url, 60 * 5)
    cvSignedUrl = data?.signedUrl ?? null
  }

  const reseaux = (profile.reseaux_sociaux ?? {}) as Record<string, string>
  const liensReseaux = privacy?.show_reseaux_sociaux
    ? RESEAUX.filter((r) => reseaux[r.cle])
    : []

  const infos = [
    privacy?.show_ecole && profile.ecole && { label: 'École', valeur: profile.ecole },
    privacy?.show_niveau_etude && profile.niveau_etude && { label: "Niveau d'étude", valeur: profile.niveau_etude },
    privacy?.show_village && profile.village && { label: 'Village', valeur: profile.village },
    privacy?.show_contact && profile.telephone && { label: 'Téléphone', valeur: profile.telephone, mono: true },
  ].filter(Boolean) as { label: string; valeur: string; mono?: boolean }[]

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="cadre border border-black/5 bg-white p-6 pt-7 text-center shadow-sm sm:p-8">
        {privacy?.show_photo && profile.avatar_url ? (
          <ZoomableImage src={profile.avatar_url} alt="" className="mx-auto mb-4 h-24 w-24 rounded-full object-cover" />
        ) : (
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-fond-clair font-display text-3xl text-primaire">
            {profile.first_name?.[0]}
          </div>
        )}
        <h1 className="font-display text-2xl font-semibold text-encre">{profile.first_name} {profile.last_name}</h1>
        <p className="text-encre/60">{profile.filiere}</p>

        {profile.bio && <p className="mx-auto mt-4 max-w-md text-sm text-encre/80">{profile.bio}</p>}

        {liensReseaux.length > 0 && (
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {liensReseaux.map((r) => (
              <a
                key={r.cle}
                href={r.construireHref(reseaux[r.cle])}
                target={r.cle === 'email' ? undefined : '_blank'}
                rel="noopener noreferrer"
                title={r.label}
                aria-label={r.label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-fond-clair text-primaire transition-colors hover:bg-primaire hover:text-white"
              >
                {r.icone}
              </a>
            ))}
          </div>
        )}

        {peutEcrire && (
          <a href={`/messagerie/${id}`} className="bouton bouton-primaire mt-6">
            Envoyer un message
          </a>
        )}
      </div>

      {(infos.length > 0 || (privacy?.show_competences && profile.competences?.length > 0) || cvSignedUrl) && (
        <div className="cadre mt-4 border border-black/5 bg-white p-5 pt-6 shadow-sm">
          {infos.length > 0 && (
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {infos.map((info) => (
                <div key={info.label}>
                  <dt className="text-xs font-medium text-encre/50">{info.label}</dt>
                  <dd className={`text-sm text-encre ${info.mono ? 'font-mono' : ''}`}>{info.valeur}</dd>
                </div>
              ))}
            </dl>
          )}

          {privacy?.show_competences && profile.competences?.length > 0 && (
            <div className={infos.length > 0 ? 'mt-4 border-t border-black/10 pt-4' : ''}>
              <p className="mb-2 text-xs font-medium text-encre/50">Compétences</p>
              <div className="flex flex-wrap gap-1.5">
                {profile.competences.map((c: string) => (
                  <span key={c} className="rounded-full bg-fond-clair px-2.5 py-1 text-xs font-medium text-primaire">{c}</span>
                ))}
              </div>
            </div>
          )}

          {cvSignedUrl && (
            <div className="mt-4 border-t border-black/10 pt-4">
              <a href={cvSignedUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primaire hover:underline">
                📄 Télécharger le CV
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
