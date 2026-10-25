import type { Metadata } from "next";
import { CMS_VERSION } from "@/lib/cms-version";

/** Metadata khusus halaman login (client page tidak bisa export metadata sendiri) */
export const metadata: Metadata = {
  title: `Masuk — CMS v.${CMS_VERSION}`,
  description:
    "Gerbang masuk JURAGAN CORE CMS — panel kendali penuh konten website Juragan Pasir Galunggung.",
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
