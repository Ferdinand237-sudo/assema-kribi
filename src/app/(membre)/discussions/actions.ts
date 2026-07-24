'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function creerForumPrive(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const titre = formData.get('titre') as string
  const participantIds = formData.getAll('participantIds') as string[]

  const { data: forum, error } = await supabase
    .from('forums_prives')
    .insert({ titre, created_by: user.id })
    .select('id')
    .single()

  if (error || !forum) {
    revalidatePath('/discussions')
    return
  }

  const idsUniques = Array.from(new Set(participantIds)).filter((id) => id !== user.id)
  if (idsUniques.length > 0) {
    await supabase
      .from('forum_prive_participants')
      .insert(idsUniques.map((profile_id) => ({ forum_id: forum.id, profile_id })))
  }

  revalidatePath('/discussions')
  redirect(`/discussions/${forum.id}`)
}

export async function envoyerMessagePrive(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const forumId = formData.get('forumId') as string
  const content = formData.get('content') as string

  await supabase.from('forum_prive_messages').insert({ forum_id: forumId, author_id: user.id, content })

  revalidatePath(`/discussions/${forumId}`)
}

export async function ajouterParticipant(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const forumId = formData.get('forumId') as string
  const profileId = formData.get('profileId') as string

  const { data: forum } = await supabase.from('forums_prives').select('created_by').eq('id', forumId).single()
  if (forum?.created_by !== user.id) redirect(`/discussions/${forumId}`)

  await supabase.from('forum_prive_participants').insert({ forum_id: forumId, profile_id: profileId })

  revalidatePath(`/discussions/${forumId}`)
}

export async function retirerParticipant(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const id = formData.get('id') as string
  const forumId = formData.get('forumId') as string

  const { data: forum } = await supabase.from('forums_prives').select('created_by').eq('id', forumId).single()
  if (forum?.created_by !== user.id) redirect(`/discussions/${forumId}`)

  await supabase.from('forum_prive_participants').delete().eq('id', id)

  revalidatePath(`/discussions/${forumId}`)
}
