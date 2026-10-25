import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/cms-auth";

/**
 * PROXY PROTEKSI CMS (Next 16 — pengganti middleware)
 * Semua route /admin (kecuali /admin/login) dan /api/admin/*
 * membutuhkan session JWT valid.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Izinkan halaman login & endpoint login
  if (pathname === "/admin/login" || pathname === "/api/admin/login" || pathname === "/api/admin/logout") {
    // Sudah login namun membuka /admin/login? Langsung ke dashboard (v.2 UX)
    if (pathname === "/admin/login") {
      const tok = request.cookies.get(SESSION_COOKIE)?.value;
      const sess = tok ? await verifySessionToken(tok) : null;
      if (sess) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    // API admin → 401 JSON
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json(
        { ok: false, error: "Tidak terautentikasi" },
        { status: 401 }
      );
    }
    // Halaman admin → redirect ke login
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
