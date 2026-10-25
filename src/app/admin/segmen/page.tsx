"use client";

import { ResourceEditor } from "@/components/admin/resource-editor";

export default function AdminSegmenPage() {
  return (
    <ResourceEditor
      config={{
        model: "segment",
        title: "Segmen Klien",
        description:
          "Empat kartu segmen klien: perseorangan, kontraktor, perusahaan, dan instansi. Poin keunggulan tiap segmen bisa ditambah/dikurangi.",
        titleField: "title",
        subtitleField: "subtitle",
        iconField: "icon",
        fields: [
          { key: "title", label: "Judul Segmen", type: "text" },
          { key: "subtitle", label: "Subjudul", type: "text" },
          { key: "icon", label: "Ikon", type: "icon" },
          { key: "pointsJson", label: "Poin Keunggulan", type: "list", placeholder: "cth. Minimal order ramah: mulai 1 pickup" },
          { key: "order", label: "Urutan", type: "number", half: true },
          { key: "visible", label: "Tampilkan di Website", type: "switch", half: true },
        ],
      }}
    />
  );
}
