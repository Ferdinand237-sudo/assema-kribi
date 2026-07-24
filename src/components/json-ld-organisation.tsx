export default function JsonLdOrganisation() {
  const donnees = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ASSEMA — Association des Étudiants Mabi",
    alternateName: "ASSEMA Kribi",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://assema-kribi.netlify.app",
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://assema-kribi.netlify.app"}/logo-assema.jpeg`,
    description:
      "Association communautaire des étudiants originaires de Kribi et du peuple Mabi (Sud Cameroun), au Cameroun comme dans la diaspora.",
    areaServed: {
      "@type": "Place",
      name: "Kribi, Sud Cameroun",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(donnees) }}
    />
  )
}
