// lib/feAuth.ts
import crypto from "crypto";

type FeSession = {
  u: string;
  role: "ADMIN" | "USER";
  exp: number;
};

const COOKIE_NAME = "fe_session";

function b64url(input: Buffer | string) {
  const b = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return b.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function unb64url(input: string) {
  input = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = input.length % 4;
  if (pad) input += "=".repeat(4 - pad);
  return Buffer.from(input, "base64");
}
function hmac(data: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(data).digest();
}

export function signFeSession(
  session: Omit<FeSession, "exp">,
  ttlSeconds = 60 * 60 * 8 // 8h
) {
  const secret = process.env.FE_AUTH_SECRET;
  if (!secret) throw new Error("FE_AUTH_SECRET missing");

  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload: FeSession = { ...session, exp: Math.floor(Date.now() / 1000) + ttlSeconds };
  const payloadB64 = b64url(JSON.stringify(payload));
  const data = `${header}.${payloadB64}`;
  const sig = b64url(hmac(data, secret));
  return `${data}.${sig}`;
}

export function verifyFeSession(token: string): FeSession | null {
  const secret = process.env.FE_AUTH_SECRET;
  if (!secret) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [h, p, s] = parts;
  const data = `${h}.${p}`;
  const expected = b64url(hmac(data, secret));

  const a = Buffer.from(s);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;
  if (!crypto.timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(unb64url(p).toString("utf8")) as FeSession;
    if (!payload?.u || !payload?.role || !payload?.exp) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function getCookieFromHeader(cookieHeader: string | undefined, name: string) {
  const cookie = cookieHeader || "";
  const m = cookie.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return m?.[1] ? decodeURIComponent(m[1]) : null;
}

export function getFeSessionFromReqCookie(cookieHeader: string | undefined) {
  const token = getCookieFromHeader(cookieHeader, COOKIE_NAME);
  if (!token) return null;
  return verifyFeSession(token);
}

export function feCookieHeader(token: string, maxAgeSeconds = 60 * 60 * 8) {
  const secure = process.env.NODE_ENV === "production" ? " Secure;" : "";
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds};${secure}`;
}

export function clearFeCookieHeader() {
  const secure = process.env.NODE_ENV === "production" ? " Secure;" : "";
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0;${secure}`;
}
