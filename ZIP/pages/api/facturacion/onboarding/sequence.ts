import type { NextApiRequest, NextApiResponse } from "next";
import { getFeSessionFromReqCookie } from "../../../../lib/feAuth";
import * as SA from "../../../../lib/supabaseAdmin";

const supabaseAdmin = (SA as any).supabaseAdmin || (SA as any).default;

function clean(s: any) {
  return typeof s === "string" ? s.trim() : "";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sess = getFeSessionFromReqCookie(req.headers.cookie);
  if (!sess) return res.status(401).json({ error: "No autorizado" });
  if (!supabaseAdmin) return res.status(500).json({ error: "supabaseAdmin no disponible" });

  // business_id del usuario
  const { data: ub, error: ubErr } = await supabaseAdmin
    .from("fe_user_business")
    .select("business_id")
    .eq("user_email", sess.u)
    .limit(1)
    .maybeSingle();

  if (ubErr) return res.status(500).json({ error: ubErr.message });
  if (!ub?.business_id) return res.status(400).json({ error: "Usuario sin negocio asociado" });

  const business_id = ub.business_id;

  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  const branch_id = clean(req.body?.branch_id);
  const point_id = clean(req.body?.point_id);
  const doc_type = clean(req.body?.doc_type || "01"); // factura

  if (!branch_id || !point_id) return res.status(400).json({ error: "branch_id y point_id requeridos" });

  const series = await (async () => {
    // obtener códigos
    const { data: br } = await supabaseAdmin.from("fe_branches").select("code").eq("id", branch_id).maybeSingle();
    const { data: pt } = await supabaseAdmin.from("fe_emission_points").select("code").eq("id", point_id).maybeSingle();
    const bcode = br?.code || "001";
    const pcode = pt?.code || "001";
    return `${bcode}-${pcode}`;
  })();

  // si ya existe
  const { data: existing, error: eErr } = await supabaseAdmin
    .from("fe_sequences")
    .select("*")
    .eq("business_id", business_id)
    .eq("point_id", point_id)
    .eq("doc_type", doc_type)
    .maybeSingle();

  if (eErr) return res.status(500).json({ error: eErr.message });
  if (existing) return res.status(200).json({ sequence: existing });

  // crear
  const { data: seq, error: sErr } = await supabaseAdmin
    .from("fe_sequences")
    .insert({
      business_id,
      branch_id,
      point_id,
      doc_type,
      series,
      current_number: 0,
      padding: 9
    })
    .select("*")
    .single();

  if (sErr) return res.status(500).json({ error: sErr.message });
  return res.status(201).json({ sequence: seq });
}
