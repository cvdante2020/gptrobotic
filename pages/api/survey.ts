import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { supabaseAdmin } from "../../lib/supabaseAdmin";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { form_slug, parish, age_range, gender, vote_intent, certainty, answers } = req.body ?? {};

    if (!form_slug || !answers || typeof answers !== "object") {
      return res.status(400).json({ ok: false, error: "Payload inválido" });
    }

    // 1) Buscar formulario activo
    const { data: form, error: formErr } = await supabaseAdmin
      .from("survey_forms")
      .select("id,is_active")
      .eq("slug", form_slug)
      .single();

    if (formErr || !form?.is_active) {
      return res.status(404).json({ ok: false, error: "Formulario no disponible" });
    }

    // 2) Fingerprint (no guardes IP en claro)
    const ip =
      (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "0.0.0.0";
    const ua = (req.headers["user-agent"] as string | undefined) || "";
    const ref = (req.headers["referer"] as string | undefined) || "";

    const salt = process.env.SURVEY_FINGERPRINT_SALT || "change_me";
    const fp = crypto.createHash("sha256").update(`${ip}|${ua}|${salt}`).digest("hex");

    // 3) Anti-duplicado: 1 respuesta / 6 horas
    const since = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();
    const { data: recent } = await supabaseAdmin
      .from("survey_responses")
      .select("id")
      .eq("form_id", form.id)
      .eq("response_fingerprint", fp)
      .gte("created_at", since)
      .limit(1);

    if (recent && recent.length > 0) {
      return res.status(429).json({ ok: false, error: "Respuesta ya registrada recientemente" });
    }

    // 4) Guardar
    const cert = Number.isFinite(Number(certainty)) ? Number(certainty) : null;

    const { error: insErr } = await supabaseAdmin.from("survey_responses").insert({
      form_id: form.id,
      parish: parish ?? null,
      age_range: age_range ?? null,
      gender: gender ?? null,
      vote_intent: vote_intent ?? null,
      certainty: cert,
      answers,
      response_fingerprint: fp,
      user_agent: ua,
      referrer: ref,
    });

    if (insErr) return res.status(500).json({ ok: false, error: "No se pudo guardar" });

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, error: "Error" });
  }
}
