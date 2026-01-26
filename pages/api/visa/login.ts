import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { sign, visaCookieName } from "../../../lib/visaAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: "Missing credentials" });

  const { data: user, error } = await supabaseAdmin
    .from("visa_users")
    .select("id, username, password_hash, is_active")
    .eq("username", username)
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });
  if (!user || !user.is_active) return res.status(401).json({ error: "Credenciales inválidas" });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: "Credenciales inválidas" });

  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 12); // 12h
  const ua = req.headers["user-agent"] || "";
  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0] || req.socket.remoteAddress || "";

  const { data: session, error: e2 } = await supabaseAdmin
    .from("visa_sessions")
    .insert([{ user_id: user.id, username: user.username, expires_at: expiresAt.toISOString(), user_agent: ua, ip }])
    .select("id")
    .single();

  if (e2) return res.status(500).json({ error: e2.message });

  const cookieVal = sign(session.id);

  res.setHeader(
    "Set-Cookie",
    `${visaCookieName}=${encodeURIComponent(cookieVal)}; Path=/; HttpOnly; SameSite=Lax; Secure`
  );

  return res.json({ ok: true });
}
