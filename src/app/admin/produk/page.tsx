"use client";

import { ResourceEditor } from "@/components/admin/resource-editor";

export default function AdminProdukPage() {
  return (
    <ResourceEditor
      config={{
        model: "product",
        title: "Produk Pasir",
        description:
          "Katalog 6 jenis pasir yang tampil di frontend. Harga, spesifikasi, badge, dan warna swatch dapat diubah kapan saja.",
        titleField: "name",
        subtitleField: "price",
        iconField: undefined,
        fields: [
          { key: "name", label: "Nama Produk", type: "text", placeholder: "cth. Pasir Galunggung Cor" },
          { key: "alias", label: "Alias / Kategori", type: "text", half: true, placeholder: "cth. Agregat halus vulkanik" },
          { key: "price", label: "Label Harga", type: "text", half: true, placeholder: "cth. Rp 330–390 ribu / m³" },
          { key: "badge", label: "Badge (opsional)", type: "text", half: true, placeholder: "cth. Terbaik di Dunia — kosongkan jika tak perlu" },
          { key: "tone", label: "Warna Swatch", type: "color", half: true },
          { key: "calcBase", label: "Harga Dasar Kalkulator (ribu Rp)", type: "float", half: true, hint: "Dipakai kalkulator pasir untuk estimasi biaya" },
          { key: "calcUnit", label: "Satuan Kalkulator", type: "text", half: true, placeholder: "m3 atau ton" },
          { key: "useCase", label: "Deskripsi Penggunaan", type: "textarea" },
          { key: "specJson", label: "Spesifikasi (poin-poin)", type: "list", placeholder: "cth. Kadar lumpur < 3%" },
          { key: "order", label: "Urutan", type: "number", half: true },
          { key: "visible", label: "Tampilkan di Website", type: "switch", half: true },
        ],
      }}
    />
  );
}
