import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://assema-kribi.netlify.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin', '/admin/',
        '/gestion', '/gestion/',
        '/messagerie', '/messagerie/',
        '/discussions', '/discussions/',
        '/redaction', '/redaction/',
        '/profil', '/completer-profil',
        '/connexion', '/inscription', '/mot-de-passe-oublie', '/reinitialiser-mot-de-passe',
        '/auth/',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
