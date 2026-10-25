"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Download,
  FileCode2,
  Inbox,
  ListOrdered,
  Package,
  Star,
  TrendingUp,
} from "lucide-react";

type DashboardData = {
  stats: {
    totalLeads: number;
    newLeads: number;
    wonLeads: number;
    totalProducts: number;
    visibleSections: number;
    totalSections: number;
    totalTestimonials: number;
    totalFaqs: number;
  };
  recentLeads: {
    id: string;
    ref: string;
    name: string;
    city: string;
    sandType: string;
    status: string;
    createdAt: string;
  }[];
  leadsByStatus: { status: string; count: number }[];
  leadsByDay: { d: string; c: number }[];
};

const STATUS_LABEL: Record<string, string> = {
  BARU: "Baru",
  DIHUBUNGI: "Dihubungi",
  PENAWARAN: "Penawaran",
  DEAL: "Deal",
  BATAL: "Batal",
};

/**
 * DASHBOARD CMS — ringkasan kesehatan website:
 * lead masuk, konten aktif, dan akses cepat ekspor HTML.
 */
export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((d) => d.ok && setData(d))
      .catch(() => {});
  }, []);

  async function exportHtml() {
    setExporting(true);
    try {
      const res = await fetch("/api/admin/export-html", { method: "POST" });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = res.headers.get("content-disposition")?.match(/filename="(.+)"/)?.[1] ?? "export.html";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      /* toast ditangani UI */
    }
    setExporting(false);
  }

  const cards = data
    ? [
        { label: "Total Leads", value: data.stats.totalLeads, icon: Inbox, hint: `${data.stats.newLeads} belum dihubungi`, href: "/admin/leads" },
        { label: "Leads Deal", value: data.stats.wonLeads, icon: TrendingUp, hint: "transaksi berhasil", href: "/admin/leads" },
        { label: "Section Aktif", value: `${data.stats.visibleSections}/${data.stats.totalSections}`, icon: ListOrdered, hint: "tampil di frontend", href: "/admin/sections" },
        { label: "Konten Produk", value: data.stats.totalProducts, icon: Package, hint: `${data.stats.totalTestimonials} testimoni · ${data.stats.totalFaqs} FAQ`, href: "/admin/produk" },
      ]
    : [];

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Ringkasan performa website dan kendali cepat konten. Semua perubahan yang Anda simpan langsung tampil di frontend."
        actions={
          <button
            type="button"
            onClick={exportHtml}
            disabled={exporting}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-b from-gold-400 to-gold-600 px-5 text-sm font-bold text-night-950 shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-60"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            {exporting ? "Mengekspor…" : "Export HTML"}
          </button>
        }
      />

      {/* Kartu statistik */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href}>
            <Card className="border-white/10 bg-white/[0.04] transition-colors hover:border-gold-500/40">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-bold text-white/60">{c.label}</CardTitle>
                <c.icon className="h-4.5 w-4.5 text-gold-400" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <p className="font-display text-3xl font-bold text-white tabular">{c.value}</p>
                <p className="mt-1 text-xs text-white/40">{c.hint}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        {/* Grafik leads 14 hari */}
        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white">
              Leads Masuk — 14 Hari Terakhir
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            {data && data.leadsByDay.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.leadsByDay.map((r) => ({ d: r.d.slice(5), c: Number(r.c) }))}>
                  <defs>
                    <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D4AE36" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#D4AE36" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="d" stroke="rgba(255,255,255,0.4)" fontSize={11} />
                  <YAxis allowDecimals={false} stroke="rgba(255,255,255,0.4)" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: "#021710",
                      border: "1px solid rgba(212,174,54,0.3)",
                      borderRadius: 12,
                      color: "#fff",
                    }}
                    labelStyle={{ color: "#D4AE36" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="c"
                    name="Leads"
                    stroke="#D4AE36"
                    strokeWidth={2.5}
                    fill="url(#gold)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <Inbox className="h-10 w-10 text-white/20" aria-hidden="true" />
                <p className="mt-3 text-sm text-white/40">
                  Belum ada lead masuk. Grafik akan terisi otomatis saat form penawaran digunakan.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pipeline status */}
        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white">Pipeline Leads</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data && data.leadsByStatus.length > 0 ? (
              data.leadsByStatus.map((s) => {
                const pct =
                  data.stats.totalLeads > 0
                    ? Math.round((s.count / data.stats.totalLeads) * 100)
                    : 0;
                return (
                  <div key={s.status}>
                    <div className="mb-1.5 flex items-center justify-between text-xs font-semibold">
                      <span className="text-white/70">{STATUS_LABEL[s.status] ?? s.status}</span>
                      <span className="text-white/50 tabular">
                        {s.count} · {pct}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-gold-600 to-gold-400"
                        style={{ width: `${Math.max(pct, 4)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-white/40">Belum ada data pipeline.</p>
            )}
            <Link
              href="/admin/leads"
              className="mt-4 flex h-10 items-center justify-center rounded-xl border border-white/15 text-sm font-bold text-white/70 transition-colors hover:border-gold-500/40 hover:text-gold-300"
            >
              Kelola Leads →
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Leads terbaru */}
      <Card className="mt-6 border-white/10 bg-white/[0.04]">
        <CardHeader>
          <CardTitle className="text-base font-bold text-white">Leads Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          {data && data.recentLeads.length > 0 ? (
            <ul className="divide-y divide-white/10">
              {data.recentLeads.map((l) => (
                <li key={l.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-white">
                      {l.name}{" "}
                      <span className="ml-1.5 rounded-full bg-gold-500/15 px-2 py-0.5 text-[10px] font-bold text-gold-300">
                        {l.ref}
                      </span>
                    </p>
                    <p className="mt-0.5 text-xs text-white/45">
                      {l.sandType} · {l.city} ·{" "}
                      {new Date(l.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-bold text-white/60">
                    {STATUS_LABEL[l.status] ?? l.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center py-10 text-center">
              <Star className="h-9 w-9 text-white/20" aria-hidden="true" />
              <p className="mt-3 text-sm text-white/40">
                Belum ada lead. Form penawaran di frontend otomatis mengisi daftar ini.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
