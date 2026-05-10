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

  // Validar que el usuario tenga negocio asignado
  const { data: ub, error: ubErr } = await supabaseAdmin
    .from("fe_user_business")
    .select("business_id, role")
    .eq("user_email", sess.u)
    .maybeSingle();

  if (ubErr) return res.status(500).json({ error: ubErr.message });
  if (!ub?.business_id) return res.status(400).json({ error: "Usuario sin negocio asignado" });

  if (req.method === "GET") {
    const branch_id = clean(req.query.branch_id);
    if (!branch_id) return res.status(400).json({ error: "branch_id requerido" });

    // Seguridad: el branch debe pertenecer al negocio del usuario
    const { data: br, error: brErr } = await supabaseAdmin
      .from("fe_branches")
      .select("id, business_id")
      .eq("id", branch_id)
      .maybeSingle();

    if (brErr) return res.status(500).json({ error: brErr.message });
    if (!br || br.business_id !== ub.business_id) return res.status(403).json({ error: "Branch no permitido" });

    const { data, error } = await supabaseAdmin
      .from("fe_emission_points")
      .select("id, business_id, branch_id, code, nombre, created_at")
      .eq("business_id", ub.business_id)
      .eq("branch_id", branch_id)
      .order("code", { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ points: data || [] });
  }

  if (req.method === "POST") {
    const branch_id = clean(req.body?.branch_id);
    const code = clean(req.body?.code);
    const nombre = clean(req.body?.nombre);

    if (!branch_id) return res.status(400).json({ error: "branch_id requerido" });
    if (!/^\d{3}$/.test(code)) return res.status(400).json({ error: "Código punto inválido (3 dígitos, ej 001)" });
    if (!nombre || nombre.length < 2) return res.status(400).json({ error: "Nombre de punto obligatorio" });

    // Seguridad: branch pertenece al negocio
    const { data: br, error: brErr } = await supabaseAdmin
      .from("fe_branches")
      .select("id, business_id")
      .eq("id", branch_id)
      .maybeSingle();

    if (brErr) return res.status(500).json({ error: brErr.message });
    if (!br || br.business_id !== ub.business_id) return res.status(403).json({ error: "Branch no permitido" });

    // Insert en tabla REAL: fe_emission_points
    const { data: p, error: pErr } = await supabaseAdmin
      .from("fe_emission_points")
      .insert({
        business_id: ub.business_id,
        branch_id,
        code,
        nombre
      })
      .select("*")
      .single();

    if (pErr) {
      const msg = (pErr.message || "").toLowerCase();
      if (msg.includes("duplicate") || msg.includes("unique")) {
        return res.status(409).json({ error: "Ese punto ya existe (código repetido)." });
      }
      return res.status(500).json({ error: pErr.message });
    }

    return res.status(201).json({ point: p });
  }

  return res.status(405).json({ error: "Método no permitido" });
}
