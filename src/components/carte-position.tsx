'use client'

import dynamic from 'next/dynamic'

const CartePositionLeaflet = dynamic(() => import('./carte-position-leaflet'), {
  ssr: false,
  loading: () => <div className="h-56 w-full animate-pulse rounded-lg bg-fond-clair" />,
})

export default function CartePosition(props: {
  latitude?: number | null
  longitude?: number | null
  modifiable?: boolean
}) {
  return <CartePositionLeaflet {...props} />
}
