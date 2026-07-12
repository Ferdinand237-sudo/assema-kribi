'use server'

import { requireRedacteur } from '@/lib/auth/guards'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function creerArticle(formData: FormData) {
  const { supabase, profile } = await requireRedacteur()

  const categorie = formData.get('categorie') as string
  const commissionId = (formData.get('commissionId') as string) || null
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const action = formData.get('_action') as string

  const status = action === 'publier_directement' ? 'published' : action === 'soumettre' ? 'pending' : 'draft'

  await supabase.from('articles').insert({
    categorie,
    commission_id: categorie === 'commission' ? commissionId : null,
    author_id: profile.id,
    title,
    content,
    status,
    published_at: status === 'published' ? new Date().toISOString() : null,
    validated_by: status === 'published' ? profile.id : null,
    validated_at: status === 'published' ? new Date().toISOString() : null,
  })

  revalidatePath('/redaction')
  revalidatePath('/admin/articles')
  redirect('/redaction')
}

export async function modifierArticle(formData: FormData) {
  const { supabase, profile } = await requireRedacteur()

  const articleId = formData.get('articleId') as string
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const action = formData.get('_action') as string

  const status = action === 'publier_directement' ? 'published' : action === 'soumettre' ? 'pending' : 'draft'

  const misAJour: Record<string, unknown> = { title, content, status, rejection_reason: null }
  if (status === 'published') {
    misAJour.published_at = new Date().toISOString()
    misAJour.validated_by = profile.id
    misAJour.validated_at = new Date().toISOString()
  }

  await supabase
    .from('articles')
    .update(misAJour)
    .eq('id', articleId)
    .eq('author_id', profile.id)

  revalidatePath('/redaction')
  revalidatePath('/admin/articles')
  redirect('/redaction')
}

export async function supprimerArticle(formData: FormData) {
  const { supabase, profile } = await requireRedacteur()

  const articleId = formData.get('articleId') as string

  await supabase
    .from('articles')
    .delete()
    .eq('id', articleId)
    .eq('author_id', profile.id)

  revalidatePath('/redaction')
  revalidatePath('/admin/articles')
}