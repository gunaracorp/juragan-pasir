import type { Metadata, Viewport } from "next";
import { Geist_Mono, Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { getCmsContent } from "@/lib/cms-content";

/* Sans modern untuk teks — keterbacaan maksimal di semua perangkat */
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
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${jakarta.variable} ${playfair.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
