import { requireModuleManager } from '@/lib/auth/guards'
import { epinglerTalent, retirerTalent, deplacerTalent } from './actions'

export const dynamic = 'force-dynamic'

export default async function PageGestionTalents() {
  const { supabase } = await requireModuleManager('talents')

  const [{ data: epingles }, { data: tousLesMembres }] = await Promise.all([
    supabase
      .from('talents_mis_en_avant')
      .select('id, ordre, profiles!talents_mis_en_avant_profile_id_fkey(id, first_name, last_name, filiere, avatar_url)')
      .order('ordre'),
    supabase.from('profiles').select('id, first_name, last_name, filiere').order('first_name'),
  ])

  const idsEpingles = new Set((epingles ?? []).map((e: any) => e.profiles?.id))
  const disponibles = (tousLesMembres ?? []).filter((m) => !idsEpingles.has(m.id))

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-2 font-display text-2xl font-semibold text-encre sm:text-3xl">Talents mis en avant</h1>
      <p className="mb-6 text-sm text-encre/60">
        Choisis des membres à épingler en priorité sur l'accueil, dans "Talents à découvrir".
        Sans épingle, la section reste automatique (basée sur les réglages de confidentialité des membres).
      </p>

      <form action={epinglerTalent} className="cadre mb-8 flex flex-col items-stretch gap-3 border border-black/10 bg-white p-4 pt-5 shadow-sm sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1 block text-xs text-encre/60">Membre à épingler</label>
          <select name="profileId" required className="champ text-sm">
            {disponibles.map((m) => (
              <option key={m.id} value={m.id}>{m.first_name} {m.last_name} — {m.filiere}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="bouton bouton-primaire">
          Épingler
        </button>
      </form>

      <div className="space-y-2">
        {epingles?.map((e: any, index: number) => (
          <div key={e.id} className="cadre flex items-center justify-between border border-black/5 bg-white p-3 pt-4 shadow-sm">
            <div className="flex items-center gap-3">
              {e.profiles?.avatar_url && (
                <img src={e.profiles.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover" />
              )}
              <div>
                <p className="font-medium text-encre">{e.profiles?.first_name} {e.profiles?.last_name}</p>
                <p className="text-xs text-encre/60">{e.profiles?.filiere}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {index > 0 && (
                <form action={deplacerTalent}>
                  <input type="hidden" name="id" value={e.id} />
                  <input type="hidden" name="idVoisin" value={epingles[index - 1].id} />
                  <button type="submit" className="text-xs text-encre/50 hover:text-primaire">↑</button>
                </form>
              )}
              {index < epingles.length - 1 && (
                <form action={deplacerTalent}>
                  <input type="hidden" name="id" value={e.id} />
                  <input type="hidden" name="idVoisin" value={epingles[index + 1].id} />
                  <button type="submit" className="text-xs text-encre/50 hover:text-primaire">↓</button>
                </form>
              )}
              <form action={retirerTalent}>
                <input type="hidden" name="id" value={e.id} />
                <button type="submit" className="text-xs text-erreur hover:underline">Retirer</button>
              </form>
            </div>
          </div>
        ))}
        {(!epingles || epingles.length === 0) && (
          <p className="text-sm text-encre/60">Aucun talent épinglé — la section affiche automatiquement des profils.</p>
        )}
      </div>
    </div>
  )
}