import type { NextApiRequest, NextApiResponse } from "next";
import { getFeSessionFromReqCookie } from "../../../lib/feAuth";
import * as SA from "../../../lib/supabaseAdmin";


const supabaseAdmin = (SA as any).supabaseAdmin || (SA as any).default;

function clean(s: any) {
  return typeof s === "string" ? s.trim() : "";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sess = getFeSessionFromReqCookie(req.headers.cookie);
  if (!sess) return res.status(401).json({ error: "No autorizado" });

  if (!supabaseAdmin) return res.status(500).json({ error: "supabaseAdmin no disponible (export)" });

  if (req.method === "GET") {
    const { data, error } = await supabaseAdmin
      .from("fe_user_business")
      .select("role, fe_businesses(*)")
      .eq("user_email", sess.u)
      .limit(1)
      .maybeSingle();

    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(200).json({ business: null });
    return res.status(200).json({ business: data.fe_businesses, role: data.role });
  }

  if (req.method === "POST") {
    const ruc = clean(req.body?.ruc);
    const razon_social = clean(req.body?.razon_social);
    const nombre_comercial = clean(req.body?.nombre_comercial);
    const email = clean(req.body?.email);
    const telefono = clean(req.body?.telefono);
    const direccion_matriz = clean(req.body?.direccion_matriz);

    if (!/^\d{13}$/.test(ruc)) return res.status(400).json({ error: "RUC inválido (13 dígitos)" });
    if (!razon_social || razon_social.length < 3) return res.status(400).json({ error: "Razón social obligatoria" });

    const { data: b, error: bErr } = await supabaseAdmin
      .from("fe_businesses")
      .insert({
        ruc,
        razon_social,
        nombre_comercial,
        email,
        telefono,
        direccion_matriz,
        sri_env: "TEST",
        onboarding_status: "DRAFT"
      })
      .select("*")
      .single();

    if (bErr) {
      const msg = (bErr.message || "").toLowerCase();
      if (msg.includes("duplicate") || msg.includes("unique")) {
        return res.status(409).json({ error: "Ese RUC ya está registrado." });
      }
      return res.status(500).json({ error: bErr.message });
    }

    const { error: linkErr } = await supabaseAdmin
      .from("fe_user_business")
      .insert({
        user_email: sess.u,
        business_id: b.id,
        role: "ADMIN"
      });

    if (linkErr) return res.status(500).json({ error: linkErr.message });

    return res.status(201).json({ business: b });
  }

  return res.status(405).json({ error: "Método no permitido" });
}
