import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
      .select("created_at, age_range, answers")
      .eq("form_id", formId);

    if (from) q = q.gte("created_at", from);
    if (to) q = q.lte("created_at", to);

    const { data, error } = await q;
    if (error) throw error;

    const valid = (data || []).filter(isValidRow);

    const matrix = new Map<string, Map<string, number>>();

    for (const r of valid) {
      const age = r.age_range || "(sin_dato)";
      const vote = (r.answers?.vote_choice as string) || "(sin_respuesta)";
      if (!matrix.has(age)) matrix.set(age, new Map());
      const mm = matrix.get(age)!;
      mm.set(vote, (mm.get(vote) || 0) + 1);
    }

    const ages = [...matrix.keys()];
    const votesSet = new Set<string>();
    for (const mm of matrix.values()) for (const k of mm.keys()) votesSet.add(k);
    const votes = [...votesSet];

    const series = ages.map((age) => {
      const mm = matrix.get(age)!;
      const obj: any = { age_range: age, total: 0 };
      for (const v of votes) {
        const n = mm.get(v) || 0;
        obj[v] = n;
        obj.total += n;
      }
      return obj;
    });

    series.sort((a, b) => b.total - a.total);

    return res.status(200).json({ ok: true, data: { votes, series } });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || "Error" });
  }
}
