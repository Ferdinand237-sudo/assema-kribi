import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { mettreAJourProfil, uploaderPhoto, uploaderCV } from './actions'
import ZoomableImage from '@/components/zoomable-image'

export const dynamic = 'force-dynamic'

export default async function PageMonProfil({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string; succes?: string }>
}) {
  const { erreur, succes } = await searchParams
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const [{ data: profile }, { data: privacy }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('profile_privacy').select('*').eq('profile_id', user.id).single(),
  ])

  let cvSignedUrl: string | null = null
  if (profile?.cv_url) {
    const { data } = await supabase.storage.from('cvs').createSignedUrl(profile.cv_url, 60 * 5)
    cvSignedUrl = data?.signedUrl ?? null
  }

  const competencesTexte = (profile?.competences ?? []).join(', ')

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-6 flex items-center gap-3 sm:gap-4">
        {profile?.avatar_url && (
          <ZoomableImage src={profile.avatar_url} alt="Photo de profil" className="h-14 w-14 flex-shrink-0 rounded-full object-cover sm:h-16 sm:w-16" />
        )}
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-encre sm:text-2xl">Mon profil</h1>
          <a href={`/membres/${user.id}`} className="block text-sm text-primaire hover:underline">
            Voir mon profil public
          </a>
        </div>
      </div>

      {erreur && <p className="confirmation-douce badge-erreur mb-4 block w-fit rounded-lg px-4 py-3 text-sm">{erreur}</p>}
      {succes && <p className="confirmation-douce badge-succes mb-4 block w-fit rounded-lg px-4 py-3 text-sm">Mis à jour !</p>}

      {/* Upload photo */}
      <section className="cadre mb-4 border border-black/10 bg-white p-4 pt-5 shadow-sm">
        <h2 className="mb-2 font-semibold text-encre">Photo de profil</h2>
        <form action={uploaderPhoto} className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input type="file" name="photo" accept="image/*" required className="champ-fichier" />
          <button type="submit" className="bouton bouton-secondaire !py-1.5 sm:flex-shrink-0">
            Changer
          </button>
        </form>
      </section>

      {/* Upload CV */}
      <section className="cadre mb-6 border border-black/10 bg-white p-4 pt-5 shadow-sm">
        <h2 className="mb-2 font-semibold text-encre">CV (PDF)</h2>
        {cvSignedUrl && (
          <p className="mb-2 text-sm">
            <a href={cvSignedUrl} target="_blank" rel="noopener noreferrer" className="text-primaire hover:underline">
              Voir mon CV actuel
            </a>
          </p>
        )}
        <form action={uploaderCV} className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input type="file" name="cv" accept="application/pdf" required className="champ-fichier" />
          <button type="submit" className="bouton bouton-secondaire !py-1.5 sm:flex-shrink-0">
            {cvSignedUrl ? 'Remplacer' : 'Ajouter'}
          </button>
        </form>
      </section>

      <form action={mettreAJourProfil} className="space-y-6">
        <section className="space-y-3">
          <h2 className="font-semibold text-encre">Informations</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input name="firstName" defaultValue={profile?.first_name ?? ''} placeholder="Prénom" required className="champ" />
            <input name="lastName" defaultValue={profile?.last_name ?? ''} placeholder="Nom" required className="champ" />
          </div>
          <input name="filiere" defaultValue={profile?.filiere ?? ''} placeholder="Filière" required className="champ" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input name="niveauEtude" defaultValue={profile?.niveau_etude ?? ''} placeholder="Niveau d'étude" className="champ" />
            <input name="village" defaultValue={profile?.village ?? ''} placeholder="Village" className="champ" />
          </div>
          <input name="ecole" defaultValue={profile?.ecole ?? ''} placeholder="École" className="champ" />
          <input name="telephone" defaultValue={profile?.telephone ?? ''} placeholder="Téléphone" className="champ" />
          <textarea name="bio" defaultValue={profile?.bio ?? ''} placeholder="Bio courte" rows={3} className="champ" />
          <div>
            <input name="competences" defaultValue={competencesTexte} placeholder="Compétences (séparées par une virgule)" className="champ" />
            <p className="mt-1 text-xs text-encre/50">Ex : Développement web, Comptabilité, Prise de parole en public</p>
          </div>
        </section>

        <section className="space-y-2 border-t border-black/10 pt-4">
          <h2 className="font-semibold text-encre">Ce que je rends public</h2>
          <p className="text-xs text-encre/60">Nom, prénom et filière sont toujours visibles. Le reste est ton choix.</p>

          {[
            ['show_photo', 'Photo de profil', privacy?.show_photo],
            ['show_ecole', 'École', privacy?.show_ecole],
            ['show_niveau_etude', "Niveau d'étude", privacy?.show_niveau_etude],
            ['show_village', 'Village', privacy?.show_village],
            ['show_cv', 'CV', privacy?.show_cv],
            ['show_competences', 'Compétences', privacy?.show_competences],
            ['show_reseaux_sociaux', 'Réseaux sociaux', privacy?.show_reseaux_sociaux],
            ['show_contact', 'Coordonnées de contact', privacy?.show_contact],
          ].map(([name, label, checked]) => (
            <label key={name as string} className="flex items-center gap-2 text-sm text-encre/85">
              <input type="checkbox" name={name as string} defaultChecked={!!checked} className="accent-primaire" />
              {label}
            </label>
          ))}

          <label className="flex items-center gap-2 pt-2 text-sm text-encre/85">
            <input type="checkbox" name="allow_messages" defaultChecked={profile?.allow_messages ?? true} className="accent-primaire" />
            Autoriser les autres membres à m'envoyer un message privé
          </label>
        </section>

        <button type="submit" className="bouton bouton-primaire w-full">
          Enregistrer
        </button>
      </form>
    </div>
  )
}