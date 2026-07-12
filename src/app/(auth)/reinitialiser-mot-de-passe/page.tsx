import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { definirNouveauMotDePasse } from '../actions'

export default async function PageReinitialiserMotDePasse({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string }>
}) {
  const { erreur } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/mot-de-passe-oublie')

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-md items-center px-6 py-12">
      <div className="w-full">
        <h1 className="mb-2 font-display text-2xl font-semibold text-encre">Nouveau mot de passe</h1>
        <p className="mb-6 text-sm text-encre/60">Choisis le mot de passe que tu veux utiliser pour te connecter avec ton email.</p>

        {erreur && (
          <p className="badge-erreur mb-4 block w-fit rounded-lg px-4 py-3 text-sm">{erreur}</p>
        )}

        <form action={definirNouveauMotDePasse} className="space-y-3">
          <input name="password" type="password" placeholder="Nouveau mot de passe" required minLength={6} className="champ" />
          <button type="submit" className="bouton bouton-primaire w-full">
            Enregistrer
          </button>
        </form>
      </div>
    </div>
  )
}
