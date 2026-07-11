import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { completerProfil } from './actions'

export default async function PageCompleterProfil({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string }>
}) {
  const { erreur } = await searchParams
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/connexion')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name, filiere, avatar_url')
    .eq('id', user.id)
    .single()

  return (
    <div className="mx-auto max-w-md px-6 py-12">
      <h1 className="mb-2 text-2xl font-semibold text-encre">Encore une étape 👋</h1>
      <p className="mb-6 text-sm text-encre/70">
        On a récupéré tes infos depuis Google. Complète juste ta filière pour finaliser ton profil ASSEMA.
      </p>

      {erreur && (
        <p className="badge-erreur mb-4 block w-fit rounded-lg px-4 py-3 text-sm">{erreur}</p>
      )}

      {profile?.avatar_url && (
        <img
          src={profile.avatar_url}
          alt="Photo de profil"
          className="mb-4 h-16 w-16 rounded-full object-cover"
        />
      )}

      <form action={completerProfil} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <input
            name="firstName"
            defaultValue={profile?.first_name ?? ''}
            placeholder="Prénom"
            required
            className="champ"
          />
          <input
            name="lastName"
            defaultValue={profile?.last_name ?? ''}
            placeholder="Nom"
            required
            className="champ"
          />
        </div>
        <input
          name="filiere"
          defaultValue={profile?.filiere ?? ''}
          placeholder="Ta filière (ex: Génie Numérique)"
          required
          className="champ"
        />
        <button type="submit" className="bouton bouton-primaire w-full">
          Continuer
        </button>
      </form>
    </div>
  )
}