'use server'

import { requireModuleManager } from '@/lib/auth/guards'
import { revalidatePath } from 'next/cache'

export async function epinglerTalent(formData: FormData) {
  const { supabase, profile } = await requireModuleManager('talents')

  const profileId = formData.get('profileId') as string
  const { count } = await supabase.from('talents_mis_en_avant').select('id', { count: 'exact', head: true })

  await supabase.from('talents_mis_en_avant').insert({
    profile_id: profileId,
    ordre: count ?? 0,
    assigned_by: profile.id,
  })

  revalidatePath('/gestion/talents')
  revalidatePath('/')
}

export async function retirerTalent(formData: FormData) {
  const { supabase } = await requireModuleManager('talents')
  const id = formData.get('id') as string
  await supabase.from('talents_mis_en_avant').delete().eq('id', id)
  revalidatePath('/gestion/talents')
  revalidatePath('/')
}

export async function deplacerTalent(formData: FormData) {
  const { supabase } = await requireModuleManager('talents')
  const id = formData.get('id') as string
  const idVoisin = formData.get('idVoisin') as string

  const [{ data: a }, { data: b }] = await Promise.all([
    supabase.from('talents_mis_en_avant').select('ordre').eq('id', id).single(),
    supabase.from('talents_mis_en_avant').select('ordre').eq('id', idVoisin).single(),
  ])

  if (a && b) {
    await supabase.from('talents_mis_en_avant').update({ ordre: b.ordre }).eq('id', id)
    await supabase.from('talents_mis_en_avant').update({ ordre: a.ordre }).eq('id', idVoisin)
  }

  revalidatePath('/gestion/talents')
  revalidatePath('/')
}