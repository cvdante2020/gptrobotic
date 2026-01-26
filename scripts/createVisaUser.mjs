import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

/* ===== CARGA MANUAL DE .env.local ===== */
function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) {
    console.error("❌ No existe .env.local en la raíz del proyecto");
    process.exit(1);
  }

  const content = fs.readFileSync(envPath, "utf8");
  content.split(/\r?\n/).forEach(line => {
    if (!line || line.startsWith("#")) return;
    const idx = line.indexOf("=");
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  });
}

loadEnvLocal();

/* ===== VARIABLES ===== */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("❌ Faltan variables:");
  console.error("NEXT_PUBLIC_SUPABASE_URL:", url ? "OK" : "❌");
  console.error("SUPABASE_SERVICE_ROLE_KEY:", serviceKey ? "OK" : "❌");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false }
});

/* ===== INPUT ===== */
const username = process.argv[2];
const password = process.argv[3];

if (!username || !password) {
  console.log("Uso:");
  console.log("node scripts/createVisaUser.mjs <usuario> <clave>");
  process.exit(1);
}

/* ===== CREACIÓN ===== */
const password_hash = await bcrypt.hash(password, 10);

const { data, error } = await supabase
  .from("visa_users")
  .insert([{ username, password_hash, is_active: true }])
  .select("id, username, is_active, created_at")
  .single();

if (error) {
  console.error("❌ Error Supabase:", error.message);
  process.exit(1);
}

console.log("✅ Usuario creado correctamente:");
console.table(data);
