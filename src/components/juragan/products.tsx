"use client";

import { Check, Package } from "lucide-react";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import type { CmsProduct, CmsSection } from "@/lib/cms-types";

/**
 * KATALOG PRODUK — data dari CMS: nama, alias, badge, spesifikasi, harga,
 * swatch warna. Menampilkan hanya produk visible dari admin.
 */
export function Products({
  products,
  section,
}: {
  products: CmsProduct[];
  section?: CmsSection;
}) {
  return (
    <section id="produk" aria-labelledby="judul-produk" className="sand-dots scroll-mt-24 bg-cream-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={section?.eyebrow || "Produk Pasir"}
          title={section?.heading || "Enam Jenis Pasir,"}
          highlight={section?.highlight || "Satu Standar Mutu"}
          description={section?.description}
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 0.08}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-500/50 hover:shadow-lift">
                {/* Header visual swatch */}
                <div
                  aria-hidden="true"
                  className="relative h-24 overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${p.tone} 0%, ${p.tone}CC 55%, #fbf9f200 160%)`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-night-950/40 to-transparent" />
                  <div className="absolute bottom-3.5 left-5 flex items-center gap-2">
                    <Package className="h-4 w-4 text-white/85" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/90">
                      {p.alias}
                    </span>
                  </div>
                  {p.badge ? (
                    <span className="absolute right-4 top-4 rounded-full bg-night-950/85 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-gold-300 ring-1 ring-gold-500/40 backdrop-blur">
                      {p.badge}
                    </span>
                  ) : null}
                </div>

                <div className="flex flex-1 flex-col p-7">
                  <h3 className="font-display text-[1.35rem] font-bold tracking-tight text-ink-900">
                    {p.name}
                  </h3>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink-500">
                    {p.useCase}
                  </p>

                  <ul className="mt-5 space-y-2" aria-label={`Spesifikasi ${p.name}`}>
                    {p.spec.map((s) => (
                      <li key={s} className="flex items-start gap-2.5 text-sm text-ink-700">
                        <span
                          aria-hidden="true"
                          className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gold-500/15"
                        >
                          <Check className="h-2.5 w-2.5 text-gold-600" strokeWidth={3} />
                        </span>
                        {s}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
                    <p className="font-display text-base font-bold text-gold-700">{p.price}</p>
                    <a
                      href="#penawaran"
                      className="rounded-full px-3.5 py-1.5 text-xs font-bold text-ink-700 underline-offset-4 transition-colors hover:bg-gold-500/10 hover:text-gold-700 hover:underline"
                      aria-label={`Minta harga ${p.name}`}
                    >
                      Minta harga →
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-9">
          <p className="mx-auto max-w-3xl text-center text-xs leading-relaxed text-ink-400">
            * Rentang harga adalah estimasi pasar Jabodetabek dan dapat berubah sesuai lokasi
            pengiriman, volume pembelian, serta kondisi stok. Penawaran resmi selalu diberikan
            tertulis sebelum transaksi — tanpa kejutan.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
