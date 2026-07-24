import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { creerForumPrive } from './actions'

export const dynamic = 'force-dynamic'

export default async function PageDiscussionsPrivees() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const { data: participations } = await supabase
    .from('forum_prive_participants')
    .select('forum_id')
    .eq('profile_id', user.id)

  const idsParticipe = (participations ?? []).map((p) => p.forum_id)
  const filtre = idsParticipe.length > 0
    ? `created_by.eq.${user.id},id.in.(${idsParticipe.join(',')})`
    : `created_by.eq.${user.id}`

  const [{ data: forums }, { data: profils }] = await Promise.all([
    supabase
      .from('forums_prives')
      .select('id, titre, created_at, created_by, forum_prive_participants(id, profiles(first_name, last_name))')
      .or(filtre)
      .order('created_at', { ascending: false }),
    supabase.from('profiles').select('id, first_name, last_name').neq('id', user.id).order('first_name'),
  ])

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-1 text-2xl font-semibold text-encre">Discussions privées</h1>
      <p className="mb-6 text-sm text-encre/60">
        Crée une discussion et choisis librement qui peut y participer : elle n'est visible que par les membres ajoutés.
      </p>

      <form action={creerForumPrive} className="cadre mb-8 space-y-3 border border-black/10 bg-white p-4 pt-5 shadow-sm">
        <h2 className="font-semibold text-encre">Nouvelle discussion</h2>
        <input name="titre" placeholder="Titre de la discussion" required className="champ" />

        <div>
          <p className="mb-1 text-xs text-encre/60">Participants</p>
          <div className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-black/10 p-2">
            {profils?.map((p) => (
              <label key={p.id} className="flex items-center gap-2 rounded px-1 py-1 text-sm text-encre/85 hover:bg-fond-clair">
                <input type="checkbox" name="participantIds" value={p.id} className="accent-primaire" />
                {p.first_name} {p.last_name}
              </label>
            ))}
            {(!profils || profils.length === 0) && (
              <p className="px-1 py-1 text-xs text-encre/40">Aucun autre membre pour l'instant.</p>
            )}
          </div>
        </div>

        <button type="submit" className="bouton bouton-primaire">
          Créer la discussion
        </button>
      </form>

      <div className="space-y-2">
        {forums?.map((f: any) => {
          const autresParticipants = (f.forum_prive_participants ?? [])
            .map((p: any) => p.profiles)
            .filter(Boolean)
          return (
            <a
              key={f.id}
              href={`/discussions/${f.id}`}
              className="carte-interactive block border border-black/5 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold text-encre">{f.titre}</h3>
                {f.created_by === user.id && (
                  <span className="flex-shrink-0 rounded-full bg-fond-clair px-2 py-0.5 text-[11px] font-medium text-primaire">
                    Créée par toi
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-encre/50">
                {autresParticipants.length > 0
                  ? `Avec ${autresParticipants.map((p: any) => `${p.first_name} ${p.last_name}`).join(', ')}`
                  : 'Aucun autre participant pour l\'instant'}
              </p>
            </a>
          )
        })}
        {(!forums || forums.length === 0) && (
          <p className="text-sm text-encre/60">Aucune discussion privée pour le moment.</p>
        )}
      </div>
    </div>
  )
}
