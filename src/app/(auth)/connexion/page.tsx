import { connecter, connecterAvecGoogle } from '../actions'

export default async function PageConnexion({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string }>
}) {
  const { erreur } = await searchParams

  return (
    <div className="mx-auto max-w-md px-6 py-12">
      <h1 className="mb-6 text-2xl font-semibold text-encre">Connexion</h1>

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

      <form action={connecter} className="space-y-3">
        <input name="email" type="email" placeholder="Email" required className="champ" />
        <input name="password" type="password" placeholder="Mot de passe" required className="champ" />
        <button type="submit" className="bouton bouton-primaire w-full">
          Se connecter
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-encre/70">
        Pas encore de compte ? <a href="/inscription" className="text-primaire hover:underline">S'inscrire</a>
      </p>
    </div>
  )
}