'use server'

import { requireAdminOuPresident } from '@/lib/auth/guards'
import { revalidatePath } from 'next/cache'

export async function validerArticle(formData: FormData) {
  const { supabase, profile } = await requireAdminOuPresident()
  const articleId = formData.get('articleId') as string

  await supabase
    .from('articles')
    .update({
      status: 'published',
      validated_by: profile.id,
      validated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    })
    .eq('id', articleId)

  revalidatePath('/admin/articles')
}

export async function rejeterArticle(formData: FormData) {
  const { supabase, profile } = await requireAdminOuPresident()
  const articleId = formData.get('articleId') as string
  const raison = formData.get('raison') as string

  await supabase
    .from('articles')
    .update({
      status: 'rejected',
      validated_by: profile.id,
      validated_at: new Date().toISOString(),
      rejection_reason: raison,
    })
    .eq('id', articleId)

  revalidatePath('/admin/articles')
}