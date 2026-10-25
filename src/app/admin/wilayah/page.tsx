"use client";

import { ResourceEditor } from "@/components/admin/resource-editor";

export default function AdminWilayahPage() {
  return (
    <ResourceEditor
      config={{
        model: "region",
        title: "Wilayah Jangkauan",
        description:
          "Pulau & kota yang terjangkau pengiriman. Menaikkan cakupan lokal (local SEO) — tambah kota baru kapan saja mitra logistik bertambah.",
        titleField: "island",
        fields: [
          { key: "island", label: "Nama Pulau / Wilayah", type: "text", placeholder: "cth. Jawa" },
          { key: "citiesJson", label: "Daftar Kota", type: "list", placeholder: "cth. Bogor" },
          { key: "order", label: "Urutan", type: "number", half: true },
          { key: "visible", label: "Tampilkan di Website", type: "switch", half: true },
        ],
      }}
    />
  );
}
