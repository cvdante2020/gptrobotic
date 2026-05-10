import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { feCookieHeader, signFeSession } from "lib/feAuth";
import { supabaseAdmin } from "lib/supabaseAdmin";

function verifyPassword(pw: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const attempt = crypto.pbkdf2Sync(pw, salt, 120000, 32, "sha256").toString("hex");
  return crypto.timingSafeEqual(Buffer.from(attempt), Buffer.from(hash));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: "Usuario y clave son obligatorios" });

  if (!process.env.FE_AUTH_SECRET) return res.status(500).json({ error: "FE_AUTH_SECRET missing" });

  const { data, error } = await supabaseAdmin
    .from("fe_users")
    .select("username, password_hash, role, is_active")
    .eq("username", String(username).trim())
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });
  if (!data || !data.is_active) return res.status(401).json({ error: "Acceso denegado" });

  const ok = verifyPassword(String(password), data.password_hash);
  if (!ok) return res.status(401).json({ error: "Credenciales inválidas" });

  const token = signFeSession({ u: data.username, role: data.role });
  res.setHeader("Set-Cookie", feCookieHeader(token));
  return res.status(200).json({ ok: true });
}
