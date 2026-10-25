import { NextResponse } from "next/server";
import { requireAdmin, logActivity } from "@/lib/cms-admin-guard";
import type { NextRequest } from "next/server";

/**
 * EXPORT HTML MANDIRI — snapshot frontend menjadi SATU file HTML offline.
 *
 * Proses:
 *  1. Ambil HTML hasil render halaman "/" dari server Next.js
 *  2. Inline semua stylesheet eksternal → <style>
 *  3. Inline semua gambar → data URI base64
 *  4. Buang script hydration React (tidak berguna untuk file statis)
 *  5. Sisipkan banner kecil "diekspor dari CMS"
 *
 * Hasil: file HTML tunggal yang bisa dibuka di mana saja tanpa server —
 * sempurna untuk arsip, cetak, atau distribusi.
 */

const BASE = "http://localhost:3000";

function resolveUrl(src: string): string | null {
  try {
    return new URL(src, BASE).toString();
  } catch {
    return null;
  }
}

async function inlineStyles(html: string): Promise<string> {
  const linkRegex = /<link[^>]+rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g;
  const matches = [...html.matchAll(linkRegex)];
  let result = html;
  for (const m of matches) {
    const [fullTag, href] = m;
    const url = resolveUrl(href);
    if (!url) continue;
    try {
      const res = await fetch(url);
      const css = await res.text();
      result = result.replace(fullTag, `<style data-src="${href}">${css}</style>`);
    } catch {
      /* gagal inline satu stylesheet → biarkan tag aslinya */
    }
  }
  return result;
}

async function inlineImages(html: string): Promise<string> {
  const imgRegex = /src="(\/[^"]+\.(?:png|jpe?g|svg|webp|gif))"/g;
  const matches = [...html.matchAll(imgRegex)];
  let result = html;
  const cache = new Map<string, string>();
  for (const m of matches) {
    const path = m[1];
    if (cache.has(path)) {
      result = result.replaceAll(`src="${path}"`, `src="${cache.get(path)}"`);
      continue;
    }
    const url = resolveUrl(path);
    if (!url) continue;
    try {
      const res = await fetch(url);
      const buf = Buffer.from(await res.arrayBuffer());
      const ext = path.split(".").pop()?.toLowerCase() ?? "jpg";
      const mime =
        ext === "png" ? "image/png" : ext === "svg" ? "image/svg+xml" : ext === "webp" ? "image/webp" : ext === "gif" ? "image/gif" : "image/jpeg";
      const dataUri = `data:${mime};base64,${buf.toString("base64")}`;
      cache.set(path, dataUri);
      result = result.replaceAll(`src="${path}"`, `src="${dataUri}"`);
    } catch {
      /* biarkan gambar gagal inline */
    }
  }
  return result;
}

export async function POST(request: NextRequest) {
  const { session, response } = await requireAdmin(request);
  if (!session) return response;

  try {
    // 1) Ambil HTML ter-render
    const pageRes = await fetch(BASE, { cache: "no-store" });
    let html = await pageRes.text();

    // 2) Inline CSS
    html = await inlineStyles(html);

    // 3) Inline gambar
    html = await inlineImages(html);

    // 4) Buang script hydration + preload js + flight payload React
    //    (tidak berguna untuk file statis; JSON-LD tetap dipertahankan)
    html = html
      .replace(/<script\b[^>]*\bsrc="\/_next\/[^"]*"[^>]*><\/script>/g, "")
      .replace(/<script\b[^>]*id="__NEXT_DATA__"[^>]*>[\s\S]*?<\/script>/g, "")
      .replace(/<script>self\.__next_f[\s\S]*?<\/script>/g, "")
      .replace(/<link[^>]+rel="preload"[^>]+as="script"[^>]*>/g, "");

    // 5) Banner + metadata ekspor
    const banner = `
<!-- =====================================================
     EKSPOR HTML MANDIRI — Juragan Pasir CMS
     Diekspor: ${new Date().toISOString()}
     Oleh: ${session.email}
     File ini adalah snapshot statis dari halaman beranda.
     Sumber konten: database CMS (SQLite + Prisma).
     ===================================================== -->
<div style="position:fixed;bottom:10px;left:10px;z-index:9999;background:rgba(2,23,16,.85);color:#e3be55;font:600 11px/1.4 system-ui,sans-serif;padding:6px 12px;border-radius:999px;pointer-events:none">
  Snapshot statis · Juragan Pasir CMS · ${new Date().toLocaleDateString("id-ID")}
</div>`;
    html = html.replace("</body>", `${banner}</body>`);

    const filename = `juragan-pasir-${new Date().toISOString().slice(0, 10)}.html`;

    await logActivity(session.email, "export", "html", "", `Export HTML mandiri: ${filename}`);

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Gagal mengekspor HTML" },
      { status: 500 }
    );
  }
}
