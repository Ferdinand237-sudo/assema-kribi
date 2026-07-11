import { requireAdminOuPresident } from '@/lib/auth/guards'
import { mettreAJourAPropos, mettreAJourContact } from './actions'

export const dynamic = 'force-dynamic'

export default async function PageContenuPages() {
  const { supabase } = await requireAdminOuPresident()

  const { data: pages } = await supabase.from('pages_contenu').select('slug, contenu')

  const aPropos = pages?.find((p) => p.slug === 'a-propos')?.contenu ?? {}
  const contact = pages?.find((p) => p.slug === 'contact')?.contenu ?? {}

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Contenu des pages</h1>

      <section className="mb-10 rounded border p-4">
        <h2 className="mb-3 font-semibold">Page "À propos"</h2>
        <form action={mettreAJourAPropos} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-gray-500">Histoire</label>
            <textarea name="histoire" defaultValue={aPropos.histoire ?? ''} rows={3} className="w-full rounded border p-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">Vision</label>
            <textarea name="vision" defaultValue={aPropos.vision ?? ''} rows={3} className="w-full rounded border p-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">Missions (une par ligne)</label>
            <textarea name="missions" defaultValue={aPropos.missions ?? ''} rows={4} className="w-full rounded border p-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">Objectifs (un par ligne)</label>
            <textarea name="objectifs" defaultValue={aPropos.objectifs ?? ''} rows={4} className="w-full rounded border p-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">Valeurs</label>
            <input name="valeurs" defaultValue={aPropos.valeurs ?? ''} className="w-full rounded border p-2 text-sm" />
          </div>
          <button type="submit" className="rounded bg-primaire px-4 py-2 text-sm text-white hover:bg-primaire-fonce">
            Enregistrer
          </button>
        </form>
      </section>

      <section className="rounded border p-4">
        <h2 className="mb-3 font-semibold">Page "Contact"</h2>
        <form action={mettreAJourContact} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-gray-500">Introduction (optionnel)</label>
            <textarea name="intro" defaultValue={contact.intro ?? ''} rows={2} className="w-full rounded border p-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">Adresse</label>
            <input name="adresse" defaultValue={contact.adresse ?? ''} className="w-full rounded border p-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">Réseaux sociaux</label>
            <input name="reseaux_sociaux" defaultValue={contact.reseaux_sociaux ?? ''} className="w-full rounded border p-2 text-sm" />
          </div>
          <button type="submit" className="rounded bg-primaire px-4 py-2 text-sm text-white hover:bg-primaire-fonce">
            Enregistrer
          </button>
        </form>
      </section>
    </div>
  )
}