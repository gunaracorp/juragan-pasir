"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { Logo } from "./logo";
<<<<<<< HEAD
import { cn } from "@/lib/utils";
import type { CmsSettings } from "@/lib/cms-types";

export type NavLink = { href: string; label: string };

/**
 * HEADER — navigasi dinamis dari CMS.
 * Menu hanya menampilkan section yang visible di Section Manager.
 */
export function Header({ site, nav }: { site: CmsSettings; nav: NavLink[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const waLink = `${site.wa}?text=${encodeURIComponent(site.waMessage)}`;

=======
import { SITE, WA_DEFAULT_MESSAGE } from "@/lib/juragan-data";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "#produk", label: "Produk Pasir" },
  { href: "#kalkulator", label: "Kalkulator" },
  { href: "#segmen", label: "Segmen Klien" },
  { href: "#keunggulan", label: "Keunggulan" },
  { href: "#proses", label: "Proses" },
  { href: "#jangkauan", label: "Jangkauan" },
  { href: "#faq", label: "FAQ" },
];

const WA_LINK = `${SITE.wa}?text=${encodeURIComponent(WA_DEFAULT_MESSAGE)}`;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <div
        className={cn(
          "border-b transition-all duration-300",
          scrolled
            ? "border-white/10 bg-night-950/90 shadow-[0_10px_40px_rgba(2,23,16,0.45)] backdrop-blur-xl"
            : "border-transparent bg-night-950"
        )}
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            href="/"
<<<<<<< HEAD
            aria-label={`${site.siteName} — Beranda`}
            className="shrink-0"
          >
            <Logo inverted name={site.siteName.toUpperCase()} tagline={site.tagline} />
=======
            aria-label={`${SITE.name} — Beranda`}
            className="shrink-0"
          >
            <Logo inverted />
>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f
          </Link>

          <nav aria-label="Navigasi utama" className="hidden lg:block">
            <ul className="flex items-center gap-1">
<<<<<<< HEAD
              {nav.map((item) => (
=======
              {NAV.map((item) => (
>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="rounded-full px-3.5 py-2 text-sm font-semibold text-white/75 transition-colors hover:bg-white/5 hover:text-gold-300"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2.5">
            <a
<<<<<<< HEAD
              href={waLink}
=======
              href={WA_LINK}
>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-full bg-gradient-to-b from-gold-400 to-gold-600 px-5 py-2.5 text-sm font-bold text-night-950 shadow-[0_6px_20px_rgba(189,151,38,0.35)] ring-1 ring-gold-300/60 transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(189,151,38,0.45)] sm:inline-flex"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              Konsultasi Gratis
            </a>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:border-gold-500/50 hover:text-gold-300 lg:hidden"
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? "Tutup menu" : "Buka menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Panel menu mobile */}
        <div
          id="menu-mobile"
          className={cn(
            "overflow-hidden border-white/10 transition-[max-height,opacity] duration-300 lg:hidden",
            open ? "max-h-[30rem] border-t opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <nav
            aria-label="Navigasi seluler"
            className="bg-night-950 px-4 pb-6 pt-3"
          >
            <ul className="flex flex-col">
<<<<<<< HEAD
              {nav.map((item) => (
=======
              {NAV.map((item) => (
>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-3 text-base font-semibold text-white/80 transition-colors hover:bg-white/5 hover:text-gold-300"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li className="mt-3">
                <a
<<<<<<< HEAD
                  href={waLink}
=======
                  href={WA_LINK}
>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-gold-400 to-gold-600 px-5 py-3.5 text-base font-bold text-night-950 shadow-lg"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Konsultasi Gratis via WhatsApp
                </a>
              </li>
              <li className="mt-3 text-center">
                <a
<<<<<<< HEAD
                  href={site.phoneHref}
                  className="text-sm font-bold text-gold-300"
                  aria-label={`Telepon ${site.siteName} di ${site.phone}`}
                >
                  Telepon: {site.phone}
=======
                  href={SITE.phoneHref}
                  className="text-sm font-bold text-gold-300"
                  aria-label={`Telepon ${SITE.name} di ${SITE.phone}`}
                >
                  Telepon: {SITE.phone}
>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
