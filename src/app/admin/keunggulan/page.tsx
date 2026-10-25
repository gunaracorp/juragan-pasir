"use client";

import { ResourceEditor } from "@/components/admin/resource-editor";

export default function AdminKeunggulanPage() {
  return (
    <ResourceEditor
      config={{
        model: "whyus",
        title: "Keunggulan Kami",
        description:
          "Kartu nilai jual utama (mutu, harga transparan, armada sendiri, dst.) di section Kenapa Juragan Pasir.",
        titleField: "title",
        subtitleField: "body",
        iconField: "icon",
        fields: [
          { key: "title", label: "Judul Keunggulan", type: "text" },
          { key: "icon", label: "Ikon", type: "icon" },
          { key: "body", label: "Penjelasan", type: "textarea" },
          { key: "order", label: "Urutan", type: "number", half: true },
          { key: "visible", label: "Tampilkan di Website", type: "switch", half: true },
        ],
      }}
    />
  );
}
