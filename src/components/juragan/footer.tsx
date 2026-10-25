import { Clock, Mail, MapPin, Phone } from "lucide-react";
<<<<<<< HEAD
import { Logo } from "./logo";
import { ThemeCredit } from "@/components/cms/theme-credit";
import type { CmsProduct, CmsSettings } from "@/lib/cms-types";

/**
 * FOOTER — navigasi, produk, dan kontak (NAP) dari CMS.
 * Konsisten dengan JSON-LD untuk local SEO.
 */
export function Footer({
  settings,
  products,
}: {
  settings: CmsSettings;
  products: CmsProduct[];
}) {
  const year = 2026; // statis agar hydration aman
  const waLink = `${settings.wa}?text=${encodeURIComponent(settings.waMessage)}`;

  const NAV_LINKS = [
    { href: "#produk", label: "Produk Pasir" },
    { href: "#kalkulator", label: "Kalkulator Pasir" },
    { href: "#segmen", label: "Segmen Klien" },
    { href: "#keunggulan", label: "Keunggulan Kami" },
    { href: "#proses", label: "Alur Pemesanan" },
    { href: "#jangkauan", label: "Jangkauan Wilayah" },
    { href: "#testimoni", label: "Testimoni" },
    { href: "#faq", label: "FAQ" },
  ];
=======
import { PRODUCTS, SITE, WA_DEFAULT_MESSAGE } from "@/lib/juragan-data";
import { Logo } from "./logo";

const NAV_LINKS = [
  { href: "#produk", label: "Produk Pasir" },
  { href: "#kalkulator", label: "Kalkulator Pasir" },
  { href: "#segmen", label: "Segmen Klien" },
  { href: "#keunggulan", label: "Keunggulan Kami" },
  { href: "#proses", label: "Alur Pemesanan" },
  { href: "#jangkauan", label: "Jangkauan Wilayah" },
  { href: "#testimoni", label: "Testimoni" },
  { href: "#faq", label: "FAQ" },
];

export function Footer() {
  const year = 2026; // statis agar hydration aman
  const waLink = `${SITE.wa}?text=${encodeURIComponent(WA_DEFAULT_MESSAGE)}`;
>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f

  return (
    <footer className="grain-texture relative mt-auto bg-night-950 text-white/60">
      <div aria-hidden="true" className="diagonal-lines absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          {/* Kolom brand */}
          <div>
<<<<<<< HEAD
            <Logo inverted name={settings.siteName.toUpperCase()} tagline={settings.tagline} />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/45">
              {settings.footer.about}
=======
            <Logo inverted />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/45">
              Pusat supplier pasir Galunggung — pasir vulkanik asli lereng
              Gunung Galunggung, Tasikmalaya. Melayani perseorangan,
              kontraktor, perusahaan, hingga instansi dengan pengiriman ke 34
              provinsi.
>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f
            </p>
            <div className="mt-6 flex flex-wrap gap-2" aria-label="Sinyal kepercayaan">
              {["Standar SNI", "Garansi Mutu", "Legalitas Lengkap"].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-gold-300"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Navigasi */}
          <nav aria-label="Navigasi footer">
            <h3 className="text-xs font-extrabold uppercase tracking-[0.18em] text-white">
              Jelajahi
            </h3>
            <ul className="mt-5 space-y-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm text-white/45 transition-colors hover:text-gold-300"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Produk */}
          <nav aria-label="Daftar produk">
            <h3 className="text-xs font-extrabold uppercase tracking-[0.18em] text-white">
              Produk Pasir
            </h3>
            <ul className="mt-5 space-y-2.5">
<<<<<<< HEAD
              {products.map((p) => (
=======
              {PRODUCTS.map((p) => (
>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f
                <li key={p.id}>
                  <a
                    href="#produk"
                    className="text-sm text-white/45 transition-colors hover:text-gold-300"
                  >
                    {p.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Kontak / NAP — konsisten dengan JSON-LD untuk local SEO */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-[0.18em] text-white">
              Hubungi Kami
            </h3>
            <address className="mt-5 space-y-4 not-italic">
              <p className="flex items-start gap-3 text-sm text-white/45">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
                <span>
<<<<<<< HEAD
                  {settings.legalName}
                  <br />
                  {settings.address.street}, {settings.address.city}, {settings.address.region}{" "}
                  {settings.address.postal}
=======
                  {SITE.legalName}
                  <br />
                  {SITE.address.street}, {SITE.address.city}, {SITE.address.region}{" "}
                  {SITE.address.postal}
>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f
                </span>
              </p>
              <p className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
                <a
<<<<<<< HEAD
                  href={settings.phoneHref}
                  className="font-bold text-white/85 transition-colors hover:text-gold-300"
                  aria-label={`Telepon ${settings.phone}`}
                >
                  {settings.phone}
=======
                  href={SITE.phoneHref}
                  className="font-bold text-white/85 transition-colors hover:text-gold-300"
                  aria-label={`Telepon ${SITE.phone}`}
                >
                  {SITE.phone}
>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f
                </a>
              </p>
              <p className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
                <a
<<<<<<< HEAD
                  href={`mailto:${settings.email}`}
                  className="text-white/45 transition-colors hover:text-gold-300"
                >
                  {settings.email}
=======
                  href={`mailto:${SITE.email}`}
                  className="text-white/45 transition-colors hover:text-gold-300"
                >
                  {SITE.email}
>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f
                </a>
              </p>
              <p className="flex items-center gap-3 text-sm text-white/45">
                <Clock className="h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
<<<<<<< HEAD
                {settings.hours}
=======
                {SITE.hours}
>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f
              </p>
            </address>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-gold-400 to-gold-600 px-5 py-2.5 text-sm font-bold text-night-950 shadow-lg transition-all hover:-translate-y-0.5"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              Chat WhatsApp Juragan
            </a>
          </div>
        </div>

        {/* Bar bawah */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-white/35">
<<<<<<< HEAD
            {settings.footer.copyright}
          </p>
          <div className="flex flex-col items-center gap-1.5 sm:items-end">
            <p className="text-xs text-white/35">
              Pasir Galunggung — <span className="text-gold-400/80">Terbaik di Dunia</span> — melayani seluruh nusantara.
            </p>
            <ThemeCredit variant="line" />
          </div>
=======
            © {year} {SITE.legalName}. Seluruh hak cipta dilindungi.
          </p>
          <p className="text-xs text-white/35">
            Pasir Galunggung — <span className="text-gold-400/80">Terbaik di Dunia</span> — melayani seluruh nusantara.
          </p>
>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f
        </div>
      </div>
    </footer>
  );
}
