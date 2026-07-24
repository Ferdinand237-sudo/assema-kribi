'use client'

import { useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, ZoomControl, useMapEvents } from 'react-leaflet'
import type { Map as LeafletMap } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Centre par défaut : Kribi, ancrage géographique de l'association.
const CENTRE_KRIBI: [number, number] = [2.95, 9.9096]

function GestionnaireClic({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export default function CartePositionLeaflet({
  latitude,
  longitude,
  modifiable = false,
}: {
  latitude?: number | null
  longitude?: number | null
  modifiable?: boolean
}) {
  const [position, setPosition] = useState<[number, number] | null>(
    latitude != null && longitude != null ? [latitude, longitude] : null
  )
  const mapRef = useRef<LeafletMap | null>(null)

  if (!modifiable && !position) return null

  function definirPosition(lat: number, lng: number, recentrer = false) {
    setPosition([lat, lng])
    if (recentrer && mapRef.current) {
      mapRef.current.setView([lat, lng], Math.max(mapRef.current.getZoom(), 12))
    }
  }

  return (
    <div>
      {modifiable && (
        <div className="mb-2 grid grid-cols-2 gap-2">
          <input
            type="number"
            step="any"
            inputMode="decimal"
            placeholder="Latitude"
            value={position?.[0] ?? ''}
            onChange={(e) => {
              const lat = parseFloat(e.target.value)
              if (!Number.isNaN(lat)) definirPosition(lat, position?.[1] ?? CENTRE_KRIBI[1], true)
            }}
            className="champ !py-1.5 text-sm"
          />
          <input
            type="number"
            step="any"
            inputMode="decimal"
            placeholder="Longitude"
            value={position?.[1] ?? ''}
            onChange={(e) => {
              const lng = parseFloat(e.target.value)
              if (!Number.isNaN(lng)) definirPosition(position?.[0] ?? CENTRE_KRIBI[0], lng, true)
            }}
            className="champ !py-1.5 text-sm"
          />
        </div>
      )}

      <div className="cadre aspect-[4/3] w-full overflow-hidden border border-black/5 shadow-sm sm:aspect-[16/9]">
        <MapContainer
          ref={mapRef}
          center={position ?? CENTRE_KRIBI}
          zoom={position ? 12 : 8}
          scrollWheelZoom={modifiable}
          zoomControl={false}
          attributionControl={false}
          className="h-full w-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {modifiable && <ZoomControl position="bottomright" />}
          {position && <Marker position={position} />}
          {modifiable && <GestionnaireClic onClick={(lat, lng) => definirPosition(lat, lng)} />}
        </MapContainer>
      </div>

      <div className="mt-1.5 flex items-center justify-between gap-2 text-[11px] text-encre/40">
        <span>
          {modifiable && !position && 'Clique sur la carte, ou saisis les coordonnées'}
          {'© '}
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="hover:underline">
            OpenStreetMap
          </a>
        </span>
        {modifiable && position && (
          <button type="button" onClick={() => setPosition(null)} className="font-medium text-primaire hover:underline">
            Retirer
          </button>
        )}
      </div>

      {modifiable && (
        <>
          <input type="hidden" name="latitude" value={position?.[0] ?? ''} />
          <input type="hidden" name="longitude" value={position?.[1] ?? ''} />
        </>
      )}
    </div>
  )
}
