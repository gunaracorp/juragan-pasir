"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  ExternalLink,
  Inbox,
  Loader2,
  MessageCircle,
  Search,
  Trash2,
} from "lucide-react";

type Lead = {
  id: string;
  ref: string;
  name: string;
  phone: string;
  clientType: string;
  sandType: string;
  volume: string;
  city: string;
  message?: string | null;
  status: string;
  notes?: string | null;
  createdAt: string;
};

const STATUSES = ["BARU", "DIHUBUNGI", "PENAWARAN", "DEAL", "BATAL"] as const;

const STATUS_STYLE: Record<string, string> = {
  BARU: "border-gold-500/50 bg-gold-500/15 text-gold-300",
  DIHUBUNGI: "border-emerald-500/50 bg-emerald-500/10 text-emerald-300",
  PENAWARAN: "border-sky-500/50 bg-sky-500/10 text-sky-300",
  DEAL: "border-lime-500/50 bg-lime-500/15 text-lime-300",
  BATAL: "border-white/15 bg-white/5 text-white/40",
};

const STATUS_LABEL: Record<string, string> = {
  BARU: "Baru",
  DIHUBUNGI: "Dihubungi",
  PENAWARAN: "Penawaran",
  DEAL: "Deal",
  BATAL: "Batal",
};

/**
 * LEADS INBOX — CRM mini untuk permintaan penawaran.
 * Setiap submit form frontend otomatis masuk ke sini.
 * Pipeline: Baru → Dihubungi → Penawaran → Deal / Batal.
 */
export default function AdminLeadsPage() {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("SEMUA");
  const [query, setQuery] = useState("");
  const [openDetail, setOpenDetail] = useState<Lead | null>(null);
  const [reloadFlag, setReloadFlag] = useState(0);

  const reload = useCallback(() => setReloadFlag((n) => n + 1), []);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/leads");
    const data = await res.json();
    setLeads(data.ok ? data.leads : []);
  }, []);

  useEffect(() => {
    let alive = true;
    fetch("/api/admin/leads")
      .then((r) => r.json())
      .then((data) => {
        if (alive) setLeads(data.ok ? data.leads : []);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [reloadFlag]);

  const filtered = useMemo(() => {
    if (!leads) return [];
    return leads.filter((l) => {
      const okStatus = statusFilter === "SEMUA" || l.status === statusFilter;
      const q = query.toLowerCase();
      const okQuery =
        !q ||
        l.name.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.ref.toLowerCase().includes(q) ||
        l.sandType.toLowerCase().includes(q);
      return okStatus && okQuery;
    });
  }, [leads, statusFilter, query]);

  async function setStatus(lead: Lead, status: string) {
    await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: lead.id, status }),
    });
    toast({ title: `Lead ${lead.ref} → ${STATUS_LABEL[status]}` });
    if (openDetail?.id === lead.id) setOpenDetail({ ...lead, status });
    reload();
  }

  async function remove(lead: Lead) {
    await fetch(`/api/admin/leads?id=${lead.id}`, { method: "DELETE" });
    toast({ title: `Lead ${lead.ref} dihapus` });
    setOpenDetail(null);
    reload();
  }

  function waLink(lead: Lead) {
    const text = encodeURIComponent(
      `Halo ${lead.name}, saya dari tim Juragan Pasir Galunggung menindaklanjuti permintaan penawaran Anda (${lead.ref}) untuk ${lead.sandType}. Ada yang bisa kami bantu?`
    );
    const digits = lead.phone.replace(/\D/g, "").replace(/^0/, "62");
    return `https://wa.me/${digits}?text=${text}`;
  }

  return (
    <div>
      <AdminPageHeader
        title="Leads Inbox"
        description="Setiap permintaan penawaran dari website masuk otomatis ke sini. Geser status sepanjang pipeline penjualan dan hubungi langsung via WhatsApp."
      />

      {/* Filter */}
      <div className="mb-5 flex flex-wrap items-center gap-2.5">
        <div className="flex flex-wrap gap-1.5">
          {["SEMUA", ...STATUSES].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors",
                statusFilter === s
                  ? "bg-gold-500/20 text-gold-300 ring-1 ring-gold-500/40"
                  : "text-white/50 hover:bg-white/5 hover:text-white"
              )}
            >
              {s === "SEMUA" ? "Semua" : STATUS_LABEL[s]}
            </button>
          ))}
        </div>
        <div className="relative ml-auto w-full sm:w-64">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama, kota, ref…"
            className="h-10 rounded-full border-white/15 bg-white/5 pl-9 text-sm text-white placeholder:text-white/30"
          />
        </div>
      </div>

      {leads === null ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-7 w-7 animate-spin text-gold-400" aria-hidden="true" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 py-16 text-center">
          <Inbox className="mx-auto h-10 w-10 text-white/20" aria-hidden="true" />
          <p className="mt-3 text-sm text-white/40">
            Tidak ada lead yang cocok. Lead baru muncul otomatis saat form penawaran dikirim dari website.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((l) => (
            <li
              key={l.id}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-colors hover:border-gold-500/30"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 cursor-pointer flex-1" onClick={() => setOpenDetail(l)}>
                  <p className="flex flex-wrap items-center gap-2 text-sm font-bold text-white">
                    {l.name}
                    <span className="rounded-full bg-gold-500/15 px-2 py-0.5 text-[10px] font-bold text-gold-300">
                      {l.ref}
                    </span>
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 text-[10px] font-bold",
                        STATUS_STYLE[l.status]
                      )}
                    >
                      {STATUS_LABEL[l.status] ?? l.status}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-white/45">
                    {l.sandType} · {l.volume} · {l.city} · {l.phone}
                  </p>
                  <p className="mt-0.5 text-xs text-white/30">
                    {new Date(l.createdAt).toLocaleDateString("id-ID", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  {/* Pipeline cepat */}
                  <select
                    value={l.status}
                    onChange={(e) => setStatus(l, e.target.value)}
                    aria-label="Ubah status"
                    className="h-9 rounded-lg border border-white/15 bg-night-900 px-2.5 text-xs font-bold text-white/80"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABEL[s]}
                      </option>
                    ))}
                  </select>
                  <a
                    href={waLink(l)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-wa/40 text-wa transition-colors hover:bg-wa/10"
                    aria-label="Chat WhatsApp"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setOpenDetail(l)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-white/60 transition-colors hover:border-gold-500/40 hover:text-gold-300"
                    aria-label="Detail lead"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Detail lead */}
      {openDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpenDetail(null)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-night-900 p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-xl font-bold text-white">
                  {openDetail.name}{" "}
                  <span className="ml-1 text-sm font-bold text-gold-400">{openDetail.ref}</span>
                </h3>
                <p className="mt-0.5 text-xs text-white/45">{openDetail.clientType}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpenDetail(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 hover:bg-white/10"
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>

            <dl className="mt-5 space-y-2.5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm">
              {[
                ["No. WhatsApp", openDetail.phone],
                ["Jenis Pasir", openDetail.sandType],
                ["Volume", openDetail.volume],
                ["Kota Kirim", openDetail.city],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="text-white/45">{k}</dt>
                  <dd className="text-right font-semibold text-white">{v}</dd>
                </div>
              ))}
              {openDetail.message && (
                <div className="border-t border-white/10 pt-2.5">
                  <dt className="mb-1 text-white/45">Catatan Klien</dt>
                  <dd className="text-sm leading-relaxed text-white/80">{openDetail.message}</dd>
                </div>
              )}
            </dl>

            <div className="mt-5 flex flex-wrap gap-2.5">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(openDetail, s)}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors",
                    openDetail.status === s
                      ? STATUS_STYLE[s]
                      : "border-white/15 text-white/50 hover:text-white"
                  )}
                >
                  {STATUS_LABEL[s]}
                </button>
              ))}
            </div>

            <div className="mt-6 flex justify-between gap-3 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() => remove(openDetail)}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-destructive/40 px-4 text-sm font-bold text-red-300 transition-colors hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Hapus Lead
              </button>
              <a
                href={waLink(openDetail)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-wa px-5 text-sm font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Chat via WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
