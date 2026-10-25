"use client";

import { ResourceEditor } from "@/components/admin/resource-editor";

export default function AdminStatistikPage() {
  return (
    <ResourceEditor
      config={{
        model: "stat",
        title: "Statistik Prestasi",
        description:
          "Angka capaian yang dianimasikan CountUp saat halaman dibuka. Target desimal dipakai untuk angka seperti 2,5 jt+ atau 98,6%.",
        titleField: "label",
        iconField: "icon",
        fields: [
          { key: "label", label: "Label Statistik", type: "text", placeholder: "cth. Ton pasir terkirim" },
          { key: "icon", label: "Ikon", type: "icon" },
          { key: "target", label: "Angka Target", type: "float", half: true, hint: "cth. 2.5 atau 12480" },
          { key: "decimals", label: "Jumlah Desimal", type: "number", half: true, hint: "0 = bulat, 1 = 2,5" },
          { key: "suffix", label: "Suffix", type: "text", half: true, placeholder: "cth. jt+ atau %" },
          { key: "order", label: "Urutan", type: "number", half: true },
          { key: "visible", label: "Tampilkan di Website", type: "switch", half: true },
        ],
      }}
    />
  );
}
