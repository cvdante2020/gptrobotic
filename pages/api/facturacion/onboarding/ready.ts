// pages/api/facturacion/onboarding/ready.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getFeSessionFromReqCookie } from "../../../../lib/feAuth";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

function pad3(s: string) {
  const x = (s || "").trim();
  return x.padStart(3, "0").slice(-3);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  const sess = getFeSessionFromReqCookie(req.headers.cookie);
  if (!sess) return res.status(401).json({ error: "No autorizado" });

  // 1) Obtener business_id y role del usuario
  const { data: ub, error: ubErr } = await supabaseAdmin
    .from("fe_user_business")
    .select("business_id, role")
    .eq("user_email", sess.u)
    .limit(1)
    .maybeSingle();

  if (ubErr) return res.status(500).json({ error: ubErr.message });
  if (!ub?.business_id) return res.status(400).json({ error: "No tienes negocio asociado" });

  const businessId = ub.business_id;

  // 2) Traer branches del negocio
  const { data: branches, error: brErr } = await supabaseAdmin
    .from("fe_branches")
    .select("id, code, nombre")
    .eq("business_id", businessId)
    .order("code", { ascending: true });

  if (brErr) return res.status(500).json({ error: brErr.message });

  const branchIds = (branches || []).map((b) => b.id);
  if (branchIds.length === 0) {
    return res.status(400).json({ error: "Falta crear al menos un establecimiento." });
  }

  const branchById = new Map<string, any>();
  for (const b of branches || []) branchById.set(b.id, b);

  // 3) Traer puntos de emisión de esos branches
  const { data: points, error: ptErr } = await supabaseAdmin
    .from("fe_emission_points")
    .select("id, branch_id, code, nombre")
    .in("branch_id", branchIds)
    .order("code", { ascending: true });

  if (ptErr) return res.status(500).json({ error: ptErr.message });
  if (!points || points.length === 0) {
    return res.status(400).json({ error: "Falta crear al menos un punto de emisión." });
  }

  // Helper: crea o asegura secuencia DOC 01 por punto
  const ensureSequence01 = async (p: any) => {
    const br = branchById.get(p.branch_id);
    const branchCode = pad3(br?.code || "001");
    const pointCode = pad3(p.code || "001");
    const series = `${branchCode}${pointCode}`; // ej: 001001

    // Upsert por UNIQUE (business_id, point_id, doc_type)
    const { data: seq, error: seqErr } = await supabaseAdmin
      .from("fe_sequences")
      .upsert(
        {
          business_id: businessId,
          branch_id: p.branch_id,
          point_id: p.id,
          doc_type: "01",
          series,
          current_number: 0,
          padding: 9,
        },
        { onConflict: "business_id,point_id,doc_type" }
      )
      .select("id, business_id, point_id, doc_type, series")
      .single();

    if (seqErr) throw new Error(seqErr.message);
    return seq;
  };

  // Helper: asegura al menos 1 bloque AVAILABLE para una secuencia
  const ensureAvailableBlock = async (seq: any) => {
    // OJO: doc_type NO está en fe_sequence_blocks, se filtra por join o por sequence_id
    const { data: existing, error: exErr } = await supabaseAdmin
      .from("fe_sequence_blocks")
      .select("id, status, next_number, start_number, end_number")
      .eq("business_id", businessId)
      .eq("sequence_id", seq.id)
      .eq("point_id", seq.point_id)
      .eq("status", "AVAILABLE")
      .limit(1)
      .maybeSingle();

    if (exErr) throw new Error(exErr.message);
    if (existing) return existing;

    // Crear bloque inicial por defecto (puedes ajustar rango)
    const { data: created, error: crErr } = await supabaseAdmin
      .from("fe_sequence_blocks")
      .insert({
        business_id: businessId,
        sequence_id: seq.id,
        point_id: seq.point_id,
        start_number: 1,
        end_number: 200,
        next_number: 1,
        status: "AVAILABLE",
        device_id: "SYSTEM",
      })
      .select("*")
      .single();

    if (crErr) throw new Error(crErr.message);
    return created;
  };

  try {
    // 4) Por cada punto: asegurar seq 01 + bloque available
    const results: any[] = [];
    for (const p of points) {
      const seq = await ensureSequence01(p);
      const blk = await ensureAvailableBlock(seq);
      results.push({ point_id: p.id, series: seq.series, sequence_id: seq.id, block_id: blk.id });
    }

    // 5) Marcar negocio como READY
    const { error: upErr } = await supabaseAdmin
      .from("fe_businesses")
      .update({ onboarding_status: "READY" })
      .eq("id", businessId);

    if (upErr) return res.status(500).json({ error: upErr.message });

    return res.status(200).json({
      ok: true,
      message: "Onboarding listo. DOC 01 asegurada en puntos.",
      created: results,
    });
  } catch (e: any) {
    return res.status(400).json({ error: e?.message || "Error finalizando onboarding" });
  }
}
