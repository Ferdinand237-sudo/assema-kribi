import { inscrire, connecterAvecGoogle } from '../actions'

export default async function PageInscription({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string }>
}) {
  const { erreur } = await searchParams

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-md items-center px-6 py-12">
      <div className="cadre w-full border border-black/5 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="mb-1 font-display text-2xl font-semibold text-encre">Rejoindre l'ASSEMA</h1>
        <p className="mb-6 text-sm text-encre/60">Crée ton compte pour accéder à l'espace communautaire.</p>

        {erreur && (
          <p className="badge-erreur mb-4 block w-fit rounded-lg px-4 py-3 text-sm">{erreur}</p>
        )}

        <form action={connecterAvecGoogle} className="mb-4">
          <button type="submit" className="bouton bouton-secondaire flex w-full items-center justify-center gap-2">
            <svg viewBox="0 0 24 24" className="h-5 w-5 flex-shrink-0" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuer avec Google
          </button>
        </form>

        <div className="mb-4 flex items-center gap-3 text-sm text-encre/40">
          <div className="h-px flex-1 bg-black/10" />
          ou
          <div className="h-px flex-1 bg-black/10" />
        </div>

        <form action={inscrire} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input name="firstName" placeholder="Prénom" required className="champ" />
            <input name="lastName" placeholder="Nom" required className="champ" />
          </div>
          <input name="filiere" placeholder="Filière" required className="champ" />
          <input name="email" type="email" placeholder="Email" required className="champ" />
          <input name="password" type="password" placeholder="Mot de passe" required minLength={6} className="champ" />
          <button type="submit" className="bouton bouton-primaire w-full">
            S'inscrire
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-encre/70">
          Déjà membre ? <a href="/connexion" className="font-medium text-primaire hover:underline">Se connecter</a>
        </p>
      </div>
    </div>
  )
}
