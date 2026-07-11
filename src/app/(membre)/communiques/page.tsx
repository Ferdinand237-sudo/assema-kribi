import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { marquerCommuniqueLu } from './actions'
import ContenuFormatte from '@/components/contenu-formatte'

export const dynamic = 'force-dynamic'

export default async function PageCommuniques() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const { data: communiques } = await supabase
    .from('communiques')
    .select('id, title, content, created_at, canal_public, canal_bureau, commissions(nom), communique_destinataires(id, profile_id, read)')
    .order('created_at', { ascending: false })

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-encre">Communiqués</h1>

      <div className="space-y-3">
        {communiques?.map((c: any) => {
          const destinataire = (c.communique_destinataires ?? []).find((d: any) => d.profile_id === user.id)
          const source = c.canal_public
            ? 'Public'
            : c.canal_bureau
            ? 'Bureau exécutif'
            : c.commissions?.nom
            ? `Commission ${c.commissions.nom}`
            : 'Message ciblé'

          return (
            <div
              key={c.id}
              className={`rounded-lg border p-4 ${destinataire && !destinataire.read ? 'border-primaire/40 bg-fond-clair' : 'border-black/10'}`}
            >
              <p className="font-mono text-xs uppercase tracking-wide text-primaire">{source}</p>
              <h3 className="font-semibold text-encre">{c.title}</h3>
              <ContenuFormatte texte={c.content} />
              <p className="mt-1 text-xs text-encre/50">{new Date(c.created_at).toLocaleDateString('fr-FR')}</p>

              {destinataire && !destinataire.read && (
                <form action={marquerCommuniqueLu} className="mt-2">
                  <input type="hidden" name="destinataireId" value={destinataire.id} />
                  <button type="submit" className="text-xs font-medium text-primaire hover:underline">Marquer comme lu</button>
                </form>
              )}
            </div>
          )
        })}
        {(!communiques || communiques.length === 0) && (
          <p className="text-sm text-encre/60">Aucun communiqué pour le moment.</p>
        )}
      </div>
    </div>
  )
}