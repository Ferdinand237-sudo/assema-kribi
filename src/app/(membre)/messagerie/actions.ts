'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function envoyerMessage(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const receiverId = formData.get('receiverId') as string
  const content = formData.get('content') as string

  const { data: destinataire } = await supabase
    .from('profiles')
    .select('allow_messages')
    .eq('id', receiverId)
    .single()

  if (!destinataire?.allow_messages) {
    redirect(`/messagerie/${receiverId}?erreur=refuse`)
  }

  await supabase.from('messages').insert({
    sender_id: user.id,
    receiver_id: receiverId,
    content,
  })

  revalidatePath(`/messagerie/${receiverId}`)
  revalidatePath('/messagerie')
  redirect(`/messagerie/${receiverId}`)
}