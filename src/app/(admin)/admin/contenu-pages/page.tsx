import { requireAdminOuPresident } from '@/lib/auth/guards'
import { mettreAJourAPropos, mettreAJourContact } from './actions'

export const dynamic = 'force-dynamic'

export default async function PageContenuPages() {
  const { supabase } = await requireAdminOuPresident()

  const { data: pages } = await supabase.from('pages_contenu').select('slug, contenu')

  const aPropos = pages?.find((p) => p.slug === 'a-propos')?.contenu ?? {}
  const contact = pages?.find((p) => p.slug === 'contact')?.contenu ?? {}

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-6 font-display text-2xl font-semibold text-encre sm:text-3xl">Contenu des pages</h1>

      <section className="cadre mb-10 border border-black/10 bg-white p-4 pt-5 shadow-sm">
        <h2 className="mb-3 font-semibold text-encre">Page "À propos"</h2>
        <form action={mettreAJourAPropos} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-encre/60">Histoire</label>
            <textarea name="histoire" defaultValue={aPropos.histoire ?? ''} rows={3} className="champ text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-encre/60">Vision</label>
            <textarea name="vision" defaultValue={aPropos.vision ?? ''} rows={3} className="champ text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-encre/60">Missions (une par ligne)</label>
            <textarea name="missions" defaultValue={aPropos.missions ?? ''} rows={4} className="champ text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-encre/60">Objectifs (un par ligne)</label>
            <textarea name="objectifs" defaultValue={aPropos.objectifs ?? ''} rows={4} className="champ text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-encre/60">Valeurs</label>
            <input name="valeurs" defaultValue={aPropos.valeurs ?? ''} className="champ text-sm" />
          </div>
          <button type="submit" className="bouton bouton-primaire">
            Enregistrer
          </button>
        </form>
      </section>

      <section className="cadre border border-black/10 bg-white p-4 pt-5 shadow-sm">
        <h2 className="mb-3 font-semibold text-encre">Page "Contact"</h2>
        <form action={mettreAJourContact} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-encre/60">Introduction (optionnel)</label>
            <textarea name="intro" defaultValue={contact.intro ?? ''} rows={2} className="champ text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-encre/60">Adresse</label>
            <input name="adresse" defaultValue={contact.adresse ?? ''} className="champ text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-encre/60">Réseaux sociaux</label>
            <input name="reseaux_sociaux" defaultValue={contact.reseaux_sociaux ?? ''} className="champ text-sm" />
          </div>
          <button type="submit" className="bouton bouton-primaire">
            Enregistrer
          </button>
        </form>
      </section>
    </div>
  )
}