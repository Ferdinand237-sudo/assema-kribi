'use server'

import { requireModuleManager } from '@/lib/auth/guards'
import { revalidatePath } from 'next/cache'

export async function creerAlbum(formData: FormData) {
  const { supabase } = await requireModuleManager('galerie')

  const nom = formData.get('nom') as string
  const description = formData.get('description') as string

  await supabase.from('galerie_albums').insert({ nom, description })
  revalidatePath('/gestion/galerie')
}

export async function modifierAlbum(formData: FormData) {
  const { supabase } = await requireModuleManager('galerie')
  const id = formData.get('id') as string
  const nom = formData.get('nom') as string
  const description = formData.get('description') as string

  await supabase.from('galerie_albums').update({ nom, description }).eq('id', id)
  revalidatePath('/gestion/galerie')
  revalidatePath('/galerie')
  revalidatePath(`/galerie/${id}`)
}

export async function supprimerAlbum(formData: FormData) {
  const { supabase } = await requireModuleManager('galerie')
  const id = formData.get('id') as string
  await supabase.from('galerie_albums').delete().eq('id', id)
  revalidatePath('/gestion/galerie')
  revalidatePath('/galerie')
}

export async function ajouterMedias(formData: FormData) {
  const { supabase } = await requireModuleManager('galerie')

  const albumId = formData.get('albumId') as string
  const fichiers = formData.getAll('medias') as File[]

  for (const fichier of fichiers) {
    if (!fichier || fichier.size === 0) continue

    const type = fichier.type.startsWith('video') ? 'video' : 'photo'
    const extension = fichier.name.split('.').pop()
    const nomFichier = `${crypto.randomUUID()}.${extension}`
    const chemin = `${albumId}/${nomFichier}`

    const { error: erreurUpload } = await supabase.storage
      .from('galerie-media')
      .upload(chemin, fichier, { contentType: fichier.type })

    if (!erreurUpload) {
      const { data: url } = supabase.storage.from('galerie-media').getPublicUrl(chemin)
      await supabase.from('galerie_medias').insert({ album_id: albumId, url: url.publicUrl, type })
    }
  }

  revalidatePath('/gestion/galerie')
  revalidatePath('/galerie')
}

export async function supprimerMedia(formData: FormData) {
  const { supabase } = await requireModuleManager('galerie')
  const id = formData.get('id') as string
  await supabase.from('galerie_medias').delete().eq('id', id)
  revalidatePath('/gestion/galerie')
  revalidatePath('/galerie')
}