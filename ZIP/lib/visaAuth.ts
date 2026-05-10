import crypto from "crypto";
import type { NextApiRequest } from "next";

export const visaCookieName = "visa_session";
const secret = process.env.VISA_COOKIE_SECRET || "dev_secret_change_me";

export function sign(value: string) {
  const h = crypto.createHmac("sha256", secret).update(value).digest("hex");
  return `${value}.${h}`;
}

export function verify(signed: string) {
  const [value, h] = signed.split(".");
  if (!value || !h) return null;
  const expected = crypto.createHmac("sha256", secret).update(value).digest("hex");
  try {
    if (!crypto.timingSafeEqual(Buffer.from(h), Buffer.from(expected))) return null;
  } catch {
    return null;
  }
  return value;
}

export function getCookie(req: NextApiRequest, name: string) {
  const raw = req.headers.cookie || "";
  const m = raw.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}
