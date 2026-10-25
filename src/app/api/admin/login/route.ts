import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  createSessionToken,
  verifyPassword,
  SESSION_COOKIE,
  SESSION_TTL_HOURS,
} from "@/lib/cms-auth";

const loginSchema = z.object({
  email: z.string().trim().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? "Data tidak valid" },
        { status: 400 }
      );
    }

    const admin = await db.adminUser.findUnique({
      where: { email: parsed.data.email.toLowerCase() },
    });
    if (!admin || !verifyPassword(parsed.data.password, admin.passwordHash)) {
      return NextResponse.json(
        { ok: false, error: "Email atau password salah" },
        { status: 401 }
      );
    }

    const token = await createSessionToken({
      sub: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    const store = await cookies();
    store.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // sandbox preview berjalan di balik proxy HTTPS → sameSite lax cukup
      maxAge: SESSION_TTL_HOURS * 3600,
      path: "/",
    });

    await db.activityLog.create({
      data: {
        adminEmail: admin.email,
        action: "login",
        entityType: "session",
        detail: "Login berhasil ke dashboard CMS",
      },
    });

    return NextResponse.json({
      ok: true,
      admin: { email: admin.email, name: admin.name, role: admin.role },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Login gagal, coba lagi" },
      { status: 500 }
    );
  }
}
