'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

type Village = { id: string; nom: string; latitude: number; longitude: number }

export default function CarteVillagesLeaflet({ villages }: { villages: Village[] }) {
  if (villages.length === 0) return null

  const centre: [number, number] = [
    villages.reduce((s, v) => s + v.latitude, 0) / villages.length,
    villages.reduce((s, v) => s + v.longitude, 0) / villages.length,
  ]

  return (
    <div className="cadre h-72 w-full overflow-hidden border border-black/5 shadow-sm sm:h-96">
      <MapContainer center={centre} zoom={9} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {villages.map((v) => (
          <Marker key={v.id} position={[v.latitude, v.longitude]}>
            <Popup>
              <a href={`/culture-mabi/villages/${v.id}`} className="font-medium text-primaire hover:underline">
                {v.nom}
              </a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
