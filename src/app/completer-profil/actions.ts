'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function completerProfil(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/connexion')
  }

  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const filiere = formData.get('filiere') as string

  const { error } = await supabase
    .from('profiles')
    .update({ first_name: firstName, last_name: lastName, filiere })
    .eq('id', user.id)

  if (error) {
    redirect(`/completer-profil?erreur=${encodeURIComponent(error.message)}`)
  }

  redirect('/')
}