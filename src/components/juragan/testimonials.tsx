"use client";

import { Quote, Star } from "lucide-react";
import { TESTIMONIALS } from "@/lib/juragan-data";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

export function Testimonials() {
  return (
    <section
      id="testimoni"
      aria-labelledby="judul-testimoni"
      className="scroll-mt-24 bg-secondary/60 py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Kata Mereka"
          title="Kepercayaan yang Terbangun"
          highlight="Ritase demi Ritase"
          description="Rating 4,9/5 dari 1.248 ulasan terverifikasi. Berikut suara asli dari tiap segmen klien kami."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={(i % 2) * 0.08}>
              <figure className="flex h-full flex-col rounded-2xl border border-stone-200/80 bg-card p-7 shadow-sm transition-shadow hover:shadow-lg sm:p-8">
                <Quote
                  aria-hidden="true"
                  className="h-7 w-7 text-amber-500/70"
                  strokeWidth={1.5}
                />
                <div
                  className="mt-3 flex items-center gap-0.5"
                  aria-label={`Penilaian ${t.rating} dari 5 bintang`}
                >
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <Star
                      key={s}
                      aria-hidden="true"
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-stone-700">
                  &ldquo;{t.text}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-stone-100 pt-5">
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone-900 text-sm font-extrabold text-amber-400"
                  >
                    {t.initials}
                  </span>
                  <span>
                    <span className="block text-sm font-extrabold text-stone-900">
                      {t.name}
                    </span>
                    <span className="block text-xs font-medium text-stone-500">{t.role}</span>
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
