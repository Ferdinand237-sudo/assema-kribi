import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { mettreAJourProfil, uploaderPhoto, uploaderCV } from './actions'
import ZoomableImage from '@/components/zoomable-image'
import BoutonEnvoi from '@/components/bouton-envoi'

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
  const reseaux = (profile?.reseaux_sociaux ?? {}) as Record<string, string>

  const CHAMP = 'mb-1 block text-xs font-medium text-encre/70'

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
            <div>
              <label htmlFor="firstName" className={CHAMP}>Prénom</label>
              <input id="firstName" name="firstName" defaultValue={profile?.first_name ?? ''} placeholder="Prénom" required className="champ" />
            </div>
            <div>
              <label htmlFor="lastName" className={CHAMP}>Nom</label>
              <input id="lastName" name="lastName" defaultValue={profile?.last_name ?? ''} placeholder="Nom" required className="champ" />
            </div>
          </div>
          <div>
            <label htmlFor="filiere" className={CHAMP}>Filière</label>
            <input id="filiere" name="filiere" defaultValue={profile?.filiere ?? ''} placeholder="ex : Génie Numérique" required className="champ" />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="niveauEtude" className={CHAMP}>Niveau d'étude</label>
              <input id="niveauEtude" name="niveauEtude" defaultValue={profile?.niveau_etude ?? ''} placeholder="ex : Terminale" className="champ" />
            </div>
            <div>
              <label htmlFor="village" className={CHAMP}>Village d'origine</label>
              <input id="village" name="village" defaultValue={profile?.village ?? ''} placeholder="ex : Grand Batanga" className="champ" />
            </div>
          </div>
          <div>
            <label htmlFor="ecole" className={CHAMP}>École</label>
            <input id="ecole" name="ecole" defaultValue={profile?.ecole ?? ''} placeholder="Établissement fréquenté" className="champ" />
          </div>
          <div>
            <label htmlFor="telephone" className={CHAMP}>Téléphone</label>
            <input id="telephone" name="telephone" defaultValue={profile?.telephone ?? ''} placeholder="ex : 6XX XXX XXX" className="champ" />
          </div>
          <div>
            <label htmlFor="bio" className={CHAMP}>Bio courte</label>
            <textarea id="bio" name="bio" defaultValue={profile?.bio ?? ''} placeholder="Quelques mots pour te présenter" rows={3} className="champ" />
          </div>
          <div>
            <label htmlFor="competences" className={CHAMP}>Compétences</label>
            <input id="competences" name="competences" defaultValue={competencesTexte} placeholder="séparées par une virgule" className="champ" />
            <p className="mt-1 text-xs text-encre/50">Ex : Développement web, Comptabilité, Prise de parole en public</p>
          </div>
        </section>

        <section className="space-y-3 border-t border-black/10 pt-4">
          <h2 className="font-semibold text-encre">Réseaux sociaux & contact</h2>
          <p className="text-xs text-encre/60">Facultatif. Réglés par le même choix de visibilité que les réseaux sociaux ci-dessous.</p>
          <div>
            <label htmlFor="facebook" className={CHAMP}>Facebook</label>
            <input id="facebook" name="facebook" type="url" defaultValue={reseaux.facebook ?? ''} placeholder="https://facebook.com/..." className="champ" />
          </div>
          <div>
            <label htmlFor="linkedin" className={CHAMP}>LinkedIn</label>
            <input id="linkedin" name="linkedin" type="url" defaultValue={reseaux.linkedin ?? ''} placeholder="https://linkedin.com/in/..." className="champ" />
          </div>
          <div>
            <label htmlFor="x" className={CHAMP}>X (Twitter)</label>
            <input id="x" name="x" type="url" defaultValue={reseaux.x ?? ''} placeholder="https://x.com/..." className="champ" />
          </div>
          <div>
            <label htmlFor="email_public" className={CHAMP}>Email de contact</label>
            <input id="email_public" name="email_public" type="email" defaultValue={reseaux.email ?? ''} placeholder="contact@exemple.com" className="champ" />
          </div>
          <div>
            <label htmlFor="whatsapp" className={CHAMP}>Numéro WhatsApp</label>
            <input id="whatsapp" name="whatsapp" defaultValue={reseaux.whatsapp ?? ''} placeholder="ex : 237 6XX XXX XXX" className="champ" />
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
            ['show_reseaux_sociaux', 'Réseaux sociaux & contact (Facebook, LinkedIn, X, email, WhatsApp)', privacy?.show_reseaux_sociaux],
            ['show_contact', 'Numéro de téléphone', privacy?.show_contact],
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

        <BoutonEnvoi className="bouton bouton-primaire w-full" texteEnvoi="Enregistrement...">Enregistrer</BoutonEnvoi>
      </form>
    </div>
  )
}