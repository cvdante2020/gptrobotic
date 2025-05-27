import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { nombre, email, celular, mensaje, sector } = req.body;

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  try {
    console.log("EMAIL_FROM:", process.env.EMAIL_FROM);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✔️ Presente" : "❌ Faltante");
    console.log("EMAIL_TO:", process.env.EMAIL_TO);

    const transporter = nodemailer.createTransport({
      host: "smtpout.secureserver.net",
      port: 465,
      secure: true,
     auth: {
  user: "cavillarreal@gptrobotic.com",
  pass: "sIst2m1s202@.",
},

      tls: {
        rejectUnauthorized: false,
      },
    });
if (!process.env.EMAIL_TO) {
  console.warn("⚠️ EMAIL_TO no definido, usando fallback");
}

   await transporter.sendMail({
  from: `GPTROBOTIC <${process.env.EMAIL_FROM || "cavillarreal@gptrobotic.com"}>`,
  to: process.env.EMAIL_TO || "cavillarreal@gptrobotic.com", // 🔥 aquí evitamos error
  subject: "Nuevo mensaje desde GPTROBOTIC",
  html: `
    <h2>Nuevo mensaje de contacto</h2>
    <p><strong>Sector:</strong> ${sector || "General"}</p>
    <p><strong>Nombre:</strong> ${nombre}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Celular:</strong> ${celular}</p>
    <p><strong>Mensaje:</strong><br/>${mensaje}</p>
  `,
});


    return res.status(200).json({ message: "Mensaje enviado con éxito" });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("❌ Error al enviar el correo:", errorMsg);
    return res.status(500).json({ message: "Error al enviar el mensaje" });
  }
}
