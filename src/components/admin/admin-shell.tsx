"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogoMark } from "@/components/juragan/logo";
import { ThemeCredit } from "@/components/cms/theme-credit";
import { CMS_NAME, CMS_VERSION } from "@/lib/cms-version";
import { cn } from "@/lib/utils";
import {
  Activity,
  ExternalLink,
  FileCode2,
  History,
  Inbox,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  Menu,
  Package,
  Settings,
  Sparkles,
  Star,
  Warehouse,
  X,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads Inbox", icon: Inbox },
  { href: "/admin/sections", label: "Section Manager", icon: ListOrdered },
  { href: "/admin/settings", label: "Pengaturan Situs", icon: Settings },
  { href: "/admin/produk", label: "Produk", icon: Package },
  { href: "/admin/segmen", label: "Segmen Klien", icon: Warehouse },
  { href: "/admin/testimoni", label: "Testimoni", icon: Star },
  { href: "/admin/faq", label: "FAQ", icon: FileCode2 },
  { href: "/admin/wilayah", label: "Wilayah", icon: Warehouse },
  { href: "/admin/statistik", label: "Statistik", icon: LayoutDashboard },
  { href: "/admin/proses", label: "Alur Proses", icon: ListOrdered },
  { href: "/admin/keunggulan", label: "Keunggulan", icon: Star },
  { href: "/admin/riwayat", label: "Riwayat & Log", icon: History },
];

/**
 * ADMIN SHELL — kerangka dashboard CMS.
 * Sidebar navigasi + header dengan identitas admin + tombol lihat website.
 */
export function AdminShell({
  children,
  adminName,
  adminEmail,
}: {
  children: React.ReactNode;
  adminName?: string;
  adminEmail?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const name = adminName ?? adminEmail?.split("@")[0] ?? "Admin";

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <LogoMark className="h-9 w-9" />
        <div>
          <p className="text-sm font-extrabold tracking-tight text-white">
            Juragan Pasir <span className="text-gold-400">CMS</span>
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
            Panel Kendali Konten
            <span className="rounded-full border border-gold-500/40 bg-gold-500/10 px-1.5 py-px text-[8px] tracking-[0.14em] text-gold-300">
              v.{CMS_VERSION}
            </span>
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3" aria-label="Navigasi admin">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors",
                active
                  ? "bg-gold-500/15 text-gold-300 ring-1 ring-gold-500/30"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
        <Link
          href="/cms"
          onClick={() => setOpen(false)}
          className="mt-2 flex items-center gap-3 rounded-xl border border-gold-500/25 bg-gold-500/[0.06] px-3.5 py-2.5 text-sm font-semibold text-gold-300/90 transition-colors hover:bg-gold-500/15"
        >
          <Sparkles className="h-4 w-4 shrink-0" aria-hidden="true" />
          Tentang CMS v.{CMS_VERSION}
        </Link>
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="mb-3 flex flex-col items-center gap-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/25">
            {CMS_NAME} CMS v.{CMS_VERSION}
          </p>
          <ThemeCredit variant="badge" />
        </div>
        <div className="mb-3 flex items-center gap-3 px-1">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500/20 text-xs font-extrabold text-gold-300">
            {(name || "A").slice(0, 2).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">{name || "Admin"}</p>
            <p className="truncate text-xs text-white/40">{adminEmail}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href="/"
            target="_blank"
            className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/15 text-xs font-bold text-white/70 transition-colors hover:border-gold-500/40 hover:text-gold-300"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            Lihat Situs
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-white/15 px-3 text-xs font-bold text-white/70 transition-colors hover:border-destructive/50 hover:text-red-300"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
            Keluar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#0a0f0d]">
      {/* Sidebar desktop */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-white/10 bg-night-950 lg:block">
        {sidebar}
      </aside>

      {/* Sidebar mobile */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute left-0 top-0 h-full w-72 border-r border-white/10 bg-night-950 shadow-2xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-white/60 hover:bg-white/10"
              aria-label="Tutup menu"
            >
              <X className="h-4 w-4" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar mobile */}
        <div className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-night-950/90 px-4 py-3 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-white"
            aria-label="Buka menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <p className="flex items-center gap-2 text-sm font-extrabold text-white">
            <Activity className="h-4 w-4 text-gold-400" aria-hidden="true" />
            Juragan Pasir CMS
            <span className="rounded-full border border-gold-500/40 bg-gold-500/10 px-1.5 py-px text-[8px] font-bold uppercase tracking-[0.14em] text-gold-300">
              v.{CMS_VERSION}
            </span>
          </p>
          <span className="w-10" aria-hidden="true" />
        </div>

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

/** Judul halaman admin yang konsisten */
export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-white/50">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2.5">{actions}</div>}
    </div>
  );
}
