"use client";

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
  return (
    <section id="keunggulan" aria-labelledby="judul-keunggulan" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Kenapa Juragan Pasir"
          title="Alasan Klien Balik Lagi"
          highlight="dan Lagi"
          description="Kami tidak sekadar menjual pasir — kami mengelola rantai pasok material agar proyek Anda tidak pernah berhenti karena kekurangan agregat."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={(i % 3) * 0.08}>
              <article className="group h-full rounded-2xl border border-stone-200/80 bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-900/10">
                <span
                  aria-hidden="true"
                  className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-stone-900 text-amber-400 transition-colors duration-300 group-hover:bg-amber-600 group-hover:text-white"
                >
                  <v.icon className="h-6 w-6" />
                </span>
                <h3 className="text-lg font-extrabold tracking-tight text-stone-900">
                  {v.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-stone-600">{v.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
