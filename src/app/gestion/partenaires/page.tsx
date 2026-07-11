import { requireModuleManager } from '@/lib/auth/guards'
import {
  creerPartenaire,
  supprimerPartenaire,
  creerAnnonce,
  togglePublicationAnnonce,
  supprimerAnnonce,
} from './actions'
import EditeurFormatte from '@/components/editeur-formatte'

export const dynamic = 'force-dynamic'

export default async function PageGestionPartenaires() {
  const { supabase } = await requireModuleManager('partenaires')

  const { data: partenaires } = await supabase
    .from('partenaires')
    .select('id, nom, logo_url, description, lien, annonces_partenaires(id, title, status, image_url, created_at)')
    .order('created_at', { ascending: false })

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Gestion des partenaires</h1>

      <form action={creerPartenaire} className="mb-10 space-y-3 rounded border p-4">
        <h2 className="font-semibold">Nouveau partenaire</h2>
        <input name="nom" placeholder="Nom du partenaire" required className="w-full rounded border p-2" />
        <textarea name="description" placeholder="Description" rows={2} className="w-full rounded border p-2" />
        <input name="lien" type="url" placeholder="Site web (https://...)" className="w-full rounded border p-2" />
        <div>
          <label className="mb-1 block text-xs text-gray-500">Logo</label>
          <input type="file" name="logo" accept="image/*" className="text-sm" />
        </div>
        <button type="submit" className="rounded bg-primaire px-4 py-2 text-sm text-white hover:bg-primaire-fonce">
          Ajouter
        </button>
      </form>

      <div className="space-y-6">
        {partenaires?.map((p: any) => (
          <div key={p.id} className="rounded border p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {p.logo_url && <img src={p.logo_url} alt="" className="h-10 w-10 object-contain" />}
                <div>
                  <p className="font-semibold">{p.nom}</p>
                  {p.description && <p className="text-xs text-gray-500">{p.description}</p>}
                </div>
              </div>
              <form action={supprimerPartenaire}>
                <input type="hidden" name="id" value={p.id} />
                <button type="submit" className="text-xs text-red-600 hover:underline">Supprimer</button>
              </form>
            </div>

            {/* Annonces de ce partenaire */}
            <div className="ml-4 space-y-2 border-l pl-4">
              <p className="text-xs font-medium text-gray-500">Annonces</p>
              {(p.annonces_partenaires ?? []).map((a: any) => (
                <div key={a.id} className="flex items-center justify-between rounded bg-gray-50 p-2 text-sm">
                  <span>
                    {a.title}{' '}
                    <span className={`badge-statut ${a.status === 'published' ? 'badge-succes' : 'badge-neutre'}`}>
                      {a.status === 'published' ? 'Publiée' : 'Brouillon'}
                    </span>
                  </span>
                  <div className="flex gap-2">
                    <form action={togglePublicationAnnonce}>
                      <input type="hidden" name="id" value={a.id} />
                      <input type="hidden" name="nouveauStatut" value={a.status === 'published' ? 'draft' : 'published'} />
                      <button type="submit" className="text-xs text-primaire hover:underline">
                        {a.status === 'published' ? 'Dépublier' : 'Publier'}
                      </button>
                    </form>
                    <form action={supprimerAnnonce}>
                      <input type="hidden" name="id" value={a.id} />
                      <button type="submit" className="text-xs text-red-600 hover:underline">Supprimer</button>
                    </form>
                  </div>
                </div>
              ))}

              <form action={creerAnnonce} className="space-y-2 pt-2">
                <input type="hidden" name="partenaireId" value={p.id} />
                <input name="title" placeholder="Titre de l'annonce" required className="w-full rounded border p-1.5 text-sm" />
                <EditeurFormatte name="content" placeholder="Contenu de l'annonce" rows={3} required />
                <input type="file" name="image" accept="image/*" className="text-xs" />
                <label className="flex items-center gap-2 text-xs">
                  <input type="checkbox" name="publier" /> Publier immédiatement
                </label>
                <button type="submit" className="rounded bg-gray-200 px-3 py-1 text-xs hover:bg-gray-300">
                  Ajouter l'annonce
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}