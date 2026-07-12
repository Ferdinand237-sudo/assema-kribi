'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function mettreAJourProfil(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const competences = (formData.get('competences') as string)
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean)

  // Infos du profil
  const { error: erreurProfil } = await supabase
    .from('profiles')
    .update({
      first_name: formData.get('firstName') as string,
      last_name: formData.get('lastName') as string,
      filiere: formData.get('filiere') as string,
      niveau_etude: formData.get('niveauEtude') as string,
      village: formData.get('village') as string,
      ecole: formData.get('ecole') as string,
      bio: formData.get('bio') as string,
      telephone: formData.get('telephone') as string,
      competences: competences.length > 0 ? competences : null,
      allow_messages: formData.get('allow_messages') === 'on',
    })
    .eq('id', user.id)

  if (erreurProfil) {
    redirect(`/profil?erreur=${encodeURIComponent(erreurProfil.message)}`)
  }

  // Réglages de confidentialité
  const { error: erreurPrivacy } = await supabase
    .from('profile_privacy')
    .update({
      show_photo: formData.get('show_photo') === 'on',
      show_ecole: formData.get('show_ecole') === 'on',
      show_niveau_etude: formData.get('show_niveau_etude') === 'on',
      show_village: formData.get('show_village') === 'on',
      show_cv: formData.get('show_cv') === 'on',
      show_competences: formData.get('show_competences') === 'on',
      show_reseaux_sociaux: formData.get('show_reseaux_sociaux') === 'on',
      show_contact: formData.get('show_contact') === 'on',
    })
    .eq('profile_id', user.id)

  if (erreurPrivacy) {
    redirect(`/profil?erreur=${encodeURIComponent(erreurPrivacy.message)}`)
  }

  redirect('/profil?succes=1')
}

export async function uploaderPhoto(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const fichier = formData.get('photo') as File
  if (!fichier || fichier.size === 0) {
    redirect('/profil?erreur=Choisis+une+photo')
  }

  const extension = fichier.name.split('.').pop()
  const chemin = `${user.id}/avatar.${extension}`

  const { error: erreurUpload } = await supabase.storage
    .from('avatars')
    .upload(chemin, fichier, { upsert: true, contentType: fichier.type })

  if (erreurUpload) {
    redirect(`/profil?erreur=${encodeURIComponent(erreurUpload.message)}`)
  }

  const { data: urlPublique } = supabase.storage.from('avatars').getPublicUrl(chemin)

  await supabase.from('profiles').update({ avatar_url: urlPublique.publicUrl }).eq('id', user.id)

  revalidatePath('/profil')
  redirect('/profil?succes=1')
}

export async function uploaderCV(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const fichier = formData.get('cv') as File
  if (!fichier || fichier.size === 0) {
    redirect('/profil?erreur=Choisis+un+CV')
  }

  const chemin = `${user.id}/cv.pdf`

  const { error: erreurUpload } = await supabase.storage
    .from('cvs')
    .upload(chemin, fichier, { upsert: true, contentType: fichier.type })

  if (erreurUpload) {
    redirect(`/profil?erreur=${encodeURIComponent(erreurUpload.message)}`)
  }

  // Bucket privé : on stocke le chemin, pas une URL publique
  await supabase.from('profiles').update({ cv_url: chemin }).eq('id', user.id)

  revalidatePath('/profil')
  redirect('/profil?succes=1')
}