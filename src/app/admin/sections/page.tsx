"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  Loader2,
  Pencil,
  Save,
  X,
} from "lucide-react";

type Section = {
  id: string;
  key: string;
  title: string;
  order: number;
  visible: boolean;
  eyebrow: string;
  heading: string;
  highlight: string;
  description: string;
};

/**
 * SECTION MANAGER — kendali penuh susunan halaman depan:
 * urutkan, sembunyikan/tampilkan, edit eyebrow & heading tiap section.
 * Ini yang membuat website "berkembang bebas" tanpa sentuh kode.
 */
export default function AdminSectionsPage() {
  const { toast } = useToast();
  const [sections, setSections] = useState<Section[] | null>(null);
  const [editing, setEditing] = useState<Section | null>(null);
  const [form, setForm] = useState<Section | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/resource/sections");
    const data = await res.json();
    setSections(data.ok ? data.items : []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleVisible(s: Section) {
    await fetch(`/api/admin/resource/sections/${s.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...s, visible: !s.visible }),
    });
    toast({ title: s.visible ? "Section disembunyikan" : "Section ditampilkan" });
    await load();
  }

  async function move(s: Section, dir: -1 | 1) {
    if (!sections) return;
    const idx = sections.findIndex((x) => x.id === s.id);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= sections.length) return;
    const a = sections[idx];
    const b = sections[swapIdx];
    const orderA = Number(a.order ?? 0);
    const orderB = Number(b.order ?? 0);
    await Promise.all([
      fetch(`/api/admin/resource/sections/${a.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...a, order: orderB }),
      }),
      fetch(`/api/admin/resource/sections/${b.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...b, order: orderA }),
      }),
    ]);
    await load();
  }

  async function saveHeading() {
    if (!form) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/resource/sections/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.ok) {
        toast({ title: "Heading disimpan", description: "Perubahan langsung tampil di frontend." });
        setEditing(null);
        await load();
      } else {
        toast({ title: "Gagal", description: data.error, variant: "destructive" });
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Section Manager"
        description="Susunan halaman depan ada di tangan Anda: naik-turunkan urutan section, sembunyikan yang tidak perlu, dan sunting judul tiap section. Halaman frontend mengikuti aturan di sini secara real-time."
      />

      {sections === null ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-7 w-7 animate-spin text-gold-400" aria-hidden="true" />
        </div>
      ) : (
        <ol className="space-y-3">
          {sections.map((s, idx) => (
            <li
              key={s.id}
              className={cn(
                "flex items-center gap-4 rounded-2xl border p-4",
                s.visible
                  ? "border-white/10 bg-white/[0.04]"
                  : "border-white/5 bg-white/[0.02] opacity-60"
              )}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-500/15 font-display text-sm font-extrabold text-gold-300 tabular">
                {idx + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white">{s.title}</p>
                <p className="mt-0.5 truncate text-xs text-white/40">
                  <span className="font-mono text-gold-500/70">{s.key}</span>
                  {s.heading ? ` · ${s.heading} ${s.highlight}` : " · tanpa heading khusus"}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => move(s, -1)}
                  disabled={idx === 0}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/50 transition-colors hover:border-gold-500/40 hover:text-gold-300 disabled:opacity-30"
                  aria-label="Naikkan"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => move(s, 1)}
                  disabled={idx === sections.length - 1}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/50 transition-colors hover:border-gold-500/40 hover:text-gold-300 disabled:opacity-30"
                  aria-label="Turunkan"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => toggleVisible(s)}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg border transition-colors",
                    s.visible ? "border-gold-500/40 text-gold-300" : "border-white/10 text-white/40"
                  )}
                  aria-label={s.visible ? "Sembunyikan section" : "Tampilkan section"}
                >
                  {s.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(s);
                    setForm(s);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/60 transition-colors hover:border-gold-500/40 hover:text-gold-300"
                  aria-label="Edit heading"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}

      {/* Dialog edit heading */}
      {editing && form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setEditing(null)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-night-900 p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-white/50 hover:bg-white/10"
              aria-label="Tutup"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="font-display text-xl font-bold text-white">
              Edit Heading — {editing.title}
            </h3>
            <p className="mt-1 text-xs text-white/40">
              Section <span className="font-mono text-gold-500/70">{editing.key}</span>
            </p>

            <div className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-white/80">Eyebrow (lencana atas)</Label>
                <Input
                  value={form.eyebrow}
                  onChange={(e) => setForm({ ...form, eyebrow: e.target.value })}
                  className="h-11 rounded-xl border-white/15 bg-white/5 text-white"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-white/80">Judul</Label>
                  <Input
                    value={form.heading}
                    onChange={(e) => setForm({ ...form, heading: e.target.value })}
                    className="h-11 rounded-xl border-white/15 bg-white/5 text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-white/80">
                    Highlight (italic emas)
                  </Label>
                  <Input
                    value={form.highlight}
                    onChange={(e) => setForm({ ...form, highlight: e.target.value })}
                    className="h-11 rounded-xl border-white/15 bg-white/5 text-white"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-white/80">Deskripsi</Label>
                <Textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="rounded-xl border-white/15 bg-white/5 text-white"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="h-11 rounded-xl border border-white/15 px-5 text-sm font-bold text-white/70"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={saveHeading}
                disabled={saving}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-b from-gold-400 to-gold-600 px-6 text-sm font-bold text-night-950 disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Save className="h-4 w-4" aria-hidden="true" />
                )}
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
