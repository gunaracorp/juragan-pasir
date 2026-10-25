"use client";

import { ResourceEditor } from "@/components/admin/resource-editor";

export default function AdminProsesPage() {
  return (
    <ResourceEditor
      config={{
        model: "process",
        title: "Alur Pemesanan",
        description:
          "Langkah-langkah dari konsultasi sampai pasir tiba. Nomor urut langkah digambar otomatis sesuai urutan daftar.",
        titleField: "title",
        subtitleField: "body",
        iconField: "icon",
        fields: [
          { key: "title", label: "Judul Langkah", type: "text" },
          { key: "icon", label: "Ikon", type: "icon" },
          { key: "body", label: "Penjelasan", type: "textarea" },
          { key: "order", label: "Urutan", type: "number", half: true },
          { key: "visible", label: "Tampilkan di Website", type: "switch", half: true },
        ],
      }}
    />
  );
}
