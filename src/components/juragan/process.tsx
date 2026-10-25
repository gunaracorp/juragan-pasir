"use client";

import { type LucideIcon } from "lucide-react";
import { getIcon } from "./icon-map";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import type { CmsProcessStep, CmsSection } from "@/lib/cms-types";

/**
 * ALUR PEMESANAN — langkah proses dari CMS dengan ikon dinamis.
 */
export function Process({
  steps,
  section,
}: {
  steps: CmsProcessStep[];
  section?: CmsSection;
}) {
  return (
    <section
      id="proses"
      aria-labelledby="judul-proses"
      className="grain-texture relative scroll-mt-24 bg-night-900 py-24"
    >
      <div aria-hidden="true" className="diagonal-lines absolute inset-0" />
      <div
        aria-hidden="true"
        className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-night-600/40 blur-[120px]"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          dark
          eyebrow={section?.eyebrow || "Alur Kerja"}
          title={section?.heading || "Dari Chat Sampai Pasir Sampai:"}
          highlight={section?.highlight || "Empat Langkah"}
          description={section?.description}
        />

        <ol className="relative mx-auto grid max-w-5xl gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {/* Garis penghubung di desktop */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-8 hidden border-t border-dashed border-gold-500/25 lg:block"
          />
          {steps.map((step, i) => {
            const Icon = getIcon(step.icon) as LucideIcon;
            return (
              <Reveal key={step.id} delay={i * 0.1}>
                <li className="relative">
                  <div className="flex flex-col items-start lg:items-center lg:text-center">
                    <span
                      aria-hidden="true"
                      className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-gold-500/40 bg-night-800 shadow-[0_10px_30px_rgba(2,23,16,0.5)]"
                    >
                      <Icon className="h-6 w-6 text-gold-400" strokeWidth={1.8} />
                      <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-b from-gold-400 to-gold-600 text-[11px] font-extrabold text-night-950 ring-2 ring-night-900">
                        {i + 1}
                      </span>
                    </span>
                    <h3 className="font-display text-lg font-bold tracking-tight text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-white/55">{step.body}</p>
                  </div>
                </li>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
