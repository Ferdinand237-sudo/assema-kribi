import { inscrire, connecterAvecGoogle } from '../actions'

export default async function PageInscription({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string }>
}) {
  const { erreur } = await searchParams

  return (
    <div className="mx-auto max-w-md px-6 py-12">
      <h1 className="mb-6 text-2xl font-semibold text-encre">Créer un compte ASSEMA</h1>

      {erreur && (
        <p className="badge-erreur mb-4 block w-fit rounded-lg px-4 py-3 text-sm">{erreur}</p>
      )}

      <form action={connecterAvecGoogle} className="mb-4">
        <button type="submit" className="bouton bouton-secondaire w-full">
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
        Déjà membre ? <a href="/connexion" className="text-primaire hover:underline">Se connecter</a>
      </p>
    </div>
  )
}