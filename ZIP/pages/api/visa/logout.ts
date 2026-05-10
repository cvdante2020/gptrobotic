import type { NextApiRequest, NextApiResponse } from "next";
import { visaCookieName } from "../../../lib/visaAuth";
import { useRouter } from "next/router";


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader(
    "Set-Cookie",
    `${visaCookieName}=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0`
  );
  res.json({ ok: true });
}
