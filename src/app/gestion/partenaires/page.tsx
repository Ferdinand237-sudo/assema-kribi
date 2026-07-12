import { requireModuleManager } from '@/lib/auth/guards'
import {
  creerPartenaire,
  supprimerPartenaire,
  creerAnnonce,
  togglePublicationAnnonce,
  supprimerAnnonce,
} from './actions'
import EditeurFormatte from '@/components/editeur-formatte'
import BoutonConfirmation from '@/components/bouton-confirmation'

export const dynamic = 'force-dynamic'

export default async function PageGestionPartenaires() {
  const { supabase } = await requireModuleManager('partenaires')

  const { data: partenaires } = await supabase
    .from('partenaires')
    .select('id, nom, logo_url, description, lien, annonces_partenaires(id, title, status, image_url, created_at)')
    .order('created_at', { ascending: false })

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-6 font-display text-2xl font-semibold text-encre sm:text-3xl">Gestion des partenaires</h1>

      <form action={creerPartenaire} className="cadre mb-10 space-y-3 border border-black/10 bg-white p-4 pt-5 shadow-sm">
        <h2 className="font-semibold text-encre">Nouveau partenaire</h2>
        <input name="nom" placeholder="Nom du partenaire" required className="champ" />
        <textarea name="description" placeholder="Description" rows={2} className="champ" />
        <input name="lien" type="url" placeholder="Site web (https://...)" className="champ" />
        <div>
          <label className="mb-1 block text-xs text-encre/60">Logo</label>
          <input type="file" name="logo" accept="image/*" className="champ-fichier" />
        </div>
        <button type="submit" className="bouton bouton-primaire">
          Ajouter
        </button>
      </form>

      <div className="space-y-6">
        {partenaires?.map((p: any) => (
          <div key={p.id} className="cadre border border-black/5 bg-white p-4 pt-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {p.logo_url && <img src={p.logo_url} alt="" className="h-10 w-10 object-contain" />}
                <div>
                  <p className="font-semibold text-encre">{p.nom}</p>
                  {p.description && <p className="text-xs text-encre/60">{p.description}</p>}
                </div>
              </div>
              <div className="flex gap-3">
                <a href={`/gestion/partenaires/${p.id}`} className="text-xs font-medium text-primaire hover:underline">Modifier</a>
                <form action={supprimerPartenaire}>
                  <input type="hidden" name="id" value={p.id} />
                  <BoutonConfirmation message={`Supprimer définitivement le partenaire "${p.nom}" et ses annonces ?`} className="text-xs text-erreur hover:underline">
                    Supprimer
                  </BoutonConfirmation>
                </form>
              </div>
            </div>

            {/* Annonces de ce partenaire */}
            <div className="ml-4 space-y-2 border-l border-black/10 pl-4">
              <p className="text-xs font-medium text-encre/60">Annonces</p>
              {(p.annonces_partenaires ?? []).map((a: any) => (
                <div key={a.id} className="flex items-center justify-between rounded-lg bg-fond-clair p-2 text-sm">
                  <span className="text-encre/85">
                    {a.title}{' '}
                    <span className={`badge-statut ${a.status === 'published' ? 'badge-succes' : 'badge-neutre'}`}>
                      {a.status === 'published' ? 'Publiée' : 'Brouillon'}
                    </span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <a href={`/gestion/partenaires/annonces/${a.id}`} className="text-xs font-medium text-primaire hover:underline">
                      Modifier
                    </a>
                    <form action={togglePublicationAnnonce}>
                      <input type="hidden" name="id" value={a.id} />
                      <input type="hidden" name="nouveauStatut" value={a.status === 'published' ? 'draft' : 'published'} />
                      <button type="submit" className="text-xs font-medium text-primaire hover:underline">
                        {a.status === 'published' ? 'Dépublier' : 'Publier'}
                      </button>
                    </form>
                    <form action={supprimerAnnonce}>
                      <input type="hidden" name="id" value={a.id} />
                      <BoutonConfirmation message={`Supprimer définitivement l'annonce "${a.title}" ?`} className="text-xs text-erreur hover:underline">
                        Supprimer
                      </BoutonConfirmation>
                    </form>
                  </div>
                </div>
              ))}

              <form action={creerAnnonce} className="space-y-2 pt-2">
                <input type="hidden" name="partenaireId" value={p.id} />
                <input name="title" placeholder="Titre de l'annonce" required className="champ !py-1.5 text-sm" />
                <EditeurFormatte name="content" placeholder="Contenu de l'annonce" rows={3} required />
                <input type="file" name="image" accept="image/*" className="champ-fichier" />
                <label className="flex items-center gap-2 text-xs text-encre/85">
                  <input type="checkbox" name="publier" className="accent-primaire" /> Publier immédiatement
                </label>
                <button type="submit" className="bouton bouton-secondaire !py-1.5 text-xs">
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