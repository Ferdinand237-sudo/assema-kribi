import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ContenuFormatte from '@/components/contenu-formatte'
import BoutonsPartage from '@/components/boutons-partage'

export const dynamic = 'force-dynamic'

export default async function PageCommuniquePublic({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: communique } = await supabase
    .from('communiques')
    .select('id, title, content, created_at, date_evenement, lieu_evenement')
    .eq('id', id)
    .eq('canal_public', true)
    .single()

  if (!communique) notFound()

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <a href="/" className="text-xs font-medium text-primaire hover:underline">← Retour à l'accueil</a>

      <p className="mb-1 mt-4 text-center font-mono text-xs font-medium uppercase tracking-wide text-primaire">Communiqué du président</p>
      <h1 className="mb-2 text-center font-display text-3xl font-semibold text-encre">{communique.title}</h1>
      <p className="mb-4 text-center text-xs text-encre/50">
        {new Date(communique.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>

      {(communique.date_evenement || communique.lieu_evenement) && (
        <p className="cadre mb-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 border border-primaire/20 bg-fond-clair p-3 pt-4 text-sm font-medium text-primaire">
          {communique.date_evenement && (
            <span>📅 {new Date(communique.date_evenement).toLocaleString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
          )}
          {communique.lieu_evenement && <span>📍 {communique.lieu_evenement}</span>}
        </p>
      )}

      <div className="text-justify">
        <ContenuFormatte texte={communique.content} />
      </div>

      <div className="mt-8 border-t border-black/10 pt-4">
        <BoutonsPartage url={`${process.env.NEXT_PUBLIC_SITE_URL}/communiques/${communique.id}`} titre={communique.title} />
      </div>
    </div>
  )
}
