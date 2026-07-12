import { requireModuleManager } from '@/lib/auth/guards'
import { creerAlbum, supprimerAlbum, ajouterMedias, supprimerMedia } from './actions'

export const dynamic = 'force-dynamic'

export default async function PageGestionGalerie() {
  const { supabase } = await requireModuleManager('galerie')

  const { data: albums } = await supabase
    .from('galerie_albums')
    .select('id, nom, description, galerie_medias(id, url, type)')
    .order('created_at', { ascending: false })

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-6 font-display text-2xl font-semibold text-encre sm:text-3xl">Gestion de la galerie</h1>

      <form action={creerAlbum} className="cadre mb-10 space-y-3 border border-black/10 bg-white p-4 pt-5 shadow-sm">
        <h2 className="font-semibold text-encre">Nouvel album</h2>
        <input name="nom" placeholder="Nom de l'album (ex: Journée culturelle 2025)" required className="champ" />
        <textarea name="description" placeholder="Description" rows={2} className="champ" />
        <button type="submit" className="bouton bouton-primaire">
          Créer
        </button>
      </form>

      <div className="space-y-8">
        {albums?.map((album: any) => (
          <div key={album.id} className="cadre border border-black/5 bg-white p-4 pt-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-encre">{album.nom}</h3>
                {album.description && <p className="text-xs text-encre/60">{album.description}</p>}
              </div>
              <form action={supprimerAlbum}>
                <input type="hidden" name="id" value={album.id} />
                <button type="submit" className="text-xs text-erreur hover:underline">
                  Supprimer l'album
                </button>
              </form>
            </div>

            {(album.galerie_medias ?? []).length > 0 && (
              <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                {album.galerie_medias.map((m: any) => (
                  <div key={m.id} className="group relative overflow-hidden rounded-lg border border-black/10">
                    {m.type === 'video' ? (
                      <video src={m.url} className="h-20 w-full object-cover" />
                    ) : (
                      <img src={m.url} alt="" className="h-20 w-full object-cover" />
                    )}
                    <form action={supprimerMedia} className="absolute right-1 top-1">
                      <input type="hidden" name="id" value={m.id} />
                      <button
                        type="submit"
                        className="rounded bg-erreur px-1.5 text-xs text-white opacity-0 group-hover:opacity-100"
                      >
                        ✕
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            )}

            <form action={ajouterMedias} className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input type="hidden" name="albumId" value={album.id} />
              <input type="file" name="medias" accept="image/*,video/*" multiple className="champ-fichier flex-1" />
              <button type="submit" className="bouton bouton-secondaire !py-1.5">
                Ajouter
              </button>
            </form>
          </div>
        ))}
        {(!albums || albums.length === 0) && (
          <p className="text-sm text-encre/60">Aucun album pour le moment, crée le premier ci-dessus.</p>
        )}
      </div>
    </div>
  )
}