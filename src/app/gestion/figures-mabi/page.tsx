import { requireModuleManager } from '@/lib/auth/guards'
import { creerFigure, supprimerFigure } from './actions'
import EditeurFormatte from '@/components/editeur-formatte'
import BoutonConfirmation from '@/components/bouton-confirmation'

export const dynamic = 'force-dynamic'

export default async function PageGestionFigures() {
  const { supabase } = await requireModuleManager('culture_figures')

  const { data: figures } = await supabase
    .from('figures_mabi')
    .select('id, nom, photo_url, vivant, date_naissance, date_deces, village')
    .order('nom')

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-2 font-display text-2xl font-semibold text-encre sm:text-3xl">Grandes figures Mabi</h1>
      <p className="mb-6 text-sm text-encre/60">Les élites et héros historiques de la communauté.</p>

      <form action={creerFigure} className="cadre mb-10 space-y-3 border border-black/10 bg-white p-4 pt-5 shadow-sm">
        <h2 className="font-semibold text-encre">Nouvelle figure</h2>
        <input name="nom" placeholder="Nom complet" required className="champ" />
        <EditeurFormatte name="biographie" placeholder="Biographie" rows={5} />
        <input name="village" placeholder="Village d'origine" className="champ" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-encre/60">Date de naissance</label>
            <input name="dateNaissance" type="date" className="champ" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-encre/60">Date de décès (si applicable)</label>
            <input name="dateDeces" type="date" className="champ" />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-encre/85">
          <input type="checkbox" name="vivant" defaultChecked className="accent-primaire" /> Toujours en vie
        </label>
        <div>
          <label className="mb-1 block text-xs text-encre/60">Photo</label>
          <input type="file" name="photo" accept="image/*" className="champ-fichier" />
        </div>
        <button type="submit" className="bouton bouton-primaire">
          Ajouter
        </button>
      </form>

      <div className="space-y-2">
        {figures?.map((f) => (
          <div key={f.id} className="cadre flex items-center justify-between border border-black/5 bg-white p-3 pt-4 shadow-sm">
            <div className="flex items-center gap-3">
              {f.photo_url && <img src={f.photo_url} alt="" className="h-10 w-10 rounded-full object-cover" />}
              <div>
                <p className="font-medium text-encre">{f.nom}</p>
                <p className="text-xs text-encre/60">
                  {f.village && `${f.village} · `}
                  {f.vivant ? 'En vie' : 'Décédé(e)'}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <a href={`/gestion/figures-mabi/${f.id}`} className="text-xs font-medium text-primaire hover:underline">Modifier</a>
              <form action={supprimerFigure}>
                <input type="hidden" name="id" value={f.id} />
                <BoutonConfirmation message={`Supprimer définitivement "${f.nom}" ?`} className="text-xs text-erreur hover:underline">
                  Supprimer
                </BoutonConfirmation>
              </form>
            </div>
          </div>
        ))}
        {(!figures || figures.length === 0) && (
          <p className="text-sm text-encre/60">Aucune figure enregistrée pour le moment.</p>
        )}
      </div>
    </div>
  )
}