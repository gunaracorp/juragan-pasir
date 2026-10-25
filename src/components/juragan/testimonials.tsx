"use client";

import { Quote, Star } from "lucide-react";
<<<<<<< HEAD
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import type { CmsSection, CmsTestimonial } from "@/lib/cms-types";

/**
 * TESTIMONI — ulasan klien dari CMS.
 */
export function Testimonials({
  testimonials,
  section,
}: {
  testimonials: CmsTestimonial[];
  section?: CmsSection;
}) {
=======
import { TESTIMONIALS } from "@/lib/juragan-data";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

export function Testimonials() {
>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f
  return (
    <section
      id="testimoni"
      aria-labelledby="judul-testimoni"
      className="scroll-mt-24 bg-cream-100 py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
<<<<<<< HEAD
          eyebrow={section?.eyebrow || "Kata Mereka"}
          title={section?.heading || "Kepercayaan yang Terbangun"}
          highlight={section?.highlight || "Ritase demi Ritase"}
          description={section?.description}
        />

        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delay={(i % 2) * 0.08}>
=======
          eyebrow="Kata Mereka"
          title="Kepercayaan yang Terbangun"
          highlight="Ritase demi Ritase"
          description="Rating 4,9/5 dari 1.248 ulasan terverifikasi. Berikut suara asli dari tiap segmen klien kami."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={(i % 2) * 0.08}>
>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f
              <figure className="flex h-full flex-col rounded-2xl border border-line bg-card p-7 shadow-soft transition-shadow hover:shadow-lift sm:p-8">
                <div className="flex items-center justify-between">
                  <Quote
                    aria-hidden="true"
                    className="h-7 w-7 text-gold-500/80"
                    strokeWidth={1.5}
                  />
                  <div
                    className="flex items-center gap-0.5"
                    aria-label={`Penilaian ${t.rating} dari 5 bintang`}
                  >
                    {Array.from({ length: t.rating }).map((_, s) => (
                      <Star
                        key={s}
                        aria-hidden="true"
                        className="h-4 w-4 fill-gold-500 text-gold-500"
                      />
                    ))}
                  </div>
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-700">
                  &ldquo;{t.text}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-night-800 text-sm font-extrabold text-gold-300"
                  >
                    {t.initials}
                  </span>
                  <span>
                    <span className="block font-display text-[15px] font-bold text-ink-900">
                      {t.name}
                    </span>
                    <span className="block text-xs font-medium text-ink-500">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
