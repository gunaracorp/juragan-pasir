import type { Metadata, Viewport } from "next";
import { Geist_Mono, Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
<<<<<<< HEAD
import { getCmsContent } from "@/lib/cms-content";

/* Sans modern untuk teks — keterbacaan maksimal di semua perangkat */
=======
import { SITE, buildSchema } from "@/lib/juragan-data";

>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

/* Serif kelas dunia untuk judul — identitas merek mewah & tepercaya */
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

<<<<<<< HEAD
export async function generateMetadata(): Promise<Metadata> {
  try {
    const { settings } = await getCmsContent();
    return {
      metadataBase: new URL(settings.domain),
      title: {
        default: settings.seo.title,
        template: `%s | ${settings.siteName}`,
      },
      description: settings.seo.description,
      authors: [{ name: settings.legalName, url: settings.domain }],
      creator: settings.legalName,
      publisher: settings.legalName,
      category: "Material Konstruksi",
      icons: { icon: "/icon.svg" },
    };
  } catch {
    return { title: "Juragan Pasir Galunggung" };
  }
}

export const viewport: Viewport = {
  themeColor: "#021710",
=======
export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: {
    default:
      "Juragan Pasir Galunggung — Pasir Terbaik di Dunia dari Gunung Galunggung, Tasikmalaya",
    template: "%s | Juragan Pasir Galunggung",
  },
  description: SITE.description,
  keywords: [
    "pasir galunggung",
    "pasir gunung galunggung",
    "jual pasir galunggung",
    "harga pasir galunggung",
    "pasir galunggung terbaik di dunia",
    "pasir tasikmalaya",
    "supplier pasir tasikmalaya",
    "pasir vulkanik",
    "pasir terbaik di dunia",
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
    "distributor pasir",
    "agen pasir galunggung",
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
    title: "Juragan Pasir Galunggung — Pasir Terbaik di Dunia dari Gunung Galunggung, Tasikmalaya",
    description:
      "Pasir vulkanik asli lereng Gunung Galunggung, Tasikmalaya. Dari perseorangan hingga instansi: pasir cor, urug, pasang, halus & silika, harga transparan, kirim ke 34 provinsi. Minta penawaran via WhatsApp hari ini.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Juragan Pasir Galunggung — Pasir Terbaik di Dunia",
    description:
      "Pasir vulkanik asli Gunung Galunggung, Tasikmalaya. Semua kalangan kami layani: perseorangan sampai organisasi. Harga transparan, kirim ke 34 provinsi.",
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
  themeColor: "#03231b",
>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
<<<<<<< HEAD
=======
  const schemas = buildSchema();
>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${jakarta.variable} ${playfair.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
<<<<<<< HEAD
        {children}
        <Toaster />
=======
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
>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f
      </body>
    </html>
  );
}
