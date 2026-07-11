import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

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
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-encre">Messagerie</h1>

      {conversations.length > 0 ? (
        <div className="space-y-2">
          {conversations.map((c) => (
            <a key={c.id} href={`/messagerie/${c.id}`} className="flex items-center gap-3 rounded-lg border border-black/10 p-3 transition-colors hover:bg-fond-clair">
              {c.profil?.avatar_url && (
                <img src={c.profil.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover" />
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-encre">{c.profil?.first_name} {c.profil?.last_name}</p>
                  {c.nonLus > 0 && (
                    <span className="pastille-vivante rounded-full bg-primaire px-2 py-0.5 text-xs text-white">{c.nonLus}</span>
                  )}
                </div>
                <p className="truncate text-sm text-encre/60">{c.dernierMessage.content}</p>
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
  )
}