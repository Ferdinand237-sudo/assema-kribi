import { demanderReinitialisation } from '../actions'

export default async function PageMotDePasseOublie({
  searchParams,
}: {
  searchParams: Promise<{ envoye?: string }>
}) {
  const { envoye } = await searchParams

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-md items-center px-6 py-12">
      <div className="w-full">
        <h1 className="mb-2 font-display text-2xl font-semibold text-encre">Mot de passe oublié</h1>
        <p className="mb-6 text-sm text-encre/60">
          Entre ton email et on t'envoie un lien pour définir un nouveau mot de passe — pratique aussi si tu t'es
          inscrit avec Google et que tu veux désormais pouvoir te connecter avec un mot de passe.
        </p>

        {envoye ? (
          <p className="badge-succes block w-fit rounded-lg px-4 py-3 text-sm">
            Si un compte existe avec cet email, un lien de réinitialisation vient d'être envoyé.
          </p>
        ) : (
          <form action={demanderReinitialisation} className="space-y-3">
            <input name="email" type="email" placeholder="Email" required className="champ" />
            <button type="submit" className="bouton bouton-primaire w-full">
              Envoyer le lien
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-encre/70">
          <a href="/connexion" className="text-primaire hover:underline">← Retour à la connexion</a>
        </p>
      </div>
    </div>
  )
}
