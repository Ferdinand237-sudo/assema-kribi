'use server'

import { requireAdmin, requireAdminOuPresident } from '@/lib/auth/guards'
import { revalidatePath } from 'next/cache'

export async function mettreAJourAPropos(formData: FormData) {
  const { supabase, profile } = await requireAdminOuPresident()

  const contenu = {
    histoire: formData.get('histoire') as string,
    vision: formData.get('vision') as string,
    missions: formData.get('missions') as string,
    objectifs: formData.get('objectifs') as string,
    valeurs: formData.get('valeurs') as string,
  }

  await supabase
    .from('pages_contenu')
    .update({ contenu, updated_by: profile.id, updated_at: new Date().toISOString() })
    .eq('slug', 'a-propos')

  revalidatePath('/admin/contenu-pages')
  revalidatePath('/a-propos')
}

export async function mettreAJourContact(formData: FormData) {
  const { supabase, profile } = await requireAdminOuPresident()

  const contenu = {
    adresse: formData.get('adresse') as string,
    reseaux_sociaux: formData.get('reseaux_sociaux') as string,
    intro: formData.get('intro') as string,
  }

  await supabase
    .from('pages_contenu')
    .update({ contenu, updated_by: profile.id, updated_at: new Date().toISOString() })
    .eq('slug', 'contact')

  revalidatePath('/admin/contenu-pages')
  revalidatePath('/contact')
}