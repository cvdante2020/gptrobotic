// pages/api/visa/score.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { getCookie, verify, visaCookieName } from "../../../lib/visaAuth";
import { buildQuestionBank } from "../../../lib/visaQuestionBank";

const THRESHOLD = 70;

const HARD_FLAGS = [
  {
    id: "flag_overstay",
    when: (a: any) => a["overstay_history"] === "yes",
    cap: 35,
    eligible: false,
    message: "Reportas sobreestadía previa. Factor de alto impacto."
  },
  {
    id: "flag_illegal_us",
    when: (a: any) => a["illegal_presence_us"] === "yes",
    cap: 25,
    eligible: false,
    message: "Presencia irregular previa en EE.UU. Factor crítico."
  },
  {
    id: "flag_intent_work",
    when: (a: any) => a["intent_work_or_study"] === "yes",
    cap: 20,
    eligible: false,
    message: "Intención de trabajar/estudiar con B1/B2 no corresponde. Alto riesgo."
  }
];

function bucket(score: number) {
  if (score < 40) return "BAJO";
  if (score < 60) return "MEDIO";
  if (score < 75) return "ALTO";
  return "MUY_ALTO";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const signed = getCookie(req, visaCookieName);
  const sessionId = signed ? verify(signed) : null;
  if (!sessionId) return res.status(401).json({ error: "Unauthorized" });

  const { profile, questions, answers, policy_version } = req.body || {};
  if (!profile || !Array.isArray(questions) || typeof answers !== "object") {
    return res.status(400).json({ error: "Missing profile/questions/answers" });
  }

  // Validaciones mínimas de perfil (pasaporte libre)
  const full_name = String(profile.full_name || "").trim();
  const id_number = String(profile.id_number || "").trim();
  const email = String(profile.email || "").trim();
  const phone = String(profile.phone || "").trim();

  if (full_name.length < 5) return res.status(400).json({ error: "Nombre inválido" });
  if (id_number.length < 5 || id_number.length > 20) return res.status(400).json({ error: "Cédula/Pasaporte inválido" });
  if (!email.includes("@") || email.length < 6) return res.status(400).json({ error: "Email inválido" });
  if (phone.length < 7 || phone.length > 20) return res.status(400).json({ error: "Celular inválido" });

  const bank = buildQuestionBank();
  const bankMap = new Map(bank.map(q => [q.id, q]));

  let raw = 0;
  let min = 0;
  let max = 0;

  const contributions: any[] = [];

  for (const qid of questions) {
    const q = bankMap.get(qid);
    if (!q) return res.status(400).json({ error: `Unknown question: ${qid}` });

    const a = answers[qid];
    if (!a) return res.status(400).json({ error: `Missing answer for: ${qid}` });

    const opt = q.options.find(o => o.value === a);
    if (!opt) return res.status(400).json({ error: `Invalid option for: ${qid}` });

    raw += opt.score;
    min += Math.min(...q.options.map(o => o.score));
    max += Math.max(...q.options.map(o => o.score));

    if (opt.score !== 0) contributions.push({ label: q.label, section: q.section, delta: opt.score, why: opt.why });
  }

  const denom = (max - min) || 1;
  let score = Math.round(((raw - min) / denom) * 100);
  score = Math.max(0, Math.min(100, score));

  const flags: any[] = [];
  let scoreCap: number | null = null;
  let eligibleOverride: boolean | null = null;

  for (const f of HARD_FLAGS) {
    if (f.when(answers)) {
      flags.push({ id: f.id, message: f.message });
      scoreCap = scoreCap === null ? f.cap : Math.min(scoreCap, f.cap);
      eligibleOverride = false;
    }
  }

  if (scoreCap !== null) score = Math.min(score, scoreCap);

  const b = bucket(score);
  let eligible = score >= THRESHOLD;
  if (eligibleOverride !== null) eligible = eligibleOverride;

  contributions.sort((x, y) => Math.abs(y.delta) - Math.abs(x.delta));
  const top_factors = contributions.slice(0, 8);

  // Guardar intento (incluyendo profile)
  const { error } = await supabaseAdmin.from("visa_attempts").insert([{
    session_id: sessionId,
    policy_version: policy_version || "1.0",
    profile: { full_name, id_number, email, phone },
    questions,
    answers,
    score,
    bucket: b,
    eligible_for_phase2: eligible,
    threshold: THRESHOLD,
    flags,
    top_factors
  }]);

  if (error) return res.status(500).json({ error: error.message });

  return res.json({
    score,
    bucket: b,
    eligible_for_phase2: eligible,
    threshold: THRESHOLD,
    flags,
    top_factors,
    disclaimer: "Estimación informativa. No garantiza aprobación. No es asesoría legal."
  });
}
