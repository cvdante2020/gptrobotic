import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "lib/supabaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const body = req.body;

    const { data, error } = await supabaseAdmin
      .from("partners_profiles")
      .insert({
        user_id: body.userId,
        role: body.role,
        status: "pending",
        full_name: body.fullName,
        email: body.email,
        phone: body.phone,
        province: body.province,
        city: body.city,
        document_id: body.documentId,
        address: body.address || null,
        facebook_url: body.facebookUrl || null,
        instagram_url: body.instagramUrl || null,
        tiktok_url: body.tiktokUrl || null,
        referred_by_code: body.referredByCode || null,
        known_leagues_count: body.knownLeaguesCount || 0,
        has_sales_experience: body.hasSalesExperience || false,
        has_sports_contacts: body.hasSportsContacts || false,
        experience_summary: body.experienceSummary || null,
        motivation: body.motivation || null,
      })
      .select("id")
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (body.role === "advertiser") {
      const { error: advertiserError } = await supabaseAdmin
        .from("partners_advertisers")
        .insert({
          owner_profile_id: data.id,
          business_name: body.businessName,
          owner_name: body.fullName,
          phone: body.phone,
          email: body.email,
          province: body.province,
          city: body.city,
          tax_id: body.taxId || null,
          business_category: body.businessCategory,
          business_address: body.businessAddress,
          facebook_url: body.facebookUrl || null,
          instagram_url: body.instagramUrl || null,
          referred_by_code: body.referredByCode || null,
          status: "pending",
        });

      if (advertiserError) {
        return res.status(400).json({ error: advertiserError.message });
      }
    }

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}