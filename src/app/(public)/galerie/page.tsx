import { createClient } from '@/lib/supabase/server'
import Reveal from '@/components/reveal'

export const dynamic = 'force-dynamic'

export default async function PageGalerie() {
  const supabase = await createClient()

  const { data: albums } = await supabase
    .from('galerie_albums')
    .select('id, nom, description, galerie_medias(id, url, type)')
    .order('created_at', { ascending: false })

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="mb-1 font-display text-3xl font-semibold text-encre">Galerie média</h1>
      <p className="mb-8 text-encre/70">Les souvenirs en images de la communauté ASSEMA.</p>

      {albums && albums.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-3">
          {albums.map((album: any, i: number) => {
            const couverture = album.galerie_medias?.[0]?.url
            const nbMedias = album.galerie_medias?.length ?? 0
            return (
              <Reveal key={album.id} delayMs={i * 80}>
                <a href={`/galerie/${album.id}`} className="carte-interactive block h-full overflow-hidden border border-black/5 bg-white shadow-sm">
                  {couverture ? (
                    <img src={couverture} alt="" className="h-40 w-full object-cover" />
                  ) : (
                    <div className="flex h-40 w-full items-center justify-center bg-fond-clair text-sm text-encre/40">Aucun média</div>
                  )}
                  <div className="p-4">
                    <h2 className="font-display text-lg font-semibold text-encre">{album.nom}</h2>
                    {album.description && <p className="mt-1 line-clamp-2 text-sm text-encre/70">{album.description}</p>}
                    <p className="mt-2 text-xs font-medium text-primaire">
                      {nbMedias} média{nbMedias > 1 ? 's' : ''} — Voir l'album →
                    </p>
                  </div>
                </a>
              </Reveal>
            )
          })}
        </div>
      ) : (
        <p className="text-sm text-encre/60">Aucun album pour le moment.</p>
      )}
    </div>
  )
}