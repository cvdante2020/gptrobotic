// src/app/api/send-email/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { nombre, email, celular, mensaje, sector } = await req.json();

  if (!nombre || !email || !mensaje) {
    return NextResponse.json({ message: "Faltan campos obligatorios" }, { status: 400 });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtpout.secureserver.net",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.sendMail({
      from: `GPTROBOTIC <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_TO,
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

    return NextResponse.json({ message: "Mensaje enviado con éxito" });
  } catch (error: unknown) {
    const mensajeError = error instanceof Error ? error.message : String(error);
    console.error("Error al enviar el correo:", mensajeError);
    return NextResponse.json({ message: "Error al enviar el mensaje" }, { status: 500 });
  }
}
