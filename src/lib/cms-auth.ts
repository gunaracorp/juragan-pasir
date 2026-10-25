/**
 * CMS AUTH — autentikasi admin berbasis JWT cookie
 * Password: scrypt via node:crypto (tanpa dependensi baru)
 * Token: jose HS256 (kompatibel edge middleware)
 */
import { createHash, randomBytes, timingSafeEqual } from "crypto";
import { SignJWT, jwtVerify } from "jose";

const SESSION_COOKIE = "jp_cms_session";
const SESSION_TTL_HOURS = 24;

function getSecret(): Uint8Array {
  const secret =
    process.env.CMS_SECRET || "juragan-pasir-cms-secret-key-change-in-production";
  return new TextEncoder().encode(secret);
}

/** Hash password: salt:sha256(salt+password) */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = createHash("sha256").update(salt + password).digest("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = createHash("sha256").update(salt + password).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(candidate, "hex"), Buffer.from(hash, "hex"));
  } catch {
    return false;
  }
}

export type SessionPayload = {
  sub: string; // admin id
  email: string;
  name: string;
  role: string;
};

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_HOURS}h`)
    .sign(getSecret());
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      sub: String(payload.sub ?? payload.id ?? ""),
      email: String(payload.email ?? ""),
      name: String(payload.name ?? ""),
      role: String(payload.role ?? "admin"),
    };
  } catch {
    return null;
  }
}

export { SESSION_COOKIE, SESSION_TTL_HOURS };
