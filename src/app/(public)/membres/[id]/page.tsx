import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

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

  return (
    <div className="mx-auto max-w-xl px-6 py-12">
      <div className="mb-4 flex items-center gap-4">
        {privacy?.show_photo && profile.avatar_url && (
          <img src={profile.avatar_url} alt="" className="h-20 w-20 rounded-full object-cover" />
        )}
        <div>
          <h1 className="font-display text-2xl font-semibold text-encre">{profile.first_name} {profile.last_name}</h1>
          <p className="text-encre/60">{profile.filiere}</p>
        </div>
      </div>

      {profile.bio && <p className="mb-4 text-encre/80">{profile.bio}</p>}

      <dl className="space-y-2 text-sm text-encre/85">
        {privacy?.show_ecole && profile.ecole && (
          <div><dt className="font-medium text-encre">École</dt><dd>{profile.ecole}</dd></div>
        )}
        {privacy?.show_niveau_etude && profile.niveau_etude && (
          <div><dt className="font-medium text-encre">Niveau d'étude</dt><dd>{profile.niveau_etude}</dd></div>
        )}
        {privacy?.show_village && profile.village && (
          <div><dt className="font-medium text-encre">Village</dt><dd>{profile.village}</dd></div>
        )}
        {privacy?.show_competences && profile.competences?.length > 0 && (
          <div><dt className="font-medium text-encre">Compétences</dt><dd>{profile.competences.join(', ')}</dd></div>
        )}
        {privacy?.show_contact && profile.telephone && (
          <div><dt className="font-medium text-encre">Téléphone</dt><dd className="font-mono">{profile.telephone}</dd></div>
        )}
        {cvSignedUrl && (
          <div>
            <dt className="font-medium text-encre">CV</dt>
            <dd><a href={cvSignedUrl} target="_blank" rel="noopener noreferrer" className="text-primaire hover:underline">Télécharger</a></dd>
          </div>
        )}
      </dl>

      {peutEcrire && (
        <a href={`/messagerie/${id}`} className="bouton bouton-primaire mt-6">
          Envoyer un message
        </a>
      )}
    </div>
  )
}