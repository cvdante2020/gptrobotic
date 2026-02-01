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

  const sequence_id = clean(req.body?.sequence_id);
  const point_id = clean(req.body?.point_id);
  const size = Number(req.body?.size || 100);
  const device_id = clean(req.body?.device_id || "");

  if (!sequence_id || !point_id) return res.status(400).json({ error: "sequence_id y point_id requeridos" });
  if (!Number.isFinite(size) || size < 10 || size > 10000) return res.status(400).json({ error: "size inválido" });

  // leer secuencia
  const { data: seq, error: sErr } = await supabaseAdmin
    .from("fe_sequences")
    .select("*")
    .eq("id", sequence_id)
    .eq("business_id", business_id)
    .maybeSingle();

  if (sErr) return res.status(500).json({ error: sErr.message });
  if (!seq) return res.status(404).json({ error: "Secuencia no encontrada" });

  // reservar rango:
  const start = Number(seq.current_number) + 1;
  const end = start + size - 1;

  // actualizar current_number al final del bloque (para no repetir)
  const { error: upErr } = await supabaseAdmin
    .from("fe_sequences")
    .update({ current_number: end })
    .eq("id", sequence_id);

  if (upErr) return res.status(500).json({ error: upErr.message });

  // crear bloque OPEN
  const { data: block, error: bErr } = await supabaseAdmin
    .from("fe_sequence_blocks")
    .insert({
      business_id,
      sequence_id,
      point_id,
      start_number: start,
      end_number: end,
      next_number: start,
      status: "OPEN",
      device_id: device_id || null
    })
    .select("*")
    .single();

  if (bErr) return res.status(500).json({ error: bErr.message });

  return res.status(201).json({ block });
}
