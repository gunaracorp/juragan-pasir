"use client";

import { Check, Factory, HardHat, Home, Landmark, type LucideIcon } from "lucide-react";
import { SEGMENTS } from "@/lib/juragan-data";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

const ICONS: Record<string, LucideIcon> = { Home, HardHat, Factory, Landmark };

/**
 * SEGMENTASI KLIEN
 * Diferensiasi spektrum klien: dari individu sampai organisasi besar.
 * Korespondensi ikon = kecepatan pemindaian (scanability). Setiap kartu
 * menjawab satu pertanyaan psikologis pembeli: "apa untungnya untuk saya?"
 */
export function Segments() {
  return (
    <section
      id="segmen"
      aria-labelledby="judul-segmen"
      className="scroll-mt-24 bg-secondary/60 py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Siapa yang Kami Layani"
          title="Semua Kalangan,"
          highlight="Tanpa Kecuali"
          description="Tidak ada order yang terlalu kecil dan tidak ada kontrak yang terlalu besar. Empat segmen, satu standar pelayanan juragan."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {SEGMENTS.map((s, i) => {
            const Icon = ICONS[s.icon] ?? Home;
            return (
              <Reveal key={s.id} delay={(i % 2) * 0.08}>
                <article className="flex h-full flex-col rounded-2xl border border-stone-200/80 bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-900/10 sm:p-8">
                  <div className="flex items-start gap-4">
                    <span
                      aria-hidden="true"
                      className="flex h-13 w-13 shrink-0 items-center justify-center rounded-xl bg-amber-600/10 text-amber-700"
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                    <div>
                      <h3 className="text-xl font-extrabold tracking-tight text-stone-900">
                        {s.title}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-stone-500">{s.subtitle}</p>
                    </div>
                  </div>

                  <ul className="mt-6 flex-1 space-y-3">
                    {s.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-2.5 text-sm text-stone-700">
                        <span
                          aria-hidden="true"
                          className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-emerald-100"
                        >
                          <Check className="h-3 w-3 text-emerald-700" />
                        </span>
                        <span className="leading-relaxed">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
