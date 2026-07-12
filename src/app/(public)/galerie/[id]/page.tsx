import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ZoomableImage from '@/components/zoomable-image'

export const dynamic = 'force-dynamic'

export default async function PageAlbum({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: album } = await supabase
    .from('galerie_albums')
    .select('id, nom, description, galerie_medias(id, url, type)')
    .eq('id', id)
    .single()

  if (!album) notFound()

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <a href="/galerie" className="text-xs font-medium text-primaire hover:underline">← Galerie média</a>
      <h1 className="mb-1 mt-2 font-display text-3xl font-semibold text-encre">{album.nom}</h1>
      {album.description && <p className="mb-8 text-encre/70">{album.description}</p>}

      {album.galerie_medias?.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(album.galerie_medias as any[]).map((media) => (
            <div key={media.id} className="overflow-hidden rounded-lg border border-black/5">
              {media.type === 'video' ? (
                <video src={media.url} controls className="h-40 w-full object-cover" />
              ) : (
                <ZoomableImage src={media.url} alt="" className="h-40 w-full object-cover" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-encre/60">Aucun média dans cet album pour le moment.</p>
      )}
    </div>
  )
}
