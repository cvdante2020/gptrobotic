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

  // obtener business del usuario
  const { data: link, error: linkErr } = await supabaseAdmin
    .from("fe_user_business")
    .select("business_id")
    .eq("user_email", sess.u)
    .limit(1)
    .maybeSingle();

  if (linkErr) return res.status(500).json({ error: linkErr.message });
  if (!link?.business_id) return res.status(400).json({ error: "No tienes negocio asociado" });

  const business_id = link.business_id;

  if (req.method === "GET") {
    const { data, error } = await supabaseAdmin
      .from("fe_branches")
      .select("*")
      .eq("business_id", business_id)
      .order("code", { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ branches: data || [] });
  }

  if (req.method === "POST") {
    const code = clean(req.body?.code);
    const nombre = clean(req.body?.nombre);
    const direccion = clean(req.body?.direccion);
    const ciudad = clean(req.body?.ciudad);

    if (!/^[0-9]{3}$/.test(code)) return res.status(400).json({ error: "Código debe ser 3 dígitos (ej: 001)" });
    if (!nombre) return res.status(400).json({ error: "Nombre es obligatorio" });

    const { data, error } = await supabaseAdmin
      .from("fe_branches")
      .insert({ business_id, code, nombre, direccion, ciudad, is_active: true })
      .select("*")
      .single();

    if (error) {
      const msg = (error.message || "").toLowerCase();
      if (msg.includes("duplicate") || msg.includes("unique")) {
        return res.status(409).json({ error: "Ese establecimiento ya existe (código repetido)." });
      }
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ branch: data });
  }

  return res.status(405).json({ error: "Método no permitido" });
}
