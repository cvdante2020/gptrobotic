// pages/api/visa/start.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { getCookie, verify, visaCookieName } from "../../../lib/visaAuth";
import { buildQuestionBank, pickQuestions } from "../../../lib/visaQuestionBank";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const signed = getCookie(req, visaCookieName);
  const sessionId = signed ? verify(signed) : null;
  if (!sessionId) return res.status(401).json({ error: "Unauthorized" });

  const { data: session, error } = await supabaseAdmin
    .from("visa_sessions")
    .select("id, expires_at")
    .eq("id", sessionId)
    .single();

  if (error || !session) return res.status(401).json({ error: "Invalid session" });
  if (new Date(session.expires_at).getTime() < Date.now()) return res.status(401).json({ error: "Session expired" });

  const bank = buildQuestionBank();
  const questions = pickQuestions(bank, 25);

  return res.json({
    policy_version: "1.0",
    questions: questions.map(q => ({
      id: q.id,
      section: q.section,
      label: q.label,
      type: q.type,
      required: q.required,
      options: q.options.map(o => ({ value: o.value, label: o.label }))
    }))
  });
}
