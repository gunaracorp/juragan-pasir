"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { History, Loader2, RotateCcw, ScrollText } from "lucide-react";

type Revision = {
  id: string;
  entityType: string;
  entityId: string;
  label: string;
  createdAt: string;
};

type Activity = {
  id: string;
  adminEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  detail: string;
  createdAt: string;
};

const ACTION_LABEL: Record<string, { label: string; cls: string }> = {
  create: { label: "Buat", cls: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" },
  update: { label: "Ubah", cls: "border-gold-500/40 bg-gold-500/10 text-gold-300" },
  delete: { label: "Hapus", cls: "border-red-500/40 bg-red-500/10 text-red-300" },
  login: { label: "Login", cls: "border-white/15 bg-white/5 text-white/60" },
  export: { label: "Ekspor", cls: "border-sky-500/40 bg-sky-500/10 text-sky-300" },
  revert: { label: "Rollback", cls: "border-purple-500/40 bg-purple-500/10 text-purple-300" },
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "baru saja";
  if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * RIWAYAT & LOG — dua pilar akuntabilitas CMS:
 * 1. Revision History (rollback seperti WordPress)
 * 2. Activity Log (audit trail admin)
 */
export default function AdminRiwayatPage() {
  const { toast } = useToast();
  const [tab, setTab] = useState<"revisi" | "log">("revisi");
  const [revisions, setRevisions] = useState<Revision[] | null>(null);
  const [logs, setLogs] = useState<Activity[] | null>(null);
  const [reverting, setReverting] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [r, a] = await Promise.all([
      fetch("/api/admin/revisions").then((res) => res.json()),
      fetch("/api/admin/activity").then((res) => res.json()),
    ]);
    setRevisions(r.ok ? r.revisions : []);
    setLogs(a.ok ? a.logs : []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function rollback(rev: Revision) {
    setReverting(rev.id);
    try {
      const res = await fetch("/api/admin/revisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ revisionId: rev.id }),
      });
      const data = await res.json();
      if (data.ok) {
        toast({
          title: "Rollback berhasil",
          description: "Konten dikembalikan ke versi revisi. Frontend sudah diperbarui.",
        });
        await load();
      } else {
        toast({ title: "Gagal rollback", description: data.error, variant: "destructive" });
      }
    } finally {
      setReverting(null);
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Riwayat & Log"
        description="Setiap perubahan konten tercatat sebagai revisi yang bisa dikembalikan kapan saja, plus jejak audit seluruh aktivitas admin."
      />

      <div className="mb-6 flex gap-2">
        <button
          type="button"
          onClick={() => setTab("revisi")}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-colors",
            tab === "revisi"
              ? "bg-gold-500/20 text-gold-300 ring-1 ring-gold-500/40"
              : "text-white/55 hover:bg-white/5"
          )}
        >
          <History className="h-4 w-4" aria-hidden="true" />
          Revision History
        </button>
        <button
          type="button"
          onClick={() => setTab("log")}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-colors",
            tab === "log"
              ? "bg-gold-500/20 text-gold-300 ring-1 ring-gold-500/40"
              : "text-white/55 hover:bg-white/5"
          )}
        >
          <ScrollText className="h-4 w-4" aria-hidden="true" />
          Activity Log
        </button>
      </div>

      {tab === "revisi" ? (
        revisions === null ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-gold-400" />
          </div>
        ) : revisions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 py-16 text-center">
            <p className="text-sm text-white/40">
              Belum ada revisi. Setiap perubahan konten dari panel ini otomatis tersimpan sebagai revisi.
            </p>
          </div>
        ) : (
          <ul className="space-y-2.5">
            {revisions.map((r) => (
              <li
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-white">{r.label}</p>
                  <p className="mt-0.5 text-xs text-white/40">
                    <span className="font-mono text-gold-500/70">{r.entityType}</span> ·{" "}
                    {timeAgo(r.createdAt)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => rollback(r)}
                  disabled={reverting === r.id}
                  className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-gold-500/40 px-3.5 text-xs font-bold text-gold-300 transition-colors hover:bg-gold-500/10 disabled:opacity-50"
                >
                  {reverting === r.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <RotateCcw className="h-3.5 w-3.5" />
                  )}
                  Rollback
                </button>
              </li>
            ))}
          </ul>
        )
      ) : logs === null ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-gold-400" />
        </div>
      ) : (
        <ul className="space-y-2">
          {logs.map((l) => {
            const meta = ACTION_LABEL[l.action] ?? {
              label: l.action,
              cls: "border-white/15 bg-white/5 text-white/60",
            };
            return (
              <li
                key={l.id}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3"
              >
                <span
                  className={cn("shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-bold", meta.cls)}
                >
                  {meta.label}
                </span>
                <p className="min-w-0 flex-1 truncate text-sm text-white/75">
                  {l.detail || `${l.action} ${l.entityType}`}
                </p>
                <p className="shrink-0 text-xs text-white/35">{l.adminEmail}</p>
                <p className="shrink-0 text-xs text-white/30">{timeAgo(l.createdAt)}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
