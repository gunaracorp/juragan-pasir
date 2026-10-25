"use client";

import { ResourceEditor } from "@/components/admin/resource-editor";

export default function AdminTestimoniPage() {
  return (
    <ResourceEditor
      config={{
        model: "testimonial",
        title: "Testimoni Klien",
        description:
          "Ulasan klien yang membangun kepercayaan. Rating bintang 1–5 dan nama inisial otomatis tampil di kartu testimoni.",
        titleField: "name",
        subtitleField: "role",
        fields: [
          { key: "name", label: "Nama Klien", type: "text", half: true },
          { key: "initials", label: "Inisial Avatar", type: "text", half: true, placeholder: "cth. BS (maks 4 huruf)" },
          { key: "role", label: "Peran / Lokasi", type: "text", placeholder: "cth. Project Manager — CV Karya Beton" },
          { key: "rating", label: "Rating Bintang", type: "rating", half: true },
          { key: "order", label: "Urutan", type: "number", half: true },
          { key: "text", label: "Isi Testimoni", type: "textarea" },
          { key: "visible", label: "Tampilkan di Website", type: "switch", half: true },
        ],
      }}
    />
  );
}
