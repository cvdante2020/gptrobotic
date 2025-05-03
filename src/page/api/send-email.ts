// src/pages/api/send-email.ts
import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { nombre, email, mensaje } = req.body;

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtpout.secureserver.net",
      port: 465,
      secure: true, // SSL
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false // Recomendado para evitar fallos con algunos proveedores
      }
    });

    
    await transporter.sendMail({
      from: `GPTROBOTIC <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_TO,
      subject: "Nuevo mensaje desde GPTROBOTIC",
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong><br/>${mensaje}</p>
      `
    });

    return res.status(200).json({ message: "Mensaje enviado con éxito" });
  } catch (error: any) {
    console.error("Error al enviar el correo:", error.response || error.message || error);
    return res.status(500).json({ message: "Error al enviar el mensaje" });
  }
}
