'use server'

import { requireModuleManager } from '@/lib/auth/guards'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function creerProjet(formData: FormData) {
  const { supabase, profile } = await requireModuleManager('projets')

  const titre = formData.get('titre') as string
  const description = formData.get('description') as string
  const resultats = formData.get('resultats') as string

  const { data: projet, error } = await supabase
    .from('projets')
    .insert({ titre, description, resultats, created_by: profile.id })
    .select('id')
    .single()

  if (error || !projet) {
    revalidatePath('/gestion/projets')
    return
  }

  const fichiers = formData.getAll('medias') as File[]
  for (const fichier of fichiers) {
    if (!fichier || fichier.size === 0) continue

    const type = fichier.type.startsWith('video') ? 'video' : 'photo'
    const extension = fichier.name.split('.').pop()
    const chemin = `${projet.id}/${crypto.randomUUID()}.${extension}`

    const { error: erreurUpload } = await supabase.storage
      .from('projets-media')
      .upload(chemin, fichier, { contentType: fichier.type })

    if (!erreurUpload) {
      const { data: url } = supabase.storage.from('projets-media').getPublicUrl(chemin)
      await supabase.from('projet_medias').insert({ projet_id: projet.id, url: url.publicUrl, type })
    }
  }

  revalidatePath('/gestion/projets')
  revalidatePath('/')
}

export async function ajouterMediasProjet(formData: FormData) {
  const { supabase } = await requireModuleManager('projets')

  const projetId = formData.get('projetId') as string
  const fichiers = formData.getAll('medias') as File[]

  for (const fichier of fichiers) {
    if (!fichier || fichier.size === 0) continue

    const type = fichier.type.startsWith('video') ? 'video' : 'photo'
    const extension = fichier.name.split('.').pop()
    const chemin = `${projetId}/${crypto.randomUUID()}.${extension}`

    const { error: erreurUpload } = await supabase.storage
      .from('projets-media')
      .upload(chemin, fichier, { contentType: fichier.type })

    if (!erreurUpload) {
      const { data: url } = supabase.storage.from('projets-media').getPublicUrl(chemin)
      await supabase.from('projet_medias').insert({ projet_id: projetId, url: url.publicUrl, type })
    }
  }

  revalidatePath('/gestion/projets')
  revalidatePath('/')
}

export async function supprimerMediaProjet(formData: FormData) {
  const { supabase } = await requireModuleManager('projets')
  const id = formData.get('id') as string
  await supabase.from('projet_medias').delete().eq('id', id)
  revalidatePath('/gestion/projets')
}

export async function modifierProjet(formData: FormData) {
  const { supabase } = await requireModuleManager('projets')

  const id = formData.get('id') as string
  const titre = formData.get('titre') as string
  const description = formData.get('description') as string
  const resultats = formData.get('resultats') as string

  await supabase.from('projets').update({ titre, description, resultats }).eq('id', id)

  const fichiers = formData.getAll('medias') as File[]
  for (const fichier of fichiers) {
    if (!fichier || fichier.size === 0) continue

    const type = fichier.type.startsWith('video') ? 'video' : 'photo'
    const extension = fichier.name.split('.').pop()
    const chemin = `${id}/${crypto.randomUUID()}.${extension}`

    const { error: erreurUpload } = await supabase.storage
      .from('projets-media')
      .upload(chemin, fichier, { contentType: fichier.type })

    if (!erreurUpload) {
      const { data: url } = supabase.storage.from('projets-media').getPublicUrl(chemin)
      await supabase.from('projet_medias').insert({ projet_id: id, url: url.publicUrl, type })
    }
  }

  revalidatePath('/gestion/projets')
  revalidatePath('/')
  revalidatePath(`/projets/${id}`)
  redirect('/gestion/projets')
}

export async function supprimerProjet(formData: FormData) {
  const { supabase } = await requireModuleManager('projets')
  const id = formData.get('id') as string
  await supabase.from('projets').delete().eq('id', id)
  revalidatePath('/gestion/projets')
  revalidatePath('/')
}