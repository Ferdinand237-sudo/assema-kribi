'use server'

import { requireAdmin, requireAdminOuPresident } from '@/lib/auth/guards'
import { revalidatePath } from 'next/cache'

export async function changerRole(formData: FormData) {
  const profileId = formData.get('profileId') as string
  const nouveauRole = formData.get('role') as string

  // Seul un admin peut attribuer les rôles président ou admin
  if (nouveauRole === 'president' || nouveauRole === 'admin') {
    const { supabase } = await requireAdmin()
    await supabase.from('profiles').update({ role: nouveauRole }).eq('id', profileId)
  } else {
    const { supabase } = await requireAdminOuPresident()
    await supabase.from('profiles').update({ role: nouveauRole }).eq('id', profileId)
  }

  revalidatePath('/admin/membres')
}

export async function changerPosteBureau(formData: FormData) {
  const { supabase } = await requireAdminOuPresident()
  const profileId = formData.get('profileId') as string
  const poste = formData.get('poste') as string
  await supabase.from('profiles').update({ poste_bureau: poste || null }).eq('id', profileId)
  revalidatePath('/admin/membres')
}