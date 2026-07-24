import type { Metadata, Viewport } from "next";
import { Fraunces, Work_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import ConditionalFooter from "@/components/conditional-footer";
import JsonLdOrganisation from "@/components/json-ld-organisation";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400"],
});

const DESCRIPTION_SITE =
  "ASSEMA (Association des Étudiants Mabi) — plateforme communautaire des étudiants originaires de Kribi et du Sud Cameroun : culture Mabi, villages (Bikondo, Dombè, Maka'awum...), grandes figures, contes, arts culinaires, projets étudiants et vie associative.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://assema-kribi.netlify.app"),
  title: {
    default: "ASSEMA Kribi",
    template: "%s · ASSEMA Kribi",
  },
  description: DESCRIPTION_SITE,
  keywords: [
    "ASSEMA", "Mabi", "culture Mabi", "peuple Mabi", "Kribi", "Sud Cameroun", "Océan",
    "Kwasio", "Batanga", "Mayi", "Nguma Mabi", "Afan Mabè", "Bikondo", "Maka'awum", "Dombè",
    "crevettes", "Port Autonome de Kribi", "KPIZ", "KCT", "KPDC", "Globeleq", "KEDA", "SNH",
    "jeunesse", "étudiants", "association étudiante",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    siteName: "ASSEMA Kribi",
    locale: "fr_FR",
    type: "website",
    images: ["/logo-assema.jpeg"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/logo-assema.jpeg"],
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/logo-assema.jpeg",
    apple: "/logo-assema.jpeg",
  },
  appleWebApp: {
    capable: true,
    title: "ASSEMA",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#2E9BE0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${fraunces.variable} ${workSans.variable} ${plexMono.variable} antialiased`}>
        <JsonLdOrganisation />
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <ConditionalFooter footer={<SiteFooter />} />
        </div>
      </body>
    </html>
  );
}