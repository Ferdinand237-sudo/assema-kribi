import { requireModuleManager } from '@/lib/auth/guards'
import { creerProjet, ajouterMediasProjet, supprimerMediaProjet, supprimerProjet } from './actions'
import EditeurFormatte from '@/components/editeur-formatte'

export const dynamic = 'force-dynamic'

export default async function PageGestionProjets() {
  const { supabase } = await requireModuleManager('projets')

  const { data: projets } = await supabase
    .from('projets')
    .select('id, titre, description, resultats, projet_medias(id, url, type)')
    .order('created_at', { ascending: false })

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Gestion des projets réalisés</h1>

      <form action={creerProjet} className="mb-10 space-y-3 rounded border p-4">
        <h2 className="font-semibold">Nouveau projet</h2>
        <input name="titre" placeholder="Titre du projet" required className="w-full rounded border p-2" />
        <EditeurFormatte name="description" placeholder="Description" rows={3} />
        <EditeurFormatte name="resultats" placeholder="Résultats et impacts" rows={3} />
        <div>
          <label className="mb-1 block text-xs text-gray-500">Photos / vidéos</label>
          <input type="file" name="medias" accept="image/*,video/*" multiple className="text-sm" />
        </div>
        <button type="submit" className="rounded bg-primaire px-4 py-2 text-sm text-white hover:bg-primaire-fonce">
          Créer
        </button>
      </form>

      <div className="space-y-6">
        {projets?.map((p: any) => (
          <div key={p.id} className="rounded border p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold">{p.titre}</h3>
              <form action={supprimerProjet}>
                <input type="hidden" name="id" value={p.id} />
                <button type="submit" className="text-xs text-red-600 hover:underline">Supprimer</button>
              </form>
            </div>
            {p.description && <p className="mb-1 text-sm text-gray-600">{p.description}</p>}
            {p.resultats && <p className="mb-3 text-xs text-gray-500">Résultats : {p.resultats}</p>}

            {(p.projet_medias ?? []).length > 0 && (
              <div className="mb-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
                {p.projet_medias.map((m: any) => (
                  <div key={m.id} className="group relative overflow-hidden rounded border">
                    {m.type === 'video' ? (
                      <video src={m.url} className="h-16 w-full object-cover" />
                    ) : (
                      <img src={m.url} alt="" className="h-16 w-full object-cover" />
                    )}
                    <form action={supprimerMediaProjet} className="absolute right-1 top-1">
                      <input type="hidden" name="id" value={m.id} />
                      <button type="submit" className="rounded bg-red-600 px-1 text-xs text-white opacity-0 group-hover:opacity-100">✕</button>
                    </form>
                  </div>
                ))}
              </div>
            )}

            <form action={ajouterMediasProjet} className="flex items-center gap-2">
              <input type="hidden" name="projetId" value={p.id} />
              <input type="file" name="medias" accept="image/*,video/*" multiple className="flex-1 text-sm" />
              <button type="submit" className="rounded bg-gray-200 px-3 py-1.5 text-sm hover:bg-gray-300">
                Ajouter
              </button>
            </form>
          </div>
        ))}
        {(!projets || projets.length === 0) && (
          <p className="text-sm text-gray-500">Aucun projet pour le moment.</p>
        )}
      </div>
    </div>
  )
}