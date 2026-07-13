import { createClient } from '@/lib/supabase/server'
import { envoyerMessageContact } from './actions'
import ContenuFormatte from '@/components/contenu-formatte'

export const dynamic = 'force-dynamic'

export default async function PageContact({
  searchParams,
}: {
  searchParams: Promise<{ succes?: string; erreur?: string }>
}) {
  const { succes, erreur } = await searchParams
  const supabase = await createClient()
  const { data } = await supabase.from('pages_contenu').select('contenu').eq('slug', 'contact').single()
  const c = (data?.contenu ?? {}) as Record<string, string>

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="mb-6 text-center font-display text-3xl font-semibold text-encre">Contact</h1>

      {c.intro && <div className="mb-6 text-justify"><ContenuFormatte texte={c.intro} /></div>}

      <div className="mb-8 text-sm text-encre/80">
        {c.adresse && <p><strong>Adresse :</strong> {c.adresse}</p>}
        {c.reseaux_sociaux && <p><strong>Réseaux sociaux :</strong> {c.reseaux_sociaux}</p>}
      </div>

      {succes && (
        <p className="confirmation-douce badge-succes mb-4 block w-fit rounded-lg px-4 py-3 text-sm">
          Ton message a bien été envoyé, merci !
        </p>
      )}
      {erreur && (
        <p className="confirmation-douce badge-erreur mb-4 block w-fit rounded-lg px-4 py-3 text-sm">
          Une erreur est survenue, réessaie.
        </p>
      )}

      <form action={envoyerMessageContact} className="space-y-3">
        <input name="nom" placeholder="Ton nom" required className="champ" />
        <input name="email" type="email" placeholder="Ton email" required className="champ" />
        <input name="sujet" placeholder="Sujet" className="champ" />
        <textarea name="message" placeholder="Ton message" rows={5} required className="champ" />
        <button type="submit" className="bouton bouton-primaire">
          Envoyer
        </button>
      </form>
    </div>
  )
}