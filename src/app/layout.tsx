import type { Metadata, Viewport } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SITE, buildSchema } from "@/lib/juragan-data";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: {
    default:
      "Juragan Pasir — Pusat Pasir Terbaik Se-Indonesia | Supplier Pasir Cor, Urug & Silika",
    template: "%s | Juragan Pasir",
  },
  description: SITE.description,
  keywords: [
    "jual pasir",
    "supplier pasir",
    "pusat pasir indonesia",
    "harga pasir cor",
    "pasir murah",
    "toko pasir terpercaya",
    "pasir urug",
    "pasir pasang",
    "pasir halus",
    "pasir silika",
    "pasir bangka",
    "distributor pasir",
    "agen pasir jakarta",
    "pasir jabodetabek",
    "pengiriman pasir seluruh indonesia",
    "supplier pasir kontraktor",
    "pasir untuk renovasi rumah",
    "pasir proyek konstruksi",
    "supplier material konstruksi",
  ],
  authors: [{ name: SITE.legalName, url: SITE.domain }],
  creator: SITE.legalName,
  publisher: SITE.legalName,
  category: "Material Konstruksi",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE.domain,
    siteName: SITE.name,
    title: "Juragan Pasir — Pusat Pasir Terbaik Se-Indonesia",
    description:
      "Dari perseorangan hingga instansi: pasir cor, urug, pasang, halus & silika berkualitas, harga transparan, kirim ke 34 provinsi. Minta penawaran gratis hari ini.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Juragan Pasir — Pusat Pasir Terbaik Se-Indonesia",
    description:
      "Supplier pasir semua kalangan: perseorangan sampai organisasi. Harga transparan, mutu terjamin, kirim ke 34 provinsi.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#1c1917",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schemas = buildSchema();
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${jakarta.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <a
          href="#konten-utama"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Lewati ke konten utama
        </a>
        {children}
        <Toaster />
        {/* Structured data untuk rich results mesin pencari */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
        />
      </body>
    </html>
  );
}
