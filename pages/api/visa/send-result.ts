// pages/api/visa/send-result.ts
import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

type Payload = {
  profile?: { full_name?: string; id_number?: string; email?: string; phone?: string };
  result?: { score?: number; threshold?: number; disclaimer?: string; top_factors?: any[]; flags?: any[] };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  const { profile, result } = (req.body || {}) as Payload;

  if (!profile?.email || !profile?.full_name || typeof result?.score !== "number") {
    return res.status(400).json({ error: "Faltan campos (profile.email, profile.full_name, result.score)" });
  }

  const FROM = process.env.EMAIL_FROM;
  const PASS = process.env.EMAIL_PASS;
  const CC = process.env.EMAIL_TO; // opcional: copia a tu correo

  if (!FROM || !PASS) return res.status(500).json({ error: "Faltan EMAIL_FROM o EMAIL_PASS" });

  try {
    const transporter = nodemailer.createTransport({
      host: "smtpout.secureserver.net",
      port: 465,
      secure: true,
      auth: { user: FROM, pass: PASS },
      tls: { rejectUnauthorized: false },
    });

    await transporter.verify();

    const score = result.score!;
    const threshold = result.threshold ?? 70;
    const ok = score >= threshold;

    const html = `
      <div style="font-family:Arial,sans-serif">
        <h2>Resultado – Evaluación Visa Americana</h2>
        <p><b>Nombre:</b> ${profile.full_name}</p>
        <p><b>Documento:</b> ${profile.id_number || ""}</p>
        <p><b>Teléfono:</b> ${profile.phone || ""}</p>
        <hr/>
        <p style="font-size:18px"><b>Score:</b> <span style="font-size:26px;font-weight:800">${score}%</span></p>
        <p>${ok ? "✅ Perfil fuerte para continuar." : "⚠️ Perfil medio/bajo por ahora."}</p>

        ${
          result.top_factors?.length
            ? `<h3>Factores principales</h3><ul>${result.top_factors
                .slice(0, 6)
                .map((t: any) => `<li><b>${t.delta > 0 ? "+" : ""}${t.delta}</b> — ${t.label} <span style="color:#666">(${t.why})</span></li>`)
                .join("")}</ul>`
            : ""
        }

        ${
          result.flags?.length
            ? `<h3>Alertas</h3><ul>${result.flags.map((f: any) => `<li>${f.message}</li>`).join("")}</ul>`
            : ""
        }

        <hr/>
        <p style="font-size:12px;color:#666">
          ${result.disclaimer || "Esto es informativo. No garantiza aprobación. La decisión final es consular."}
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `GPTROBOTIC <${FROM}>`,
      to: profile.email,
      cc: CC || undefined,
      subject: "Tu resultado – Evaluación Visa Americana (GPTROBOTIC)",
      html,
    });

    return res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error("❌ SMTP ERROR:", err?.code, err?.response, err?.message);
    return res.status(500).json({ error: err?.response || err?.message || String(err) });
  }
}
