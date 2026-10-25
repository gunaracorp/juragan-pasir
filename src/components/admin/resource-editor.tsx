"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getIcon, CMS_ICON_NAMES } from "@/components/juragan/icon-map";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

/* ---------------------- DEFINISI FIELD ---------------------- */

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "float"
  | "switch"
  | "icon"
  | "color"
  | "rating"
  | "list";

export type FieldConfig = {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  hint?: string;
  half?: boolean; // grid 2 kolom
};

export type ResourceConfig = {
  model: string; // path di /api/admin/resource/{model}
  title: string;
  description: string;
  titleField: string; // field judul item
  subtitleField?: string;
  iconField?: string;
  fields: FieldConfig[];
};

type Item = Record<string, unknown> & { id: string };

/* ---------------------- FIELD RENDERER ---------------------- */

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldConfig;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  if (field.type === "switch") {
    return (
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
        <Label className="text-sm font-semibold text-white/80">{field.label}</Label>
        <Switch checked={Boolean(value)} onCheckedChange={onChange} />
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-semibold text-white/80">{field.label}</Label>

      {field.type === "text" && (
        <Input
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="h-11 rounded-xl border-white/15 bg-white/5 text-white placeholder:text-white/30"
        />
      )}

      {field.type === "textarea" && (
        <Textarea
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={4}
          className="rounded-xl border-white/15 bg-white/5 text-white placeholder:text-white/30"
        />
      )}

      {(field.type === "number" || field.type === "float") && (
        <Input
          type="number"
          step={field.type === "float" ? "0.1" : "1"}
          value={value === null || value === undefined ? "" : String(value)}
          onChange={(e) =>
            onChange(e.target.value === "" ? 0 : Number(e.target.value))
          }
          className="h-11 rounded-xl border-white/15 bg-white/5 text-white"
        />
      )}

      {field.type === "rating" && (
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className={cn(
                "h-10 w-10 rounded-lg border text-sm font-bold transition-colors",
                Number(value) >= n
                  ? "border-gold-500/50 bg-gold-500/20 text-gold-300"
                  : "border-white/15 bg-white/5 text-white/40 hover:text-white/70"
              )}
              aria-label={`Rating ${n}`}
            >
              {n}
            </button>
          ))}
        </div>
      )}

      {field.type === "color" && (
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={String(value ?? "#C29B4C")}
            onChange={(e) => onChange(e.target.value)}
            className="h-11 w-16 cursor-pointer rounded-lg border border-white/15 bg-white/5"
            aria-label={field.label}
          />
          <Input
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            className="h-11 flex-1 rounded-xl border-white/15 bg-white/5 font-mono text-sm text-white"
          />
        </div>
      )}

      {field.type === "icon" && (
        <div>
          <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2">
            {(() => {
              const Icon = getIcon(String(value ?? "Gem"));
              return <Icon className="h-5 w-5 shrink-0 text-gold-400" />;
            })()}
            <span className="text-sm font-bold text-white">{String(value ?? "Gem")}</span>
          </div>
          <div className="mt-2 grid max-h-40 grid-cols-6 gap-1.5 overflow-y-auto rounded-xl border border-white/10 bg-white/5 p-2">
            {CMS_ICON_NAMES.map((name) => {
              const Icon = getIcon(name);
              return (
                <button
                  key={name}
                  type="button"
                  title={name}
                  onClick={() => onChange(name)}
                  className={cn(
                    "flex h-9 items-center justify-center rounded-lg border transition-colors",
                    value === name
                      ? "border-gold-500/50 bg-gold-500/20 text-gold-300"
                      : "border-transparent text-white/50 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {field.type === "list" && (
        <ListEditor
          value={String(value ?? "[]")}
          onChange={(v) => onChange(v)}
          placeholder={field.placeholder}
        />
      )}

      {field.hint && <p className="text-xs text-white/35">{field.hint}</p>}
    </div>
  );
}

/** Editor array-of-string (spesifikasi, poin keunggulan, daftar kota) — dipakai juga oleh Settings editor */
export function ListEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (json: string) => void;
  placeholder?: string;
}) {
  const items = useMemo(() => {
    try {
      const parsed = JSON.parse(value || "[]");
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  }, [value]);

  return (
    <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-3">
      {items.map((it, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input
            value={it}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              onChange(JSON.stringify(next));
            }}
            className="h-9 rounded-lg border-white/15 bg-white/5 text-sm text-white"
            placeholder={placeholder}
          />
          <button
            type="button"
            onClick={() => {
              onChange(JSON.stringify(items.filter((_, idx) => idx !== i)));
            }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/15 text-white/50 transition-colors hover:border-destructive/50 hover:text-red-300"
            aria-label="Hapus baris"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange(JSON.stringify([...items, ""]))}
        className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/20 text-xs font-bold text-white/50 transition-colors hover:border-gold-500/40 hover:text-gold-300"
      >
        <Plus className="h-3.5 w-3.5" /> Tambah baris
      </button>
    </div>
  );
}

/* ---------------------- RESOURCE EDITOR ---------------------- */

const EMPTY = "_new_";

export function ResourceEditor({ config }: { config: ResourceConfig }) {
  const { toast } = useToast();
  const [items, setItems] = useState<Item[] | null>(null);
  const [editing, setEditing] = useState<Item | null>(null); // null | item | {id: EMPTY}
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/resource/${config.model}`);
    const data = await res.json();
    setItems(data.ok ? data.items : []);
  }, [config.model]);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    const defaults: Record<string, unknown> = {};
    for (const f of config.fields) {
      defaults[f.key] =
        f.type === "switch" ? true : f.type === "list" ? "[]" : f.type === "number" || f.type === "float" ? 0 : f.type === "rating" ? 5 : f.type === "icon" ? "Gem" : f.type === "color" ? "#C29B4C" : "";
    }
    setForm(defaults);
    setEditing({ id: EMPTY });
  }

  function openEdit(item: Item) {
    const f: Record<string, unknown> = {};
    for (const field of config.fields) f[field.key] = item[field.key];
    setForm(f);
    setEditing(item);
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    try {
      const isNew = editing.id === EMPTY;
      const res = await fetch(
        isNew
          ? `/api/admin/resource/${config.model}`
          : `/api/admin/resource/${config.model}/${editing.id}`,
        {
          method: isNew ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const data = await res.json();
      if (!data.ok) {
        toast({ title: "Gagal menyimpan", description: data.error, variant: "destructive" });
        setSaving(false);
        return;
      }
      toast({ title: isNew ? "Konten dibuat" : "Konten diperbarui", description: "Frontend langsung diperbarui otomatis." });
      setEditing(null);
      await load();
    } catch {
      toast({ title: "Kesalahan jaringan", variant: "destructive" });
    }
    setSaving(false);
  }

  async function remove(id: string) {
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/resource/${config.model}/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.ok) {
        toast({ title: "Konten dihapus" });
        await load();
      } else {
        toast({ title: "Gagal menghapus", description: data.error, variant: "destructive" });
      }
    } finally {
      setDeleting(null);
    }
  }

  async function toggleVisible(item: Item) {
    const next = { ...item, visible: !item.visible };
    await fetch(`/api/admin/resource/${config.model}/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    await load();
  }

  async function move(item: Item, dir: -1 | 1) {
    if (!items) return;
    const idx = items.findIndex((i) => i.id === item.id);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= items.length) return;
    const a = items[idx];
    const b = items[swapIdx];
    // Tukar urutan
    await Promise.all([
      fetch(`/api/admin/resource/${config.model}/${a.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...a, order: Number(b.order ?? 0) }),
      }),
      fetch(`/api/admin/resource/${config.model}/${b.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...b, order: Number(a.order ?? 0) }),
      }),
    ]);
    await load();
  }

  const hasVisible = config.fields.some((f) => f.key === "visible");

  return (
    <div>
      <AdminPageHeader
        title={config.title}
        description={config.description}
        actions={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-b from-gold-400 to-gold-600 px-5 text-sm font-bold text-night-950 shadow-lg transition-all hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Tambah Baru
          </button>
        }
      />

      {items === null ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-7 w-7 animate-spin text-gold-400" aria-hidden="true" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 py-16 text-center">
          <p className="text-sm text-white/40">Belum ada data. Klik &quot;Tambah Baru&quot; untuk membuat.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((item, idx) => {
            const IconComp = config.iconField ? getIcon(String(item[config.iconField] ?? "Gem")) : null;
            const visible = item.visible !== false;
            return (
              <li
                key={item.id}
                className={cn(
                  "flex items-center gap-4 rounded-2xl border p-4 transition-colors",
                  visible
                    ? "border-white/10 bg-white/[0.04] hover:border-gold-500/30"
                    : "border-white/5 bg-white/[0.02] opacity-60"
                )}
              >
                {IconComp && (
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-night-800">
                    <IconComp className="h-5 w-5 text-gold-400" />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-white">
                    {String(item[config.titleField] ?? "(tanpa judul)")}
                    {item.badge ? (
                      <span className="ml-2 rounded-full bg-gold-500/15 px-2 py-0.5 text-[10px] font-bold text-gold-300">
                        {String(item.badge)}
                      </span>
                    ) : null}
                  </p>
                  {config.subtitleField && (
                    <p className="mt-0.5 truncate text-xs text-white/45">
                      {String(item[config.subtitleField] ?? "")}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  {/* Urutkan */}
                  <button
                    type="button"
                    onClick={() => move(item, -1)}
                    disabled={idx === 0}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/50 transition-colors hover:border-gold-500/40 hover:text-gold-300 disabled:opacity-30"
                    aria-label="Naikkan urutan"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(item, 1)}
                    disabled={idx === items.length - 1}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/50 transition-colors hover:border-gold-500/40 hover:text-gold-300 disabled:opacity-30"
                    aria-label="Turunkan urutan"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  {/* Visibilitas */}
                  {hasVisible && (
                    <button
                      type="button"
                      onClick={() => toggleVisible(item)}
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg border transition-colors",
                        visible
                          ? "border-gold-500/40 text-gold-300"
                          : "border-white/10 text-white/40"
                      )}
                      aria-label={visible ? "Sembunyikan" : "Tampilkan"}
                    >
                      {visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    </button>
                  )}
                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/60 transition-colors hover:border-gold-500/40 hover:text-gold-300"
                    aria-label="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  {/* Hapus */}
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    disabled={deleting === item.id}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/60 transition-colors hover:border-destructive/50 hover:text-red-300 disabled:opacity-40"
                    aria-label="Hapus"
                  >
                    {deleting === item.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Dialog edit/buat */}
      <Dialog open={editing !== null} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto border-white/15 bg-night-900 text-white">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">
              {editing?.id === EMPTY ? `Tambah ${config.title}` : `Edit ${config.title}`}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-5 sm:grid-cols-2">
            {config.fields.map((f) => (
              <div key={f.key} className={f.half ? "" : "sm:col-span-2"}>
                <FieldInput
                  field={f}
                  value={form[f.key]}
                  onChange={(v) => setForm((prev) => ({ ...prev, [f.key]: v }))}
                />
              </div>
            ))}
          </div>

          <div className="mt-2 flex justify-end gap-3 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="h-11 rounded-xl border border-white/15 px-5 text-sm font-bold text-white/70 transition-colors hover:text-white"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-b from-gold-400 to-gold-600 px-6 text-sm font-bold text-night-950 shadow-lg disabled:opacity-60"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              Simpan
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
