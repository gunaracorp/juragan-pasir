"use client";

import { Check, Package } from "lucide-react";
import { PRODUCTS } from "@/lib/juragan-data";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

/**
 * KATALOG PRODUK
 * Swatch warna per jenis pasir = pengkodean visual material (prinsip
 * perceptual grouping): mata langsung membedakan pasir silika vs merah
 * tanpa membaca. Badge menandai produktivitas & posisi premium.
 */
export function Products() {
  return (
    <section id="produk" aria-labelledby="judul-produk" className="sand-dots scroll-mt-24 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Produk Pasir"
          title="Enam Jenis Pasir,"
          highlight="Satu Standar Mutu"
          description="Setiap jenis pasir punya karakter dan kegunaan teknisnya masing-masing. Semua dikurasi di titik muat: disaring, dibersihkan, dan disertai spesifikasi tertulis."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 0.08}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-900/10">
                {/* Header visual swatch */}
                <div
                  aria-hidden="true"
                  className="relative h-20 overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${p.tone} 0%, ${p.tone}CC 55%, #29252400 160%)`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/35 to-transparent" />
                  <div className="absolute bottom-3 left-5 flex items-center gap-2">
                    <Package className="h-4 w-4 text-white/85" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white/90">
                      {p.alias}
                    </span>
                  </div>
                  {p.badge && (
                    <span className="absolute right-4 top-4 rounded-full bg-stone-950/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-400 backdrop-blur">
                      {p.badge}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl font-extrabold tracking-tight text-stone-900">
                    {p.name}
                  </h3>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-stone-600">
                    {p.useCase}
                  </p>

                  <ul className="mt-4 space-y-1.5" aria-label={`Spesifikasi ${p.name}`}>
                    {p.spec.map((s) => (
                      <li key={s} className="flex items-start gap-2 text-sm text-stone-700">
                        <Check
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600"
                          aria-hidden="true"
                        />
                        {s}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4">
                    <p className="text-sm font-bold text-amber-700">{p.price}</p>
                    <a
                      href="#penawaran"
                      className="rounded-md px-3 py-1.5 text-xs font-bold text-stone-700 underline-offset-4 transition-colors hover:bg-secondary hover:text-amber-700 hover:underline"
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

        <Reveal delay={0.1} className="mt-8">
          <p className="mx-auto max-w-3xl text-center text-xs leading-relaxed text-stone-500">
            * Rentang harga adalah estimasi pasar Jabodetabek dan dapat berubah sesuai lokasi
            pengiriman, volume pembelian, serta kondisi stok. Penawaran resmi selalu diberikan
            tertulis sebelum transaksi — tanpa kejutan.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
