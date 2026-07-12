import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

function formaterDateConversation(date: string) {
  const d = new Date(date)
  const maintenant = new Date()
  if (d.toDateString() === maintenant.toDateString()) {
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }
  const hier = new Date(maintenant)
  hier.setDate(hier.getDate() - 1)
  if (d.toDateString() === hier.toDateString()) return 'Hier'
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export default async function PageMessagerie() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const { data: messages } = await supabase
    .from('messages')
    .select('id, sender_id, receiver_id, content, read, created_at')
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order('created_at', { ascending: false })

  const conversationsMap = new Map<string, { dernierMessage: any; nonLus: number }>()

  for (const m of messages ?? []) {
    const autreId = m.sender_id === user.id ? m.receiver_id : m.sender_id
    if (!conversationsMap.has(autreId)) {
      conversationsMap.set(autreId, { dernierMessage: m, nonLus: 0 })
    }
    if (m.receiver_id === user.id && !m.read) {
      conversationsMap.get(autreId)!.nonLus += 1
    }
  }

  const autreIds = Array.from(conversationsMap.keys())
  const { data: profils } = autreIds.length > 0
    ? await supabase.from('profiles').select('id, first_name, last_name, avatar_url').in('id', autreIds)
    : { data: [] as any[] }

  const conversations = autreIds
    .map((id) => {
      const profil = profils?.find((p) => p.id === id)
      const info = conversationsMap.get(id)!
      return { id, profil, ...info }
    })
    .sort((a, b) => new Date(b.dernierMessage.created_at).getTime() - new Date(a.dernierMessage.created_at).getTime())

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-fond-casse">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="mb-6 text-2xl font-semibold text-encre">Messagerie</h1>

        {conversations.length > 0 ? (
          <div className="space-y-2">
            {conversations.map((c) => (
              <a
                key={c.id}
                href={`/messagerie/${c.id}`}
                className={`carte-interactive flex items-center gap-3 rounded-xl border p-3 sm:p-4 ${
                  c.nonLus > 0 ? 'border-primaire/25 bg-white' : 'border-black/5 bg-white/70'
                }`}
              >
                <div className="relative flex-shrink-0">
                  {c.profil?.avatar_url ? (
                    <img src={c.profil.avatar_url} alt="" className="h-12 w-12 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-fond-clair font-display text-lg text-primaire">
                      {c.profil?.first_name?.[0]}
                    </div>
                  )}
                  {c.nonLus > 0 && (
                    <span className="pastille-vivante absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primaire px-1 text-[11px] font-medium text-white ring-2 ring-white">
                      {c.nonLus}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate font-medium text-encre">{c.profil?.first_name} {c.profil?.last_name}</p>
                    <span className="flex-shrink-0 font-mono text-[11px] text-encre/40">
                      {formaterDateConversation(c.dernierMessage.created_at)}
                    </span>
                  </div>
                  <p className={`truncate text-sm ${c.nonLus > 0 ? 'font-medium text-encre/85' : 'text-encre/55'}`}>
                    {c.dernierMessage.content}
                  </p>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-sm text-encre/60">
            Aucune conversation pour le moment. Va sur le profil d'un membre pour lui envoyer un message.
          </p>
        )}
      </div>
    </div>
  )
}