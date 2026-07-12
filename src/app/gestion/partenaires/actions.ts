'use server'

import { requireModuleManager } from '@/lib/auth/guards'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function creerPartenaire(formData: FormData) {
  const { supabase } = await requireModuleManager('partenaires')

  const nom = formData.get('nom') as string
  const description = formData.get('description') as string
  const lien = formData.get('lien') as string
  const logo = formData.get('logo') as File

  const { data: partenaire, error } = await supabase
    .from('partenaires')
    .insert({ nom, description, lien: lien || null })
    .select('id')
    .single()

  if (error || !partenaire) {
    revalidatePath('/gestion/partenaires')
    return
  }

  if (logo && logo.size > 0) {
    const extension = logo.name.split('.').pop()
    const chemin = `logos/${partenaire.id}.${extension}`
    const { error: erreurUpload } = await supabase.storage
      .from('partenaires-media')
      .upload(chemin, logo, { upsert: true, contentType: logo.type })

    if (!erreurUpload) {
      const { data: url } = supabase.storage.from('partenaires-media').getPublicUrl(chemin)
      await supabase.from('partenaires').update({ logo_url: url.publicUrl }).eq('id', partenaire.id)
    }
  }

  revalidatePath('/gestion/partenaires')
  revalidatePath('/partenaires')
}

export async function modifierPartenaire(formData: FormData) {
  const { supabase } = await requireModuleManager('partenaires')

  const id = formData.get('id') as string
  const nom = formData.get('nom') as string
  const description = formData.get('description') as string
  const lien = formData.get('lien') as string
  const logo = formData.get('logo') as File

  await supabase.from('partenaires').update({ nom, description, lien: lien || null }).eq('id', id)

  if (logo && logo.size > 0) {
    const extension = logo.name.split('.').pop()
    const chemin = `logos/${id}.${extension}`
    const { error: erreurUpload } = await supabase.storage
      .from('partenaires-media')
      .upload(chemin, logo, { upsert: true, contentType: logo.type })

    if (!erreurUpload) {
      const { data: url } = supabase.storage.from('partenaires-media').getPublicUrl(chemin)
      await supabase.from('partenaires').update({ logo_url: url.publicUrl }).eq('id', id)
    }
  }

  revalidatePath('/gestion/partenaires')
  revalidatePath('/partenaires')
  redirect('/gestion/partenaires')
}

export async function supprimerPartenaire(formData: FormData) {
  const { supabase } = await requireModuleManager('partenaires')
  const id = formData.get('id') as string
  await supabase.from('partenaires').delete().eq('id', id)
  revalidatePath('/gestion/partenaires')
  revalidatePath('/partenaires')
}

export async function creerAnnonce(formData: FormData) {
  const { supabase, profile } = await requireModuleManager('partenaires')

  const partenaireId = formData.get('partenaireId') as string
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const image = formData.get('image') as File
  const publierMaintenant = formData.get('publier') === 'on'

  const { data: annonce, error } = await supabase
    .from('annonces_partenaires')
    .insert({
      partenaire_id: partenaireId,
      author_id: profile.id,
      title,
      content,
      status: publierMaintenant ? 'published' : 'draft',
      published_at: publierMaintenant ? new Date().toISOString() : null,
    })
    .select('id')
    .single()

  if (error || !annonce) {
    revalidatePath('/gestion/partenaires')
    return
  }

  if (image && image.size > 0) {
    const extension = image.name.split('.').pop()
    const chemin = `annonces/${annonce.id}.${extension}`
    const { error: erreurUpload } = await supabase.storage
      .from('partenaires-media')
      .upload(chemin, image, { upsert: true, contentType: image.type })

    if (!erreurUpload) {
      const { data: url } = supabase.storage.from('partenaires-media').getPublicUrl(chemin)
      await supabase.from('annonces_partenaires').update({ image_url: url.publicUrl }).eq('id', annonce.id)
    }
  }

  revalidatePath('/gestion/partenaires')
  revalidatePath('/partenaires')
}

export async function modifierAnnonce(formData: FormData) {
  const { supabase } = await requireModuleManager('partenaires')

  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const image = formData.get('image') as File

  await supabase.from('annonces_partenaires').update({ title, content }).eq('id', id)

  if (image && image.size > 0) {
    const extension = image.name.split('.').pop()
    const chemin = `annonces/${id}.${extension}`
    const { error: erreurUpload } = await supabase.storage
      .from('partenaires-media')
      .upload(chemin, image, { upsert: true, contentType: image.type })

    if (!erreurUpload) {
      const { data: url } = supabase.storage.from('partenaires-media').getPublicUrl(chemin)
      await supabase.from('annonces_partenaires').update({ image_url: url.publicUrl }).eq('id', id)
    }
  }

  revalidatePath('/gestion/partenaires')
  revalidatePath('/partenaires')
  revalidatePath(`/partenaires/annonces/${id}`)
  redirect('/gestion/partenaires')
}

export async function togglePublicationAnnonce(formData: FormData) {
  const { supabase } = await requireModuleManager('partenaires')
  const id = formData.get('id') as string
  const nouveauStatut = formData.get('nouveauStatut') as string

  await supabase
    .from('annonces_partenaires')
    .update({
      status: nouveauStatut,
      published_at: nouveauStatut === 'published' ? new Date().toISOString() : null,
    })
    .eq('id', id)

  revalidatePath('/gestion/partenaires')
  revalidatePath('/partenaires')
}

export async function supprimerAnnonce(formData: FormData) {
  const { supabase } = await requireModuleManager('partenaires')
  const id = formData.get('id') as string
  await supabase.from('annonces_partenaires').delete().eq('id', id)
  revalidatePath('/gestion/partenaires')
  revalidatePath('/partenaires')
}