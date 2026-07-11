'use server'

import { requireModuleManager } from '@/lib/auth/guards'
import { revalidatePath } from 'next/cache'

export async function creerFigure(formData: FormData) {
  const { supabase, profile } = await requireModuleManager('culture_figures')

  const nom = formData.get('nom') as string
  const biographie = formData.get('biographie') as string
  const dateNaissance = formData.get('dateNaissance') as string
  const dateDeces = formData.get('dateDeces') as string
  const vivant = formData.get('vivant') === 'on'
  const village = formData.get('village') as string
  const photo = formData.get('photo') as File

  const { data: figure, error } = await supabase
    .from('figures_mabi')
    .insert({
      nom,
      biographie,
      date_naissance: dateNaissance || null,
      date_deces: !vivant && dateDeces ? dateDeces : null,
      vivant,
      village: village || null,
      created_by: profile.id,
    })
    .select('id')
    .single()

  if (error || !figure) {
    revalidatePath('/gestion/figures-mabi')
    return
  }

  if (photo && photo.size > 0) {
    const extension = photo.name.split('.').pop()
    const chemin = `figures/${figure.id}.${extension}`
    const { error: erreurUpload } = await supabase.storage
      .from('culture-mabi-media')
      .upload(chemin, photo, { upsert: true, contentType: photo.type })

    if (!erreurUpload) {
      const { data: url } = supabase.storage.from('culture-mabi-media').getPublicUrl(chemin)
      await supabase.from('figures_mabi').update({ photo_url: url.publicUrl }).eq('id', figure.id)
    }
  }

  revalidatePath('/gestion/figures-mabi')
  revalidatePath('/culture-mabi/figures')
}

export async function supprimerFigure(formData: FormData) {
  const { supabase } = await requireModuleManager('culture_figures')
  const id = formData.get('id') as string
  await supabase.from('figures_mabi').delete().eq('id', id)
  revalidatePath('/gestion/figures-mabi')
  revalidatePath('/culture-mabi/figures')
}