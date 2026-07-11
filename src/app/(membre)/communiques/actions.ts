'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function marquerCommuniqueLu(formData: FormData) {
  const supabase = await createClient()
  const destinataireId = formData.get('destinataireId') as string

  await supabase
    .from('communique_destinataires')
    .update({ read: true, read_at: new Date().toISOString() })
    .eq('id', destinataireId)

  revalidatePath('/communiques')
}