import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ContenuFormatte from '@/components/contenu-formatte'

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
    .select('id, title, content, created_at')
    .eq('id', id)
    .eq('canal_public', true)
    .single()

  if (!communique) notFound()

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <a href="/" className="text-xs font-medium text-primaire hover:underline">← Retour à l'accueil</a>

      <p className="mb-1 mt-4 font-mono text-xs font-medium uppercase tracking-wide text-primaire">Communiqué du président</p>
      <h1 className="mb-2 font-display text-3xl font-semibold text-encre">{communique.title}</h1>
      <p className="mb-6 text-xs text-encre/50">
        {new Date(communique.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>

      <ContenuFormatte texte={communique.content} />
    </div>
  )
}
