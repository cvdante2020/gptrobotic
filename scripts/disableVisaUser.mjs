import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !service) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local");
  process.exit(1);
}

const supabase = createClient(url, service, { auth: { persistSession: false } });

const username = process.argv[2];
if (!username) {
  console.log("Uso: node scripts/disableVisaUser.mjs <usuario>");
  process.exit(1);
}

const { data, error } = await supabase
  .from("visa_users")
  .update({ is_active: false })
  .eq("username", username)
  .select("id, username, is_active")
  .single();

if (error) {
  console.error("Error:", error.message);
  process.exit(1);
}

console.log("⛔ Usuario desactivado:", data);
