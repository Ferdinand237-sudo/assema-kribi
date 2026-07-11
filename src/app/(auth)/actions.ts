'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function inscrire(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const filiere = formData.get('filiere') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { first_name: firstName, last_name: lastName, filiere },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    redirect(`/inscription?erreur=${encodeURIComponent(error.message)}`)
  }

  redirect('/inscription/confirmation')
}

export async function connecter(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    redirect(`/connexion?erreur=${encodeURIComponent(error.message)}`)
  }

  redirect('/')
}

export async function connecterAvecGoogle() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error || !data.url) {
    redirect('/connexion?erreur=google')
  }

  redirect(data.url)
}

export async function deconnecter() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/connexion')
}