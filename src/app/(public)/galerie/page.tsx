import { createClient } from '@/lib/supabase/server'
import Reveal from '@/components/reveal'
import ZoomableImage from '@/components/zoomable-image'

export const dynamic = 'force-dynamic'

export default async function PageGalerie() {
  const supabase = await createClient()

  const { data: albums } = await supabase
    .from('galerie_albums')
    .select('id, nom, description, galerie_medias(id, url, type)')
    .order('created_at', { ascending: false })

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="mb-8 font-display text-3xl font-semibold text-encre">Galerie média</h1>

      {albums && albums.length > 0 ? (
        <div className="space-y-10">
          {albums.map((album: any) => (
            <section key={album.id}>
              <h2 className="mb-1 font-display text-xl font-semibold text-encre">{album.nom}</h2>
              {album.description && <p className="mb-3 text-sm text-encre/70">{album.description}</p>}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {(album.galerie_medias ?? []).map((media: any, i: number) => (
                  <Reveal key={media.id} delayMs={(i % 8) * 60}>
                    <div className="carte-interactive overflow-hidden rounded-lg border border-black/5">
                      {media.type === 'video' ? (
                        <video src={media.url} controls className="h-32 w-full object-cover" />
                      ) : (
                        <ZoomableImage src={media.url} alt="" className="h-32 w-full object-cover" />
                      )}
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <p className="text-sm text-encre/60">Aucun album pour le moment.</p>
      )}
    </div>
  )
}