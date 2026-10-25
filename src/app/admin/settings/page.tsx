"use client";

import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ListEditor } from "@/components/admin/resource-editor";
import { Loader2, Save } from "lucide-react";

type Settings = Record<string, string | number>;

const TABS = [
  { key: "identitas", label: "Identitas Brand" },
  { key: "hero", label: "Hero Section" },
  { key: "kontak", label: "Kontak & Alamat" },
  { key: "seo", label: "SEO" },
  { key: "footer", label: "Footer" },
];

type RowDef = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "chips";
  half?: boolean;
  hint?: string;
  placeholder?: string;
};

const ROWS: Record<string, RowDef[]> = {
  identitas: [
    { key: "siteName", label: "Nama Situs", half: true },
    { key: "legalName", label: "Nama Legal (badan usaha)", half: true },
    { key: "domain", label: "Domain", half: true, hint: "Dipakai untuk canonical URL & sitemap" },
    { key: "tagline", label: "Tagline (di bawah logo)", half: true },
    { key: "description", label: "Deskripsi Perusahaan", type: "textarea" },
  ],
  hero: [
    { key: "heroBadge", label: "Badge Atas", half: true, placeholder: "cth. Asli Lereng Gunung Galunggung" },
    { key: "heroStatLabel", label: "Label Statistik Kartu", half: true, placeholder: "cth. Klien Terlayani" },
    { key: "heroTitle1", label: "Judul Baris 1", half: true },
    { key: "heroTitle2", label: "Judul Baris 2 (italic emas)", half: true },
    { key: "heroCta1", label: "Teks Tombol CTA 1", half: true },
    { key: "heroCta2", label: "Teks Tombol CTA 2", half: true },
    { key: "heroDesc", label: "Paragraf Deskripsi", type: "textarea" },
    { key: "heroCardTitle", label: "Judul Kartu Garansi (Enter untuk 2 baris)", type: "textarea" },
    { key: "heroCardBadge", label: "Lencana Kartu Garansi", half: true },
    { key: "heroStatNum", label: "Angka Statistik Kartu", half: true, placeholder: "cth. 12.480+" },
    { key: "heroCardText", label: "Teks Kartu Garansi", type: "textarea" },
    { key: "heroChipsJson", label: "Chip Kepercayaan (maks 3)", type: "chips" },
  ],
  kontak: [
    { key: "phone", label: "Nomor Telepon (tampil)", half: true },
    { key: "phoneHref", label: "Link Tel (tel:+62…)", half: true },
    { key: "waNumber", label: "Nomor WhatsApp (format 62…)", half: true, hint: "Tanpa + dan tanpa spasi, cth. 6281316516524" },
    { key: "email", label: "Email", half: true },
    { key: "hours", label: "Jam Operasional", half: true },
    { key: "waMessage", label: "Pesan Default WhatsApp", type: "textarea" },
    { key: "street", label: "Alamat Jalan", type: "textarea" },
    { key: "city", label: "Kota", half: true },
    { key: "region", label: "Provinsi", half: true },
    { key: "postal", label: "Kode Pos", half: true },
    { key: "country", label: "Kode Negara", half: true },
    { key: "lat", label: "Latitude", type: "number", half: true },
    { key: "lng", label: "Longitude", type: "number", half: true },
  ],
  seo: [
    { key: "seoTitle", label: "Meta Title", type: "textarea", hint: "Ideal 50–60 karakter" },
    { key: "seoDescription", label: "Meta Description", type: "textarea", hint: "Ideal 150–160 karakter" },
    { key: "seoKeywords", label: "Keywords (pisah dengan koma)", type: "textarea" },
  ],
  footer: [
    { key: "footerAbout", label: "Tentang (kolom brand)", type: "textarea" },
    { key: "footerCopyright", label: "Teks Copyright", type: "textarea" },
  ],
};

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [tab, setTab] = useState("identitas");
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => d.ok && setSettings(d.settings))
      .catch(() => {});
  }, []);

  async function save() {
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...settings,
          lat: Number(settings.lat),
          lng: Number(settings.lng),
        }),
      });
      const data = await res.json();
      if (data.ok) {
        toast({ title: "Pengaturan tersimpan", description: "Frontend langsung diperbarui." });
      } else {
        toast({ title: "Gagal menyimpan", description: data.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Kesalahan jaringan", variant: "destructive" });
    }
    setSaving(false);
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-7 w-7 animate-spin text-gold-400" aria-hidden="true" />
      </div>
    );
  }

  const rows = ROWS[tab];

  return (
    <div>
      <AdminPageHeader
        title="Pengaturan Situs"
        description="Identitas brand, konten hero, kontak (NAP), meta SEO, dan footer — satu sumber kebenaran untuk seluruh website."
        actions={
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-b from-gold-400 to-gold-600 px-5 text-sm font-bold text-night-950 shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Save className="h-4 w-4" aria-hidden="true" />
            )}
            Simpan Semua
          </button>
        }
      />

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Grup pengaturan">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-bold transition-colors",
              tab === t.key
                ? "bg-gold-500/20 text-gold-300 ring-1 ring-gold-500/40"
                : "text-white/55 hover:bg-white/5 hover:text-white"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:grid-cols-2 sm:p-8">
        {rows.map((row) => (
          <div key={row.key} className={row.half ? "" : "sm:col-span-2"}>
            <SettingsField
              row={row}
              value={settings[row.key]}
              onChange={(v) => setSettings((prev) => ({ ...prev, [row.key]: v }))}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsField({
  row,
  value,
  onChange,
}: {
  row: RowDef;
  value: string | number | undefined;
  onChange: (v: string | number) => void;
}) {
  if (row.type === "textarea") {
    return (
      <div className="space-y-1.5">
        <Label className="text-sm font-semibold text-white/80">{row.label}</Label>
        <Textarea
          rows={3}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          placeholder={row.placeholder}
          className="rounded-xl border-white/15 bg-white/5 text-white placeholder:text-white/30"
        />
        {row.hint && <p className="text-xs text-white/35">{row.hint}</p>}
      </div>
    );
  }

  if (row.type === "chips") {
    return (
      <div className="space-y-1.5">
        <Label className="text-sm font-semibold text-white/80">{row.label}</Label>
        <ListEditor value={String(value ?? "[]")} onChange={onChange} />
      </div>
    );
  }

  if (row.type === "number") {
    return (
      <div className="space-y-1.5">
        <Label className="text-sm font-semibold text-white/80">{row.label}</Label>
        <Input
          type="number"
          step="any"
          value={value === undefined || value === null ? "" : String(value)}
          onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
          className="h-11 rounded-xl border-white/15 bg-white/5 text-white"
        />
        {row.hint && <p className="text-xs text-white/35">{row.hint}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-semibold text-white/80">{row.label}</Label>
      <Input
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        placeholder={row.placeholder}
        className="h-11 rounded-xl border-white/15 bg-white/5 text-white placeholder:text-white/30"
      />
      {row.hint && <p className="text-xs text-white/35">{row.hint}</p>}
    </div>
  );
}
