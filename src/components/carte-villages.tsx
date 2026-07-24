'use client'

import dynamic from 'next/dynamic'

const CarteVillagesLeaflet = dynamic(() => import('./carte-villages-leaflet'), {
  ssr: false,
  loading: () => <div className="h-72 w-full animate-pulse rounded-lg bg-fond-clair sm:h-96" />,
})

type Village = { id: string; nom: string; latitude: number; longitude: number }

export default function CarteVillages({ villages }: { villages: Village[] }) {
  return <CarteVillagesLeaflet villages={villages} />
}
