'use server'

import { requireAdminOuPresident } from '@/lib/auth/guards'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function creerCommission(formData: FormData) {
  const { supabase, profile } = await requireAdminOuPresident()

  const nom = formData.get('nom') as string
  const description = formData.get('description') as string

  await supabase.from('commissions').insert({ nom, description, created_by: profile.id })
  revalidatePath('/admin/commissions')
}

export async function modifierCommission(formData: FormData) {
  const { supabase } = await requireAdminOuPresident()

  const id = formData.get('id') as string
  const nom = formData.get('nom') as string
  const description = formData.get('description') as string

  await supabase.from('commissions').update({ nom, description }).eq('id', id)
  revalidatePath('/admin/commissions')
}

export async function supprimerCommission(formData: FormData) {
  const { supabase } = await requireAdminOuPresident()
  const id = formData.get('id') as string

  // Une commission liée à des articles ou des membres ne peut pas être supprimée silencieusement :
  // la suppression est en cascade côté base pour les articles, ce qui effacerait leur historique.
  const [{ count: nbArticles }, { count: nbMembres }] = await Promise.all([
    supabase.from('articles').select('id', { count: 'exact', head: true }).eq('commission_id', id),
    supabase.from('commission_members').select('id', { count: 'exact', head: true }).eq('commission_id', id),
  ])

  if ((nbArticles ?? 0) > 0 || (nbMembres ?? 0) > 0) {
    redirect(`/admin/commissions?erreur=${encodeURIComponent("Retire d'abord tous les membres et les articles liés à cette commission avant de la supprimer.")}`)
  }

  await supabase.from('commissions').delete().eq('id', id)
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