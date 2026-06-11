import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

type Body = {
  nombre?: string;
  email?: string;
  celular?: string;
  mensaje?: string;
  sector?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { nombre, email, celular, mensaje, sector } = (req.body || {}) as Body;

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ message: "Faltan campos obligatorios: nombre, email y mensaje." });
  }

  const FROM = process.env.EMAIL_FROM;
  const PASS = process.env.EMAIL_PASS;
  const TO = process.env.EMAIL_TO || FROM;

  if (!FROM || !PASS || !TO) {
    return res.status(500).json({
      message: "Faltan variables EMAIL_FROM, EMAIL_PASS o EMAIL_TO en el servidor.",
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtpout.secureserver.net",
      port: Number(process.env.EMAIL_PORT || 465),
      secure: String(process.env.EMAIL_SECURE || "true") === "true",
      auth: {
        user: FROM,
        pass: PASS,
      },
    });

    await transporter.sendMail({
      from: `GPT Robotic <${FROM}>`,
      to: TO,
      replyTo: email,
      subject: `Nuevo contacto GPT Robotic${sector ? ` - ${sector}` : ""}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
          <h2>Nuevo mensaje desde GPT Robotic</h2>
          <p><strong>Sector:</strong> ${escapeHtml(sector || "General")}</p>
          <p><strong>Nombre:</strong> ${escapeHtml(nombre)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Celular:</strong> ${escapeHtml(celular || "No ingresado")}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${escapeHtml(mensaje).replace(/\n/g, "<br />")}</p>
        </div>
      `,
    });

    return res.status(200).json({ message: "Mensaje enviado con éxito" });
  } catch (err: any) {
    console.error("SMTP ERROR:", err?.code, err?.response, err?.message);
    return res.status(500).json({
      message: "Error al enviar el mensaje.",
      detail: err?.response || err?.message || String(err),
    });
  }
}
