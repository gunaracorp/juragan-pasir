"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { SITE } from "@/lib/juragan-data";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "#produk", label: "Produk Pasir" },
  { href: "#kalkulator", label: "Kalkulator" },
  { href: "#segmen", label: "Segmen Klien" },
  { href: "#keunggulan", label: "Keunggulan" },
  { href: "#jangkauan", label: "Jangkauan" },
  { href: "#faq", label: "FAQ" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* Bar utilitas atas: jam operasional & telepon — sinyal kepercayaan + local SEO */}
      <div className="hidden bg-violet-950 text-violet-200/80 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1.5 text-xs">
          <p className="tracking-wide">Jam operasional: {SITE.hours}</p>
          <div className="flex items-center gap-5">
            <a
              href={SITE.phoneHref}
              className="flex items-center gap-1.5 font-semibold text-violet-300 transition-colors hover:text-violet-200"
              aria-label={`Telepon ${SITE.name}`}
            >
              <Phone className="h-3 w-3" aria-hidden="true" />
              {SITE.phone}
            </a>
            <span aria-hidden="true" className="text-violet-800">
              |
            </span>
            <span>Pasir Galunggung — Kirim ke 34 Provinsi</span>
          </div>
        </div>
      </div>

      {/* Bar navigasi utama */}
      <div
        className={cn(
          "border-b transition-all duration-300",
          scrolled
            ? "border-violet-100 bg-background/90 shadow-[0_8px_30px_rgba(46,16,101,0.10)] backdrop-blur-md"
            : "border-transparent bg-background"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" aria-label={`${SITE.name} — Beranda`} className="shrink-0">
            <Logo />
          </Link>

          <nav aria-label="Navigasi utama" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-secondary hover:text-violet-950"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              asChild
              className="hidden bg-violet-600 font-bold text-white shadow-sm transition-all hover:bg-violet-700 hover:shadow-md sm:inline-flex"
            >
              <a href="#penawaran">Minta Penawaran</a>
            </Button>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-violet-200 text-slate-800 transition-colors hover:bg-secondary lg:hidden"
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
            "overflow-hidden border-violet-100 transition-[max-height,opacity] duration-300 lg:hidden",
            open ? "max-h-96 border-t opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <nav aria-label="Navigasi seluler" className="bg-background px-4 pb-5 pt-2">
            <ul className="flex flex-col">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-3 text-base font-semibold text-slate-800 transition-colors hover:bg-secondary"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li className="mt-2">
                <Button
                  asChild
                  className="w-full bg-violet-600 font-bold text-white hover:bg-violet-700"
                >
                  <a href="#penawaran" onClick={() => setOpen(false)}>
                    Minta Penawaran Gratis
                  </a>
                </Button>
              </li>
              <li className="mt-2 text-center">
                <a
                  href={SITE.phoneHref}
                  className="text-sm font-bold text-violet-700"
                  aria-label={`Telepon ${SITE.name} di ${SITE.phone}`}
                >
                  Telepon / WhatsApp: {SITE.phone}
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
