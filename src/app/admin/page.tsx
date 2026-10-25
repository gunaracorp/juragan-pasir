"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CMS_NAME,
  CMS_VERSION,
  CMS_CODENAME,
  CMS_CHANGELOG,
} from "@/lib/cms-version";
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
  ExternalLink,
  Eye,
  History,
  Inbox,
  ListOrdered,
  Package,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";

type DashboardData = {
  admin?: { name?: string; email?: string };
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
 * DASHBOARD CMS v.2 — sambutan dinamis + ringkasan kesehatan website:
 * lead masuk, konten aktif, pintasan cepat, dan changelog versi.
 */
export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [exporting, setExporting] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((d) => d.ok && setData(d))
      .catch(() => {});
    setNow(new Date());
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

  const adminName = data?.admin?.name ?? data?.admin?.email?.split("@")[0] ?? "Admin";
  const hour = now?.getHours() ?? 8;
  const greeting =
    hour >= 4 && hour < 11
      ? "Selamat pagi"
      : hour >= 11 && hour < 15
        ? "Selamat siang"
        : hour >= 15 && hour < 19
          ? "Selamat sore"
          : "Selamat malam";

  const cards = data
    ? [
        { label: "Total Leads", value: data.stats.totalLeads, icon: Inbox, hint: `${data.stats.newLeads} belum dihubungi`, href: "/admin/leads" },
        { label: "Leads Deal", value: data.stats.wonLeads, icon: TrendingUp, hint: "transaksi berhasil", href: "/admin/leads" },
        { label: "Section Aktif", value: `${data.stats.visibleSections}/${data.stats.totalSections}`, icon: ListOrdered, hint: "tampil di frontend", href: "/admin/sections" },
        { label: "Konten Produk", value: data.stats.totalProducts, icon: Package, hint: `${data.stats.totalTestimonials} testimoni · ${data.stats.totalFaqs} FAQ`, href: "/admin/produk" },
      ]
    : [];

  const quickActions = [
    { label: "Lihat Situs", href: "/", icon: ExternalLink, external: true },
    { label: "Section Manager", href: "/admin/sections", icon: ListOrdered },
    { label: "Leads Inbox", href: "/admin/leads", icon: Inbox },
    { label: "Riwayat & Rollback", href: "/admin/riwayat", icon: History },
  ];

  return (
    <div>
      {/* ══ HERO SAMBUTAN v.2 ══ */}
      <section className="anim-fade-up relative mb-8 overflow-hidden rounded-3xl border border-gold-500/25 bg-gradient-to-br from-night-800 via-night-900 to-night-950 p-6 sm:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="tech-grid absolute inset-0 opacity-60" />
          <div className="anim-orb absolute -right-16 -top-20 h-64 w-64 rounded-full bg-gold-500/12 blur-[80px]" />
          <div className="anim-orb absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-night-600/35 blur-[70px] [animation-delay:-7s]" />
        </div>

        <div className="relative flex flex-wrap items-start justify-between gap-5">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/40 bg-gold-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-300">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              {CMS_NAME} v.{CMS_VERSION} · {CMS_CODENAME}
            </span>
            <h1 className="mt-3 font-display text-2xl font-black tracking-tight text-white sm:text-3xl">
              {greeting}, <span className="text-gold-bright">{adminName}</span> 👋
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/55">
              {now
                ? now.toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : ""}
              {" — "}
              Website berjalan normal. Semua perubahan yang Anda simpan langsung tampil di frontend.
            </p>

            {/* Pintasan cepat */}
            <div className="mt-5 flex flex-wrap gap-2">
              {quickActions.map((a) => (
                <Link
                  key={a.label}
                  href={a.href}
                  {...(a.external ? { target: "_blank", rel: "noopener" } : {})}
                  className="inline-flex h-9 items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 text-xs font-bold text-white/70 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-gold-500/45 hover:text-gold-300"
                >
                  <a.icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {a.label}
                </Link>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={exportHtml}
            disabled={exporting}
            className="btn-shine inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-gradient-to-b from-gold-400 to-gold-600 px-6 text-sm font-bold text-night-950 shadow-[0_12px_34px_rgba(189,151,38,0.38)] transition-all hover:-translate-y-0.5 disabled:opacity-60"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            {exporting ? "Mengekspor…" : "Export HTML"}
          </button>
        </div>
      </section>

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

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        {/* Leads terbaru */}
        <Card className="border-white/10 bg-white/[0.04]">
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

        {/* Changelog CMS v.2 */}
        <Card className="relative overflow-hidden border-gold-500/25 bg-gradient-to-b from-gold-500/[0.07] to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-bold text-white">
              <Sparkles className="h-4 w-4 text-gold-400" aria-hidden="true" />
              Baru di CMS v.{CMS_VERSION}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5">
              {CMS_CHANGELOG[0].items.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-white/65">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/cms"
              className="mt-5 flex h-10 items-center justify-center gap-2 rounded-xl border border-gold-500/35 bg-gold-500/10 text-sm font-bold text-gold-300 transition-colors hover:bg-gold-500/20"
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
              Lihat CMS Home & Keunggulan
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
