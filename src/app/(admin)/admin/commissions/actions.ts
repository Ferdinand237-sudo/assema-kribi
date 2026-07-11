'use server'

import { requireAdminOuPresident } from '@/lib/auth/guards'
import { revalidatePath } from 'next/cache'

export async function creerCommission(formData: FormData) {
  const { supabase, profile } = await requireAdminOuPresident()

  const nom = formData.get('nom') as string
  const description = formData.get('description') as string

  await supabase.from('commissions').insert({ nom, description, created_by: profile.id })
  revalidatePath('/admin/commissions')
}

export async function ajouterMembreCommission(formData: FormData) {
  const { supabase } = await requireAdminOuPresident()

  const commissionId = formData.get('commissionId') as string
  const profileId = formData.get('profileId') as string
  const roleCommission = formData.get('roleCommission') as string

  await supabase.from('commission_members').insert({
    commission_id: commissionId,
    profile_id: profileId,
    role_commission: roleCommission,
  })
  revalidatePath('/admin/commissions')
}

export async function retirerMembreCommission(formData: FormData) {
  const { supabase } = await requireAdminOuPresident()
  const id = formData.get('id') as string
  await supabase.from('commission_members').delete().eq('id', id)
  revalidatePath('/admin/commissions')
}