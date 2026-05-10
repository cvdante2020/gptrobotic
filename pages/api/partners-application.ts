import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../lib/supabaseAdmin";

type Role = "ambassador" | "advertiser";

function cleanText(value: unknown) {
  return String(value || "").trim();
}

function digits(value: unknown) {
  return cleanText(value).replace(/\D/g, "");
}

function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function randomPassword() {
  const seed = `${crypto.randomUUID()}-${Date.now()}-${Math.random()}`;
  return `${seed.replace(/[^a-zA-Z0-9]/g, "").slice(0, 28)}Aa1!`;
}

function makeReferralCode(fullName: string) {
  const prefix = fullName
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 6);

  return `${prefix || "AMB"}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Método no permitido" });
  }

  try {
    const body = req.body || {};
    const role = cleanText(body.role) as Role;
    const fullName = cleanText(body.fullName);
    const email = cleanText(body.email).toLowerCase();
    const phone = digits(body.phone);
    const province = cleanText(body.province);
    const city = cleanText(body.city);
    const documentId = digits(body.documentId);

    if (role !== "ambassador" && role !== "advertiser") {
      return res.status(400).json({ ok: false, message: "Tipo de solicitud inválido." });
    }

    if (fullName.length < 3) {
      return res.status(400).json({ ok: false, message: "Ingresa tu nombre completo." });
    }

    if (!validEmail(email)) {
      return res.status(400).json({ ok: false, message: "Ingresa un correo válido." });
    }

    if (phone.length < 9) {
      return res.status(400).json({ ok: false, message: "Ingresa un celular válido." });
    }

    if (!province || !city) {
      return res.status(400).json({ ok: false, message: "Selecciona provincia y ciudad." });
    }

    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: randomPassword(),
      email_confirm: false,
      user_metadata: {
        full_name: fullName,
        source: "gptrobotic_public_application",
        requested_role: role,
      },
    });

    if (authError || !authUser.user) {
      const msg = authError?.message?.toLowerCase().includes("already")
        ? "Este correo ya tiene una solicitud o cuenta registrada. Usa otro correo o espera la revisión."
        : authError?.message || "No se pudo crear la solicitud.";

      return res.status(400).json({ ok: false, message: msg });
    }

    const referralCode = role === "ambassador" ? makeReferralCode(fullName) : null;

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("partners_profiles")
      .insert({
        user_id: authUser.user.id,
        role,
        status: "pending",
        full_name: fullName,
        email,
        phone,
        city,
        province,
        document_id: documentId || null,
        address: cleanText(body.address) || null,
        facebook_url: cleanText(body.facebookUrl) || null,
        instagram_url: cleanText(body.instagramUrl) || null,
        tiktok_url: cleanText(body.tiktokUrl) || null,
        experience_summary: role === "ambassador" ? cleanText(body.experienceSummary) || null : null,
        has_sales_experience: role === "ambassador" ? Boolean(body.hasSalesExperience) : false,
        has_sports_contacts: role === "ambassador" ? Boolean(body.hasSportsContacts) : false,
        known_leagues_count: role === "ambassador" ? Number(body.knownLeaguesCount || 0) : 0,
        motivation: role === "ambassador" ? cleanText(body.motivation) || null : null,
        referral_code: referralCode,
        referred_by_code: cleanText(body.referredByCode) || null,
        can_manage_ads_for_clients: false,
      })
      .select("id")
      .single();

    if (profileError || !profile) {
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      return res.status(500).json({ ok: false, message: profileError?.message || "No se pudo guardar el perfil." });
    }

    if (role === "advertiser") {
      const businessName = cleanText(body.businessName);
      const businessCategory = cleanText(body.businessCategory);

      if (!businessName || !businessCategory) {
        return res.status(400).json({ ok: false, message: "Completa los datos del negocio." });
      }

      const { error: advertiserError } = await supabaseAdmin.from("partners_advertisers").insert({
        owner_profile_id: profile.id,
        business_name: businessName,
        owner_name: fullName,
        phone,
        email,
        city,
        province,
        status: "pending",
        tax_id: cleanText(body.taxId) || null,
        business_address: cleanText(body.businessAddress) || null,
        business_category: businessCategory,
        facebook_url: cleanText(body.facebookUrl) || null,
        instagram_url: cleanText(body.instagramUrl) || null,
        referred_by_code: cleanText(body.referredByCode) || null,
      });

      if (advertiserError) {
        return res.status(500).json({ ok: false, message: advertiserError.message || "No se pudo guardar el anunciante." });
      }
    }

    return res.status(200).json({
      ok: true,
      message: "Solicitud recibida. Nuestro equipo revisará tu perfil antes de activar cualquier acceso.",
    });
  } catch (error: any) {
    return res.status(500).json({ ok: false, message: error?.message || "Error interno" });
  }
}
