import { requireModuleManager } from '@/lib/auth/guards'
import { creerProjet, ajouterMediasProjet, supprimerMediaProjet, supprimerProjet } from './actions'
import EditeurFormatte from '@/components/editeur-formatte'
import BoutonConfirmation from '@/components/bouton-confirmation'
import { extraireTexte } from '@/lib/texte'

export const dynamic = 'force-dynamic'

export default async function PageGestionProjets() {
  const { supabase } = await requireModuleManager('projets')

  const { data: projets } = await supabase
    .from('projets')
    .select('id, titre, description, resultats, projet_medias(id, url, type)')
    .order('created_at', { ascending: false })

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-6 font-display text-2xl font-semibold text-encre sm:text-3xl">Gestion des projets réalisés</h1>

      <form action={creerProjet} className="cadre mb-10 space-y-3 border border-black/10 bg-white p-4 pt-5 shadow-sm">
        <h2 className="font-semibold text-encre">Nouveau projet</h2>
        <input name="titre" placeholder="Titre du projet" required className="champ" />
        <EditeurFormatte name="description" placeholder="Description" rows={3} />
        <EditeurFormatte name="resultats" placeholder="Résultats et impacts" rows={3} />
        <div>
          <label className="mb-1 block text-xs text-encre/60">Photos / vidéos</label>
          <input type="file" name="medias" accept="image/*,video/*" multiple className="champ-fichier" />
        </div>
        <button type="submit" className="bouton bouton-primaire">
          Créer
        </button>
      </form>

      <div className="space-y-6">
        {projets?.map((p: any) => (
          <div key={p.id} className="cadre border border-black/5 bg-white p-4 pt-5 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold text-encre">{p.titre}</h3>
              <div className="flex gap-3">
                <a href={`/gestion/projets/${p.id}`} className="text-xs font-medium text-primaire hover:underline">Modifier</a>
                <form action={supprimerProjet}>
                  <input type="hidden" name="id" value={p.id} />
                  <BoutonConfirmation message={`Supprimer définitivement le projet "${p.titre}" ?`} className="text-xs text-erreur hover:underline">
                    Supprimer
                  </BoutonConfirmation>
                </form>
              </div>
            </div>
            {p.description && <p className="mb-1 text-sm text-encre/70">{extraireTexte(p.description, 200)}</p>}
            {p.resultats && <p className="mb-3 text-xs text-encre/60">Résultats : {extraireTexte(p.resultats, 200)}</p>}

            {(p.projet_medias ?? []).length > 0 && (
              <div className="mb-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
                {p.projet_medias.map((m: any) => (
                  <div key={m.id} className="group relative overflow-hidden rounded-lg border border-black/10">
                    {m.type === 'video' ? (
                      <video src={m.url} className="h-16 w-full object-cover" />
                    ) : (
                      <img src={m.url} alt="" className="h-16 w-full object-cover" />
                    )}
                    <form action={supprimerMediaProjet} className="absolute right-1 top-1">
                      <input type="hidden" name="id" value={m.id} />
                      <button type="submit" className="rounded bg-erreur px-1 text-xs text-white opacity-0 group-hover:opacity-100">✕</button>
                    </form>
                  </div>
                ))}
              </div>
            )}

            <form action={ajouterMediasProjet} className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input type="hidden" name="projetId" value={p.id} />
              <input type="file" name="medias" accept="image/*,video/*" multiple className="champ-fichier flex-1" />
              <button type="submit" className="bouton bouton-secondaire !py-1.5">
                Ajouter
              </button>
            </form>
          </div>
        ))}
        {(!projets || projets.length === 0) && (
          <p className="text-sm text-encre/60">Aucun projet pour le moment.</p>
        )}
      </div>
    </div>
  )
}