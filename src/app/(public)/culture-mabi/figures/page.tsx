import { createClient } from '@/lib/supabase/server'
import Reveal from '@/components/reveal'
import ZoomableImage from '@/components/zoomable-image'
import { extraireTexte } from '@/lib/texte'

export const dynamic = 'force-dynamic'

function formaterDate(date: string | null) {
  if (!date) return null
  return new Date(date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default async function PageFiguresMabi() {
  const supabase = await createClient()

  const { data: figures } = await supabase
    .from('figures_mabi')
    .select('id, nom, photo_url, biographie, date_naissance, date_deces, vivant, village')
    .order('nom')

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <a href="/culture-mabi" className="text-xs font-medium text-primaire hover:underline">← Culture Mabi</a>
      <h1 className="mb-2 mt-2 font-display text-3xl font-semibold text-encre">Grandes figures Mabi</h1>
      <p className="mb-8 text-encre/70">Les élites, sages et héros qui ont marqué l'histoire de notre peuple.</p>

      {figures && figures.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {figures.map((f, i) => (
            <Reveal key={f.id} delayMs={i * 80}>
              <a href={`/culture-mabi/figures/${f.id}`} className="carte-interactive block h-full border border-black/5 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  {f.photo_url && <ZoomableImage src={f.photo_url} alt="" className="h-16 w-16 rounded-full object-cover" />}
                  <div>
                    <p className="font-semibold text-encre">{f.nom}</p>
                    <p className="text-xs text-encre/60">
                      {f.village}
                      {f.village && ' · '}
                      <span className={f.vivant ? 'text-succes' : 'text-encre/60'}>
                        {f.vivant ? 'En vie' : 'Décédé(e)'}
                      </span>
                    </p>
                    {(f.date_naissance || f.date_deces) && (
                      <p className="font-mono text-xs text-encre/40">
                        {formaterDate(f.date_naissance)}
                        {!f.vivant && f.date_deces && ` — ${formaterDate(f.date_deces)}`}
                      </p>
                    )}
                  </div>
                </div>
                {f.biographie && <p className="mt-3 line-clamp-2 text-sm text-encre/70">{extraireTexte(f.biographie, 160)}</p>}
                <p className="mt-2 text-xs font-medium text-primaire">Voir la biographie →</p>
              </a>
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="text-sm text-encre/60">Aucune figure enregistrée pour le moment.</p>
      )}
    </div>
  )
}