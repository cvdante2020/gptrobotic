import type { NextApiRequest, NextApiResponse } from "next";

function setCookie(res: NextApiResponse, name: string, value: string) {
  // cookie simple (httpOnly) por 7 días
  const maxAge = 60 * 60 * 24 * 7;
  res.setHeader(
    "Set-Cookie",
    `${name}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`
  );
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ ok: false });

  const { pin } = req.body || {};
  const expected = process.env.ADMIN_DASH_PIN || "";

  if (!expected) {
    return res.status(500).json({
      ok: false,
      error: "Falta ADMIN_DASH_PIN en .env.local",
    });
  }

  if (String(pin || "") !== expected) {
    return res.status(401).json({ ok: false, error: "PIN incorrecto" });
  }

  setCookie(res, "admin_auth", "1");
  return res.json({ ok: true });
}
