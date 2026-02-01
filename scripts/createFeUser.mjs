import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL;

const SUPABASE_SERVICE_ROLE =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE ||
  process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
  console.error("Falta NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

function hashPassword(pw) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(pw, salt, 120000, 32, "sha256").toString("hex");
  return `${salt}:${hash}`;
}

const username = process.argv[2];
const password = process.argv[3];
const role = process.argv[4] || "ADMIN";

if (!username || !password) {
  console.log("Uso: node scripts/createFeUser.mjs <username> <password> [ROLE]");
  process.exit(1);
}

(async () => {
  const { error } = await supabase.from("fe_users").insert({
    username,
    password_hash: hashPassword(password),
    role,
    is_active: true
  });

  if (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }

  console.log("✅ Usuario FE creado:", username, "role:", role);
  console.log("SUPABASE_URL?", !!SUPABASE_URL);
console.log("SERVICE_ROLE?", !!SUPABASE_SERVICE_ROLE);

})();
