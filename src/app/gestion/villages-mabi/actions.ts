'use server'

import { requireModuleManager } from '@/lib/auth/guards'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function creerVillage(formData: FormData) {
  const { supabase, profile } = await requireModuleManager('culture_villages')

  const nom = formData.get('nom') as string
  const description = formData.get('description') as string
  const histoire = formData.get('histoire') as string
  const populationEstimee = formData.get('populationEstimee') as string
  const chefNom = formData.get('chefNom') as string
  const chefBio = formData.get('chefBio') as string
  const chefPhoto = formData.get('chefPhoto') as File
  const latitude = formData.get('latitude') as string
  const longitude = formData.get('longitude') as string

  const { data: village, error } = await supabase
    .from('villages_mabi')
    .insert({
      nom,
      description,
      histoire,
      population_estimee: populationEstimee ? parseInt(populationEstimee, 10) : null,
      chef_nom: chefNom || null,
      chef_bio: chefBio || null,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      created_by: profile.id,
    })
    .select('id')
    .single()

  if (error || !village) {
    revalidatePath('/gestion/villages-mabi')
    return
  }

  if (chefPhoto && chefPhoto.size > 0) {
    const extension = chefPhoto.name.split('.').pop()
    const chemin = `villages/${village.id}/chef.${extension}`
    const { error: erreurUpload } = await supabase.storage
      .from('culture-mabi-media')
      .upload(chemin, chefPhoto, { upsert: true, contentType: chefPhoto.type })

    if (!erreurUpload) {
      const { data: url } = supabase.storage.from('culture-mabi-media').getPublicUrl(chemin)
      await supabase.from('villages_mabi').update({ chef_photo_url: url.publicUrl }).eq('id', village.id)
    }
  }

  revalidatePath('/gestion/villages-mabi')
  revalidatePath('/culture-mabi/villages')
}

export async function modifierVillage(formData: FormData) {
  const { supabase } = await requireModuleManager('culture_villages')

  const id = formData.get('id') as string
  const nom = formData.get('nom') as string
  const description = formData.get('description') as string
  const histoire = formData.get('histoire') as string
  const populationEstimee = formData.get('populationEstimee') as string
  const chefNom = formData.get('chefNom') as string
  const chefBio = formData.get('chefBio') as string
  const chefPhoto = formData.get('chefPhoto') as File
  const latitude = formData.get('latitude') as string
  const longitude = formData.get('longitude') as string

  await supabase
    .from('villages_mabi')
    .update({
      nom,
      description,
      histoire,
      population_estimee: populationEstimee ? parseInt(populationEstimee, 10) : null,
      chef_nom: chefNom || null,
      chef_bio: chefBio || null,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
    })
    .eq('id', id)

  if (chefPhoto && chefPhoto.size > 0) {
    const extension = chefPhoto.name.split('.').pop()
    const chemin = `villages/${id}/chef.${extension}`
    const { error: erreurUpload } = await supabase.storage
      .from('culture-mabi-media')
      .upload(chemin, chefPhoto, { upsert: true, contentType: chefPhoto.type })

    if (!erreurUpload) {
      const { data: url } = supabase.storage.from('culture-mabi-media').getPublicUrl(chemin)
      await supabase.from('villages_mabi').update({ chef_photo_url: url.publicUrl }).eq('id', id)
    }
  }

  revalidatePath('/gestion/villages-mabi')
  revalidatePath('/culture-mabi/villages')
  revalidatePath(`/culture-mabi/villages/${id}`)
  redirect('/gestion/villages-mabi')
}

export async function supprimerVillage(formData: FormData) {
  const { supabase } = await requireModuleManager('culture_villages')
  const id = formData.get('id') as string
  await supabase.from('villages_mabi').delete().eq('id', id)
  revalidatePath('/gestion/villages-mabi')
  revalidatePath('/culture-mabi/villages')
}

export async function ajouterPhotosVillage(formData: FormData) {
  const { supabase } = await requireModuleManager('culture_villages')

  const villageId = formData.get('villageId') as string
  const legende = formData.get('legende') as string
  const fichiers = formData.getAll('photos') as File[]

  for (const fichier of fichiers) {
    if (!fichier || fichier.size === 0) continue

    const extension = fichier.name.split('.').pop()
    const nomFichier = `${crypto.randomUUID()}.${extension}`
    const chemin = `villages/${villageId}/medias/${nomFichier}`

    const { error: erreurUpload } = await supabase.storage
      .from('culture-mabi-media')
      .upload(chemin, fichier, { contentType: fichier.type })

    if (!erreurUpload) {
      const { data: url } = supabase.storage.from('culture-mabi-media').getPublicUrl(chemin)
      await supabase.from('village_medias').insert({ village_id: villageId, url: url.publicUrl, legende: legende || null })
    }
  }

  revalidatePath('/gestion/villages-mabi')
  revalidatePath('/culture-mabi/villages')
}

export async function supprimerPhotoVillage(formData: FormData) {
  const { supabase } = await requireModuleManager('culture_villages')
  const id = formData.get('id') as string
  await supabase.from('village_medias').delete().eq('id', id)
  revalidatePath('/gestion/villages-mabi')
}

export async function ajouterMembreChefferie(formData: FormData) {
  const { supabase } = await requireModuleManager('culture_villages')

  const villageId = formData.get('villageId') as string
  const nom = formData.get('nom') as string
  const fonction = formData.get('fonction') as string
  const bio = formData.get('bio') as string
  const photo = formData.get('photo') as File

  const { data: membre, error } = await supabase
    .from('village_chefferie_membres')
    .insert({ village_id: villageId, nom, fonction: fonction || null, bio: bio || null })
    .select('id')
    .single()

  if (error || !membre) {
    revalidatePath('/gestion/villages-mabi')
    return
  }

  if (photo && photo.size > 0) {
    const extension = photo.name.split('.').pop()
    const chemin = `villages/${villageId}/chefferie/${membre.id}.${extension}`
    const { error: erreurUpload } = await supabase.storage
      .from('culture-mabi-media')
      .upload(chemin, photo, { upsert: true, contentType: photo.type })

    if (!erreurUpload) {
      const { data: url } = supabase.storage.from('culture-mabi-media').getPublicUrl(chemin)
      await supabase.from('village_chefferie_membres').update({ photo_url: url.publicUrl }).eq('id', membre.id)
    }
  }

  revalidatePath('/gestion/villages-mabi')
  revalidatePath('/culture-mabi/villages')
}

export async function supprimerMembreChefferie(formData: FormData) {
  const { supabase } = await requireModuleManager('culture_villages')
  const id = formData.get('id') as string
  await supabase.from('village_chefferie_membres').delete().eq('id', id)
  revalidatePath('/gestion/villages-mabi')
}