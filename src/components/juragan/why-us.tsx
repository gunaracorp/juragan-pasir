"use client";

<<<<<<< HEAD
import { type LucideIcon } from "lucide-react";
import { getIcon } from "./icon-map";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import type { CmsSection, CmsWhyUsItem } from "@/lib/cms-types";

/**
 * KEUNGGULAN KAMI — kartu nilai dari CMS dengan ikon dinamis.
 */
export function WhyUs({
  items,
  section,
}: {
  items: CmsWhyUsItem[];
  section?: CmsSection;
}) {
=======
import {
  BadgePercent,
  FileCheck2,
  FlaskConical,
  Headset,
  Truck,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

const VALUES: {
  icon: LucideIcon;
  title: string;
  body: string;
}[] = [
  {
    icon: FlaskConical,
    title: "Mutu Tersaring & Teruji",
    body: "Setiap pasir disaring dan (untuk grade tertentu) dicuci sebelum dimuat. Kadar lumpur dan modulus kehalusan dicek secara berkala — spesifikasi tertulis melekat di setiap kontrak.",
  },
  {
    icon: BadgePercent,
    title: "Harga Transparan",
    body: "Rincian harga pasir, ongkos angkut, dan pajak dipisah jelas di penawaran. Yang Anda lihat adalah yang Anda bayar — tidak ada biaya kejutan di akhir.",
  },
  {
    icon: Truck,
    title: "Armada Sendiri",
    body: "40+ unit dump truck dari pickup hingga truk besar berarti jadwal tidak bergantung pihak ketiga. Kirim darurat pun bisa kami akali, termasuk akhir pekan.",
  },
  {
    icon: Warehouse,
    title: "Stok Anti Kehabisan",
    body: "Tambak dan gudang di beberapa titik strategis menjaga pasokan tetap mengalir walau musim hujan atau saat permintaan proyek memuncak.",
  },
  {
    icon: Headset,
    title: "Konsultasi Teknis Gratis",
    body: "Bingung pilih pasir cor atau pasir pasang? Tim berpengalaman membantu menghitung dan memilih spesifikasi yang tepat — gratis, tanpa syarat pembelian.",
  },
  {
    icon: FileCheck2,
    title: "Dokumen Lengkap & Resmi",
    body: "NIB, NPWP, invoice pajak, kwitansi, hingga berita acara serah terima. Semua transaksi tertib administrasi — aman untuk audit perusahaan maupun instansi.",
  },
];

export function WhyUs() {
>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f
  return (
    <section id="keunggulan" aria-labelledby="judul-keunggulan" className="scroll-mt-24 bg-cream-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
<<<<<<< HEAD
          eyebrow={section?.eyebrow || "Kenapa Juragan Pasir"}
          title={section?.heading || "Alasan Klien Balik Lagi"}
          highlight={section?.highlight || "dan Lagi"}
          description={section?.description}
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((v, i) => (
            <Reveal key={v.id} delay={(i % 3) * 0.08}>
              <article className="group h-full rounded-2xl border border-line bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-500/50 hover:shadow-lift">
                {(() => {
                  const Icon = getIcon(v.icon) as LucideIcon;
                  return (
                    <span
                      aria-hidden="true"
                      className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-night-800 shadow-[0_8px_20px_rgba(3,35,27,0.35)] transition-transform duration-300 group-hover:-translate-y-1"
                    >
                      <Icon className="h-5.5 w-5.5 text-gold-400" strokeWidth={1.8} />
                    </span>
                  );
                })()}
=======
          eyebrow="Kenapa Juragan Pasir"
          title="Alasan Klien Balik Lagi"
          highlight="dan Lagi"
          description="Kami tidak sekadar menjual pasir — kami mengelola rantai pasok material agar proyek Anda tidak pernah berhenti karena kekurangan agregat."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={(i % 3) * 0.08}>
              <article className="group h-full rounded-2xl border border-line bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-500/50 hover:shadow-lift">
                <span
                  aria-hidden="true"
                  className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-night-800 shadow-[0_8px_20px_rgba(3,35,27,0.35)] transition-transform duration-300 group-hover:-translate-y-1"
                >
                  <v.icon className="h-5.5 w-5.5 text-gold-400" strokeWidth={1.8} />
                </span>
>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f
                <h3 className="font-display text-xl font-bold tracking-tight text-ink-900">
                  {v.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-500">{v.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
