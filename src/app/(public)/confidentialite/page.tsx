import { createClient } from '@/lib/supabase/server'
import ContenuFormatte from '@/components/contenu-formatte'

export const dynamic = 'force-dynamic'

export default async function PageConfidentialite() {
  const supabase = await createClient()
  const { data } = await supabase.from('pages_contenu').select('contenu').eq('slug', 'confidentialite').single()
  const c = (data?.contenu ?? {}) as Record<string, string>

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-8 text-center font-display text-3xl font-semibold text-encre">Confidentialité et propriétés</h1>

      {c.contenu ? (
        <div className="text-justify"><ContenuFormatte texte={c.contenu} /></div>
      ) : (
        <p className="text-center text-sm text-encre/60">Cette page est en cours de rédaction.</p>
      )}
    </div>
  )
}
