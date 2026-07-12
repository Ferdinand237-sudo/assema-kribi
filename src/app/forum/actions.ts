'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAdminOuPresident } from '@/lib/auth/guards'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function creerCategorie(formData: FormData) {
  const { supabase, profile } = await requireAdminOuPresident()
  const nom = formData.get('nom') as string
  const description = formData.get('description') as string

  await supabase.from('forum_categories').insert({ nom, description, created_by: profile.id })
  revalidatePath('/forum')
}

export async function creerSujet(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const categoryId = formData.get('categoryId') as string
  const title = formData.get('title') as string
  const premierMessage = formData.get('content') as string

  const { data: sujet, error } = await supabase
    .from('forum_topics')
    .insert({ category_id: categoryId, author_id: user.id, title })
    .select('id')
    .single()

  if (error || !sujet) {
    redirect(`/forum/${categoryId}?erreur=1`)
  }

  await supabase.from('forum_posts').insert({
    topic_id: sujet!.id,
    author_id: user.id,
    content: premierMessage,
  })

  revalidatePath(`/forum/${categoryId}`)
  redirect(`/forum/${categoryId}/${sujet!.id}`)
}

export async function repondreSujet(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const topicId = formData.get('topicId') as string
  const categoryId = formData.get('categoryId') as string
  const content = formData.get('content') as string
  const replyToId = (formData.get('replyToId') as string) || null

  await supabase.from('forum_posts').insert({ topic_id: topicId, author_id: user.id, content, reply_to_id: replyToId })

  revalidatePath(`/forum/${categoryId}/${topicId}`)
  redirect(`/forum/${categoryId}/${topicId}`)
}