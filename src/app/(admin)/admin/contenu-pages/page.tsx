import { requireAdminOuPresident } from '@/lib/auth/guards'
import {
  mettreAJourAPropos,
  mettreAJourContact,
  mettreAJourConfidentialite,
  mettreAJourConditionsUtilisation,
} from './actions'
import EditeurFormatte from '@/components/editeur-formatte'
import BoutonEnvoi from '@/components/bouton-envoi'

export const dynamic = 'force-dynamic'

const ONGLETS = [
  { ancre: 'a-propos', label: 'À propos' },
  { ancre: 'contact', label: 'Contact' },
  { ancre: 'confidentialite', label: 'Confidentialité' },
  { ancre: 'conditions-utilisation', label: "Conditions d'utilisation" },
]

export default async function PageContenuPages() {
  const { supabase } = await requireAdminOuPresident()

  const { data: pages } = await supabase.from('pages_contenu').select('slug, contenu')

  const aPropos = pages?.find((p) => p.slug === 'a-propos')?.contenu ?? {}
  const contact = pages?.find((p) => p.slug === 'contact')?.contenu ?? {}
  const confidentialite = pages?.find((p) => p.slug === 'confidentialite')?.contenu ?? {}
  const conditions = pages?.find((p) => p.slug === 'conditions-utilisation')?.contenu ?? {}

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <a href="/admin" className="text-xs font-medium text-primaire hover:underline">← Tableau de bord</a>
      <h1 className="mb-1 mt-2 font-display text-2xl font-semibold text-encre sm:text-3xl">Contenu des pages</h1>
      <p className="mb-6 text-sm text-encre/60">Rédige et mets en forme les pages fixes du site.</p>

      <nav className="mb-8 flex flex-wrap gap-2">
        {ONGLETS.map((o) => (
          <a
            key={o.ancre}
            href={`#${o.ancre}`}
            className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-encre/80 transition-colors hover:border-primaire hover:text-primaire"
          >
            {o.label}
          </a>
        ))}
      </nav>

      <section id="a-propos" className="cadre mb-10 scroll-mt-6 border border-black/10 bg-white p-4 pt-5 shadow-sm sm:p-6 sm:pt-7">
        <h2 className="mb-1 font-display text-lg font-semibold text-encre">Page "À propos"</h2>
        <p className="mb-4 text-xs text-encre/60">Histoire et vision bénéficient de la mise en forme riche (titres, gras, alignement...).</p>
        <form action={mettreAJourAPropos} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-encre/70">Histoire</label>
            <EditeurFormatte name="histoire" defaultValue={aPropos.histoire ?? ''} placeholder="L'histoire de l'association" rows={4} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-encre/70">Vision</label>
            <EditeurFormatte name="vision" defaultValue={aPropos.vision ?? ''} placeholder="La vision de l'association" rows={4} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-encre/70">Missions (une par ligne)</label>
            <textarea name="missions" defaultValue={aPropos.missions ?? ''} rows={4} className="champ text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-encre/70">Objectifs (un par ligne)</label>
            <textarea name="objectifs" defaultValue={aPropos.objectifs ?? ''} rows={4} className="champ text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-encre/70">Valeurs</label>
            <input name="valeurs" defaultValue={aPropos.valeurs ?? ''} className="champ text-sm" />
          </div>
          <BoutonEnvoi texteEnvoi="Enregistrement...">Enregistrer</BoutonEnvoi>
        </form>
      </section>

      <section id="contact" className="cadre mb-10 scroll-mt-6 border border-black/10 bg-white p-4 pt-5 shadow-sm sm:p-6 sm:pt-7">
        <h2 className="mb-1 font-display text-lg font-semibold text-encre">Page "Contact"</h2>
        <p className="mb-4 text-xs text-encre/60">L'introduction bénéficie de la mise en forme riche.</p>
        <form action={mettreAJourContact} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-encre/70">Introduction (optionnel)</label>
            <EditeurFormatte name="intro" defaultValue={contact.intro ?? ''} placeholder="Quelques mots d'introduction" rows={3} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-encre/70">Adresse</label>
            <input name="adresse" defaultValue={contact.adresse ?? ''} className="champ text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-encre/70">Réseaux sociaux</label>
            <input name="reseaux_sociaux" defaultValue={contact.reseaux_sociaux ?? ''} className="champ text-sm" />
          </div>
          <BoutonEnvoi texteEnvoi="Enregistrement...">Enregistrer</BoutonEnvoi>
        </form>
      </section>

      <section id="confidentialite" className="cadre mb-10 scroll-mt-6 border border-black/10 bg-white p-4 pt-5 shadow-sm sm:p-6 sm:pt-7">
        <h2 className="mb-1 font-display text-lg font-semibold text-encre">Page "Confidentialité et propriétés"</h2>
        <p className="mb-4 text-xs text-encre/60">Accessible depuis le pied de page du site.</p>
        <form action={mettreAJourConfidentialite} className="space-y-4">
          <EditeurFormatte name="contenu" defaultValue={confidentialite.contenu ?? ''} placeholder="Politique de confidentialité et de propriété intellectuelle" rows={8} />
          <BoutonEnvoi texteEnvoi="Enregistrement...">Enregistrer</BoutonEnvoi>
        </form>
      </section>

      <section id="conditions-utilisation" className="cadre scroll-mt-6 border border-black/10 bg-white p-4 pt-5 shadow-sm sm:p-6 sm:pt-7">
        <h2 className="mb-1 font-display text-lg font-semibold text-encre">Page "Conditions d'utilisation"</h2>
        <p className="mb-4 text-xs text-encre/60">Accessible depuis le pied de page du site.</p>
        <form action={mettreAJourConditionsUtilisation} className="space-y-4">
          <EditeurFormatte name="contenu" defaultValue={conditions.contenu ?? ''} placeholder="Conditions d'utilisation du site" rows={8} />
          <BoutonEnvoi texteEnvoi="Enregistrement...">Enregistrer</BoutonEnvoi>
        </form>
      </section>
    </div>
  )
}
