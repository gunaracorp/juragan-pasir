"use client";

import { ResourceEditor } from "@/components/admin/resource-editor";

export default function AdminFaqPage() {
  return (
    <ResourceEditor
      config={{
        model: "faq",
        title: "FAQ — Tanya Jawab",
        description:
          "Pertanyaan yang sering diajukan. Jawaban yang bagus menurunkan beban CS dan meningkatkan konversi. FAQ juga otomatis masuk struktur JSON-LD untuk SEO.",
        titleField: "question",
        fields: [
          { key: "question", label: "Pertanyaan", type: "text" },
          { key: "answer", label: "Jawaban", type: "textarea" },
          { key: "order", label: "Urutan", type: "number", half: true },
          { key: "visible", label: "Tampilkan di Website", type: "switch", half: true },
        ],
      }}
    />
  );
}
