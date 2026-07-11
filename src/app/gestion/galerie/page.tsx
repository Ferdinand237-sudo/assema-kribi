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
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Gestion de la galerie</h1>

      <form action={creerAlbum} className="mb-10 space-y-3 rounded border p-4">
        <h2 className="font-semibold">Nouvel album</h2>
        <input name="nom" placeholder="Nom de l'album (ex: Journée culturelle 2025)" required className="w-full rounded border p-2" />
        <textarea name="description" placeholder="Description" rows={2} className="w-full rounded border p-2" />
        <button type="submit" className="rounded bg-primaire px-4 py-2 text-sm text-white hover:bg-primaire-fonce">
          Créer
        </button>
      </form>

      <div className="space-y-8">
        {albums?.map((album: any) => (
          <div key={album.id} className="rounded border p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{album.nom}</h3>
                {album.description && <p className="text-xs text-gray-500">{album.description}</p>}
              </div>
              <form action={supprimerAlbum}>
                <input type="hidden" name="id" value={album.id} />
                <button type="submit" className="text-xs text-red-600 hover:underline">
                  Supprimer l'album
                </button>
              </form>
            </div>

            {(album.galerie_medias ?? []).length > 0 && (
              <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                {album.galerie_medias.map((m: any) => (
                  <div key={m.id} className="group relative overflow-hidden rounded border">
                    {m.type === 'video' ? (
                      <video src={m.url} className="h-20 w-full object-cover" />
                    ) : (
                      <img src={m.url} alt="" className="h-20 w-full object-cover" />
                    )}
                    <form action={supprimerMedia} className="absolute right-1 top-1">
                      <input type="hidden" name="id" value={m.id} />
                      <button
                        type="submit"
                        className="rounded bg-red-600 px-1.5 text-xs text-white opacity-0 group-hover:opacity-100"
                      >
                        ✕
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            )}

            <form action={ajouterMedias} className="flex items-center gap-2">
              <input type="hidden" name="albumId" value={album.id} />
              <input type="file" name="medias" accept="image/*,video/*" multiple className="flex-1 text-sm" />
              <button type="submit" className="rounded bg-gray-200 px-3 py-1.5 text-sm hover:bg-gray-300">
                Ajouter
              </button>
            </form>
          </div>
        ))}
        {(!albums || albums.length === 0) && (
          <p className="text-sm text-gray-500">Aucun album pour le moment, crée le premier ci-dessus.</p>
        )}
      </div>
    </div>
  )
}