'use server'

import { requireAdminOuPresident } from '@/lib/auth/guards'
import { revalidatePath } from 'next/cache'

export async function assignerGestionnaire(formData: FormData) {
  const { supabase, profile } = await requireAdminOuPresident()

  const module = formData.get('module') as string
  const profileId = formData.get('profileId') as string

  await supabase.from('gestionnaires_module').insert({
    module,
    profile_id: profileId,
    assigned_by: profile.id,
  })

  revalidatePath('/admin/delegations')
}

export async function retirerGestionnaire(formData: FormData) {
  const { supabase } = await requireAdminOuPresident()
  const id = formData.get('id') as string
  await supabase.from('gestionnaires_module').delete().eq('id', id)
  revalidatePath('/admin/delegations')
}