import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { sign, visaCookieName } from "../../../lib/visaAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: "Ingresa usuario y contraseña." });

  const { data: user, error } = await supabaseAdmin
    .from("visa_users")
    .select("id, username, password_hash, is_active, attempts_used, attempts_max")
    .eq("username", username)
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });
  if (!user || !user.is_active) return res.status(401).json({ error: "Credenciales inválidas." });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: "Credenciales inválidas." });

  const attemptsUsed = Number(user.attempts_used ?? 0);
  const attemptsMax = Number(user.attempts_max ?? 3);
  const remainingAttempts = Math.max(0, attemptsMax - attemptsUsed);

  if (remainingAttempts <= 0) {
    return res.status(403).json({
      error: "Ya utilizaste todas tus evaluaciones disponibles. Solicita nuevas credenciales por WhatsApp.",
      remaining_attempts: 0,
    });
  }

  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 12);
  const ua = req.headers["user-agent"] || "";
  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0] || req.socket.remoteAddress || "";

  const { data: session, error: e2 } = await supabaseAdmin
    .from("visa_sessions")
    .insert([{ user_id: user.id, username: user.username, expires_at: expiresAt.toISOString(), user_agent: ua, ip }])
    .select("id")
    .single();

  if (e2) return res.status(500).json({ error: e2.message });

  const cookieVal = sign(session.id);
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";

  res.setHeader(
    "Set-Cookie",
    `${visaCookieName}=${encodeURIComponent(cookieVal)}; Path=/; HttpOnly; SameSite=Lax${secure}; Max-Age=${60 * 60 * 12}`
  );

  return res.json({ ok: true, remaining_attempts: remainingAttempts });
}
