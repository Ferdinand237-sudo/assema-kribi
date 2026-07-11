'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function envoyerMessageContact(formData: FormData) {
  const supabase = await createClient()

  const nom = formData.get('nom') as string
  const email = formData.get('email') as string
  const sujet = formData.get('sujet') as string
  const message = formData.get('message') as string

  const { error } = await supabase.from('contact_messages').insert({ nom, email, sujet, message })

  if (error) {
    redirect(`/contact?erreur=1`)
  }

  redirect('/contact?succes=1')
}