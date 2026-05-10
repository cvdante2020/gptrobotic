import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function countBy(rows: any[], keyFn: (r: any) => string) {
  const m = new Map<string, number>();
  for (const r of rows) {
    const k = keyFn(r);
    m.set(k, (m.get(k) || 0) + 1);
  }
  return [...m.entries()]
    .map(([key, n]) => ({ key, n }))
    .sort((a, b) => b.n - a.n);
}

function isValidRow(r: any) {
  const a = r?.answers || {};
  const okCaptcha = a.captcha_passed === true;
  const dur = Number(a.duration_seconds || 0);
  return okCaptcha && dur >= 12;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const formId = String(req.query.formId || "");
    const from = req.query.from ? String(req.query.from) : "";
    const to = req.query.to ? String(req.query.to) : "";

    if (!formId) return res.status(400).json({ ok: false, error: "Missing formId" });

    let q = supabase
      .from("survey_responses")
      .select("created_at, age_range, gender, parish, answers")
      .eq("form_id", formId);

    if (from) q = q.gte("created_at", from);
    if (to) q = q.lte("created_at", to);

    const { data, error } = await q;
    if (error) throw error;

    const valid = (data || []).filter(isValidRow);

    const age = countBy(valid, (r) => r.age_range || "(sin_dato)");
    const gender = countBy(valid, (r) => r.gender || "(sin_dato)");
    const parish = countBy(valid, (r) => (r.parish || "").trim() || "(sin_dato)");

    return res.status(200).json({
      ok: true,
      data: { total_valid: valid.length, age, gender, parish },
    });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || "Error" });
  }
}
