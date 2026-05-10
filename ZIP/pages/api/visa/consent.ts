// pages/api/visa/consent.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { getCookie, verify, visaCookieName } from "../../../lib/visaAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const signed = getCookie(req, visaCookieName);
  const sessionId = signed ? verify(signed) : null;
  if (!sessionId) return res.status(401).json({ error: "Unauthorized" });

  const { accepted, policy_version } = req.body || {};
  if (accepted !== true) return res.status(400).json({ error: "Consent required" });

  const ua = req.headers["user-agent"] || "";
  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0] || req.socket.remoteAddress || "";

  const { error } = await supabaseAdmin.from("visa_consents").insert([{
    session_id: sessionId,
    accepted: true,
    policy_version: policy_version || "1.0",
    user_agent: ua,
    ip
  }]);

  if (error) return res.status(500).json({ error: error.message });
  return res.json({ ok: true });
}
