import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

function parseDate(v: any) {
  if (!v) return null;
  const d = new Date(String(v));
  return isNaN(d.getTime()) ? null : d.toISOString();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const formId = String(req.query.formId || process.env.REPORT_FORM_ID || "");
    if (!formId) return res.status(400).json({ ok: false, error: "Missing formId" });

    const from = parseDate(req.query.from);
    const to = parseDate(req.query.to);

    const { data, error } = await supabaseAdmin.rpc("report_summary", {
      p_form_id: formId,
      p_from: from,
      p_to: to,
      p_dedupe: true,
    });

    if (error) return res.status(500).json({ ok: false, error: error.message });
    return res.json({ ok: true, data: data?.[0] || null });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || "Unknown error" });
  }
}
