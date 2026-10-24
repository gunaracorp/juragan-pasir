"use client";

import { MapPin } from "lucide-react";
import { REGIONS } from "@/lib/juragan-data";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

/**
 * JANGKAUAN WILAYAH
 * Peta liputan berbasis daftar kota = sinyal SEO lokal yang kuat
 * (local SEO entity coverage) sekaligus bukti kapabilitas nasional.
 */
export function Coverage() {
  return (
    <section id="jangkauan" aria-labelledby="judul-jangkauan" className="sand-dots scroll-mt-24 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Jangkauan Pengiriman"
          title="34 Provinsi,"
          highlight="Satu Rantai Pasok"
          description="Dari Jabodetabek sampai Papua: armada darat, kereta angkut, dan kapal laut kami kombinasikan agar pasir sampai ke mana pun proyek Anda berdiri."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {REGIONS.map((r, i) => (
            <Reveal key={r.island} delay={(i % 3) * 0.07}>
              <article className="h-full rounded-2xl border border-stone-200/80 bg-card p-6 shadow-sm transition-all duration-300 hover:border-amber-500/40 hover:shadow-lg">
                <h3 className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-stone-900">
                  <MapPin className="h-5 w-5 text-amber-600" aria-hidden="true" />
                  {r.island}
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2" aria-label={`Kota di ${r.island}`}>
                  {r.cities.map((c) => (
                    <li
                      key={c}
                      className="rounded-full border border-stone-200 bg-secondary px-3 py-1 text-xs font-semibold text-stone-700"
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
          <p className="mt-10 text-center text-sm font-medium text-stone-600">
            Kota Anda belum tercantum?{" "}
            <a
              href="#penawaran"
              className="font-bold text-amber-700 underline decoration-amber-400 decoration-2 underline-offset-4 transition-colors hover:text-amber-600"
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
