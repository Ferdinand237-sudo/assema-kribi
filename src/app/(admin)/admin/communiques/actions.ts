'use server'

import { requireAdminOuPresident } from '@/lib/auth/guards'
import { revalidatePath } from 'next/cache'

async function calculerDestinataires(
  supabase: any,
  critereNiveau: string | null,
  critereFiliere: string | null,
  critereCommissionId: string | null
): Promise<string[]> {
  let query = supabase.from('profiles').select('id')
  if (critereNiveau) query = query.eq('niveau_etude', critereNiveau)
  if (critereFiliere) query = query.ilike('filiere', `%${critereFiliere}%`)

  const { data: profilsBase } = await query
  let ids: Set<string> = new Set((profilsBase ?? []).map((p: { id: string }) => p.id))

  if (critereCommissionId) {
    const { data: membres } = await supabase
      .from('commission_members')
      .select('profile_id')
      .eq('commission_id', critereCommissionId)
    const idsCommission: Set<string> = new Set((membres ?? []).map((m: { profile_id: string }) => m.profile_id))
    ids = new Set(Array.from(ids).filter((id) => idsCommission.has(id)))
  }

  return Array.from(ids)
}

export async function creerCommunique(formData: FormData) {
  const { supabase, profile } = await requireAdminOuPresident()

  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const canalPublic = formData.get('canal_public') === 'on'
  const canalBureau = formData.get('canal_bureau') === 'on'
  const canalCommissionId = (formData.get('canal_commission_id') as string) || null
  const canalGroupeCible = formData.get('canal_groupe_cible') === 'on'

  const critereNiveau = (formData.get('critere_niveau') as string) || null
  const critereFiliere = (formData.get('critere_filiere') as string) || null
  const critereCommissionId = (formData.get('critere_commission_id') as string) || null

  const criteres = canalGroupeCible
    ? { niveau_etude: critereNiveau, filiere: critereFiliere, commission_id: critereCommissionId }
    : null

  const { data: communique, error } = await supabase
    .from('communiques')
    .insert({
      author_id: profile.id,
      title,
      content,
      canal_public: canalPublic,
      canal_bureau: canalBureau,
      canal_commission_id: canalCommissionId,
      canal_groupe_cible: canalGroupeCible,
      criteres_ciblage: criteres,
    })
    .select('id')
    .single()

  if (error || !communique) {
    revalidatePath('/admin/communiques')
    return
  }

  if (canalGroupeCible) {
    const profilIds = await calculerDestinataires(supabase, critereNiveau, critereFiliere, critereCommissionId)

    if (profilIds.length > 0) {
      const lignes = profilIds.map((profile_id) => ({ communique_id: communique.id, profile_id }))
      await supabase.from('communique_destinataires').insert(lignes)
    }
  }

  revalidatePath('/admin/communiques')
  revalidatePath('/communiques')
  revalidatePath('/')
}