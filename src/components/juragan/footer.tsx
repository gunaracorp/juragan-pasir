import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PRODUCTS, SITE } from "@/lib/juragan-data";
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

  return (
    <footer className="grain-texture relative mt-auto bg-stone-950 text-stone-300">
      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          {/* Kolom brand */}
          <div>
            <Logo inverted />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-stone-400">
              Pusat supplier pasir terbaik se-Indonesia. Melayani perseorangan,
              kontraktor, perusahaan, hingga instansi — dengan mutu terkurasi, harga
              transparan, dan pengiriman ke 34 provinsi.
            </p>
            <div className="mt-6 flex flex-wrap gap-2" aria-label="Sinyal kepercayaan">
              {["Standar SNI", "Garansi Mutu", "Legalitas Lengkap"].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-stone-800 bg-stone-900 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-500"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Navigasi */}
          <nav aria-label="Navigasi footer">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
              Jelajahi
            </h3>
            <ul className="mt-5 space-y-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm text-stone-400 transition-colors hover:text-amber-400"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Produk */}
          <nav aria-label="Daftar produk">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
              Produk Pasir
            </h3>
            <ul className="mt-5 space-y-2.5">
              {PRODUCTS.map((p) => (
                <li key={p.id}>
                  <a
                    href="#produk"
                    className="text-sm text-stone-400 transition-colors hover:text-amber-400"
                  >
                    {p.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Kontak / NAP — konsisten dengan JSON-LD untuk local SEO */}
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
              Hubungi Kami
            </h3>
            <address className="mt-5 space-y-4 not-italic">
              <p className="flex items-start gap-3 text-sm text-stone-400">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
                <span>
                  {SITE.legalName}
                  <br />
                  {SITE.address.street}, {SITE.address.city}, {SITE.address.region}{" "}
                  {SITE.address.postal}
                </span>
              </p>
              <p className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
                <a
                  href={SITE.phoneHref}
                  className="font-bold text-stone-200 transition-colors hover:text-amber-400"
                  aria-label={`Telepon ${SITE.phone}`}
                >
                  {SITE.phone}
                </a>
              </p>
              <p className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-stone-400 transition-colors hover:text-amber-400"
                >
                  {SITE.email}
                </a>
              </p>
              <p className="flex items-center gap-3 text-sm text-stone-400">
                <Clock className="h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
                {SITE.hours}
              </p>
            </address>
          </div>
        </div>

        {/* Bar bawah */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-stone-800/80 pt-8 sm:flex-row">
          <p className="text-xs text-stone-500">
            © {year} {SITE.legalName}. Seluruh hak cipta dilindungi.
          </p>
          <p className="text-xs text-stone-500">
            Juragan Pasir — melayani seluruh nusantara dengan bangga.
          </p>
        </div>
      </div>
    </footer>
  );
}
