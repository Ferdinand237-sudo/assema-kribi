import { createClient } from '@/lib/supabase/server'
import Reveal from '@/components/reveal'

export const dynamic = 'force-dynamic'

export default async function PageBureauExecutif() {
  const supabase = await createClient()

  const { data: membres } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, poste_bureau, avatar_url, bio, profile_privacy(show_photo)')
    .not('poste_bureau', 'is', null)
    .order('poste_bureau')

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-8 font-display text-3xl font-semibold text-encre">Bureau exécutif</h1>

      {membres && membres.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-3">
          {membres.map((m: any, i: number) => (
            <Reveal key={m.id} delayMs={i * 80}>
              <a href={`/membres/${m.id}`} className="carte-interactive block h-full rounded-lg border border-black/5 bg-white p-4 text-center shadow-sm">
                {m.profile_privacy?.show_photo && m.avatar_url && (
                  <img src={m.avatar_url} alt="" className="mx-auto mb-3 h-20 w-20 rounded-full object-cover" />
                )}
                <p className="font-semibold text-encre">{m.first_name} {m.last_name}</p>
                <p className="text-sm text-primaire">{m.poste_bureau}</p>
                {m.bio && <p className="mt-2 text-xs text-encre/60">{m.bio}</p>}
              </a>
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="text-sm text-encre/60">Le bureau exécutif n'a pas encore été renseigné.</p>
      )}
    </div>
  )
}