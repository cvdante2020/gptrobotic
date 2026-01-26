// pages/api/send-email.ts
import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

type Body = {
  nombre?: string;
  email?: string;
  celular?: string;
  mensaje?: string;
  sector?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { nombre, email, celular, mensaje, sector } = (req.body || {}) as Body;

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ message: "Faltan campos obligatorios (nombre, email, mensaje)" });
  }

  // ✅ Variables de entorno (tu .env.local)
  const FROM = process.env.EMAIL_FROM; // ej: cavillarreal@gptrobotic.com
  const PASS = process.env.EMAIL_PASS; // password del buzón (Workspace)
  const TO = process.env.EMAIL_TO || FROM; // a quién llega (si no hay, te lo manda a ti)

  if (!FROM || !PASS) {
    return res.status(500).json({
      message: "Faltan variables EMAIL_FROM o EMAIL_PASS en .env.local (y reinicia npm run dev).",
    });
  }

  try {
    // ✅ GoDaddy Workspace Email (am1.myprofessionalmail.com)
    const transporter = nodemailer.createTransport({
      host: "smtpout.secureserver.net",
      port: 465,
      secure: true,
      auth: {
        user: FROM, // IMPORTANTE: mismo que el FROM
        pass: PASS,
      },
      // si te da problemas de cert en local, déjalo; en prod puedes quitarlo
      tls: { rejectUnauthorized: false },
    });

    // ✅ Esto te da el error REAL si auth/host está mal
    await transporter.verify();

    await transporter.sendMail({
      // ✅ REGLA: from debe ser el mismo correo que autentica
      from: `GPTROBOTIC <${FROM}>`,
      to: TO || FROM,
      replyTo: email, // para que puedas responder directo al cliente
      subject: `Nuevo mensaje desde GPTROBOTIC${sector ? ` (${sector})` : ""}`,
      html: `
        <div style="font-family: Arial, sans-serif">
          <h2>Nuevo mensaje de contacto</h2>
          <p><strong>Sector:</strong> ${sector || "General"}</p>
          <p><strong>Nombre:</strong> ${nombre}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Celular:</strong> ${celular || ""}</p>
          <p><strong>Mensaje:</strong><br/>${String(mensaje).replace(/\n/g, "<br/>")}</p>
          <hr/>
          <p style="font-size:12px;color:#666">
            Este correo fue generado desde el formulario de GPTROBOTIC.
          </p>
        </div>
      `,
    });

    return res.status(200).json({ message: "Mensaje enviado con éxito" });
  } catch (err: any) {
    // ✅ Te devolvemos detalle para que no sea “misterioso”
    console.error("❌ SMTP ERROR:", err?.code, err?.response, err?.message);

    return res.status(500).json({
      message: "Error al enviar el mensaje",
      code: err?.code || null,
      detail: err?.response || err?.message || String(err),
    });
  }
  
}
