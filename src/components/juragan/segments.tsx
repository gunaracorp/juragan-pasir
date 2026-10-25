"use client";

<<<<<<< HEAD
import { Check, type LucideIcon } from "lucide-react";
import { getIcon } from "./icon-map";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import type { CmsSection, CmsSegment } from "@/lib/cms-types";

/**
 * SEGMENTASI KLIEN — segmen klien dari CMS dengan ikon dinamis.
 */
export function Segments({
  segments,
  section,
}: {
  segments: CmsSegment[];
  section?: CmsSection;
}) {
=======
import { Check, Factory, HardHat, Home, Landmark, type LucideIcon } from "lucide-react";
import { SEGMENTS } from "@/lib/juragan-data";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

const ICONS: Record<string, LucideIcon> = { Home, HardHat, Factory, Landmark };

/**
 * SEGMENTASI KLIEN
 * Diferensiasi spektrum klien: dari individu sampai organisasi besar.
 * Ikon dalam kotak zamrud + glyph emas = bahasa visual brand. Setiap kartu
 * menjawab satu pertanyaan psikologis pembeli: "apa untungnya untuk saya?"
 */
export function Segments() {
>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f
  return (
    <section
      id="segmen"
      aria-labelledby="judul-segmen"
      className="scroll-mt-24 bg-cream-100 py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
<<<<<<< HEAD
          eyebrow={section?.eyebrow || "Siapa yang Kami Layani"}
          title={section?.heading || "Semua Kalangan,"}
          highlight={section?.highlight || "Tanpa Kecuali"}
          description={section?.description}
        />

        <div className="grid gap-6 md:grid-cols-2">
          {segments.map((s, i) => {
            const Icon = getIcon(s.icon) as LucideIcon;
=======
          eyebrow="Siapa yang Kami Layani"
          title="Semua Kalangan,"
          highlight="Tanpa Kecuali"
          description="Tidak ada order yang terlalu kecil dan tidak ada kontrak yang terlalu besar. Empat segmen, satu standar pelayanan juragan."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {SEGMENTS.map((s, i) => {
            const Icon = ICONS[s.icon] ?? Home;
>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f
            return (
              <Reveal key={s.id} delay={(i % 2) * 0.08}>
                <article className="flex h-full flex-col rounded-2xl border border-line bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-500/50 hover:shadow-lift sm:p-8">
                  <div className="flex items-start gap-4">
                    <span
                      aria-hidden="true"
                      className="flex h-13 w-13 shrink-0 items-center justify-center rounded-xl bg-night-800 shadow-[0_8px_20px_rgba(3,35,27,0.35)]"
                    >
                      <Icon className="h-6 w-6 text-gold-400" strokeWidth={1.8} />
                    </span>
                    <div>
                      <h3 className="font-display text-[1.35rem] font-bold tracking-tight text-ink-900">
                        {s.title}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-ink-500">{s.subtitle}</p>
                    </div>
                  </div>

                  <ul className="mt-6 flex-1 space-y-3">
                    {s.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-2.5 text-sm text-ink-700">
                        <span
                          aria-hidden="true"
                          className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-gold-500/15"
                        >
                          <Check className="h-3 w-3 text-gold-600" strokeWidth={3} />
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
