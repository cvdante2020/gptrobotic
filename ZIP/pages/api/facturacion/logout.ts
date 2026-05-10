import type { NextApiRequest, NextApiResponse } from "next";
import { clearFeCookieHeader } from "lib/feAuth";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Set-Cookie", clearFeCookieHeader());
  return res.status(200).json({ ok: true });
}