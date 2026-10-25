"use client";

import { MapPin } from "lucide-react";
<<<<<<< HEAD
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import type { CmsRegion, CmsSection } from "@/lib/cms-types";

/**
 * JANGKAUAN WILAYAH — pulau & kota dari CMS (local SEO entity coverage).
 */
export function Coverage({
  regions,
  section,
}: {
  regions: CmsRegion[];
  section?: CmsSection;
}) {
=======
import { REGIONS } from "@/lib/juragan-data";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

/**
 * JANGKAUAN WILAYAH
 * Peta liputan berbasis daftar kota = sinyal SEO lokal yang kuat
 * (local SEO entity coverage) sekaligus bukti kapabilitas nasional.
 */
export function Coverage() {
>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f
  return (
    <section id="jangkauan" aria-labelledby="judul-jangkauan" className="sand-dots scroll-mt-24 bg-cream-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
<<<<<<< HEAD
          eyebrow={section?.eyebrow || "Jangkauan Pengiriman"}
          title={section?.heading || "34 Provinsi,"}
          highlight={section?.highlight || "Satu Rantai Pasok"}
          description={section?.description}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {regions.map((r, i) => (
            <Reveal key={r.id} delay={(i % 3) * 0.07}>
=======
          eyebrow="Jangkauan Pengiriman"
          title="34 Provinsi,"
          highlight="Satu Rantai Pasok"
          description="Dari Jabodetabek sampai Papua: armada darat, kereta angkut, dan kapal laut kami kombinasikan agar pasir sampai ke mana pun proyek Anda berdiri."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {REGIONS.map((r, i) => (
            <Reveal key={r.island} delay={(i % 3) * 0.07}>
>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f
              <article className="h-full rounded-2xl border border-line bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/50 hover:shadow-lift">
                <h3 className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight text-ink-900">
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-night-800"
                  >
                    <MapPin className="h-4 w-4 text-gold-400" />
                  </span>
                  {r.island}
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2" aria-label={`Kota di ${r.island}`}>
                  {r.cities.map((c) => (
                    <li
                      key={c}
                      className="rounded-full border border-line bg-cream-50 px-3 py-1 text-xs font-semibold text-ink-700"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.12}>
          <p className="mt-10 text-center text-sm font-medium text-ink-500">
            Kota Anda belum tercantum?{" "}
            <a
              href="#penawaran"
              className="font-bold text-gold-700 underline decoration-gold-500 decoration-2 underline-offset-4 transition-colors hover:text-gold-600"
            >
              Tanyakan kemampuan kirimnya
            </a>{" "}
            — jaringan mitra logistik kami terus bertambah.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
