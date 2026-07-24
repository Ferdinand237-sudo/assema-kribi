'use client'

import { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
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

  if (!modifiable && !position) return null

  return (
    <div>
      <div className="cadre h-56 w-full overflow-hidden border border-black/5 shadow-sm">
        <MapContainer
          center={position ?? CENTRE_KRIBI}
          zoom={position ? 12 : 8}
          scrollWheelZoom={modifiable}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {position && <Marker position={position} />}
          {modifiable && <GestionnaireClic onClick={(lat, lng) => setPosition([lat, lng])} />}
        </MapContainer>
      </div>

      {modifiable && (
        <div className="mt-2 flex items-center justify-between gap-2 text-xs text-encre/60">
          <span>
            {position
              ? `Position : ${position[0].toFixed(5)}, ${position[1].toFixed(5)}`
              : 'Clique sur la carte pour indiquer la position du village'}
          </span>
          {position && (
            <button type="button" onClick={() => setPosition(null)} className="font-medium text-primaire hover:underline">
              Retirer
            </button>
          )}
        </div>
      )}

      {modifiable && (
        <>
          <input type="hidden" name="latitude" value={position?.[0] ?? ''} />
          <input type="hidden" name="longitude" value={position?.[1] ?? ''} />
        </>
      )}
    </div>
  )
}
