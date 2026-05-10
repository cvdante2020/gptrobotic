"use client";

import { useMemo, useState } from "react";
import { supabase } from "lib/supabaseClient";

type Role = "ambassador" | "advertiser";

const ECUADOR_LOCATIONS: Record<string, string[]> = {
  Azuay: ["Cuenca", "Camilo Ponce Enríquez", "Chordeleg", "El Pan", "Girón", "Guachapala", "Gualaceo", "Nabón", "Oña", "Paute", "Pucará", "San Fernando", "Santa Isabel", "Sevilla de Oro", "Sígsig"],
  Bolívar: ["Guaranda", "Caluma", "Chillanes", "Chimbo", "Echeandía", "Las Naves", "San Miguel"],
  Cañar: ["Azogues", "Biblián", "Cañar", "Déleg", "El Tambo", "La Troncal", "Suscal"],
  Carchi: ["Tulcán", "Bolívar", "Espejo", "Mira", "Montúfar", "San Pedro de Huaca"],
  Chimborazo: ["Riobamba", "Alausí", "Chambo", "Chunchi", "Colta", "Cumandá", "Guamote", "Guano", "Pallatanga", "Penipe"],
  Cotopaxi: ["Latacunga", "La Maná", "Pangua", "Pujilí", "Salcedo", "Saquisilí", "Sigchos"],
  "El Oro": ["Machala", "Arenillas", "Atahualpa", "Balsas", "Chilla", "El Guabo", "Huaquillas", "Las Lajas", "Marcabelí", "Pasaje", "Piñas", "Portovelo", "Santa Rosa", "Zaruma"],
  Esmeraldas: ["Esmeraldas", "Atacames", "Eloy Alfaro", "Muisne", "Quinindé", "Rioverde", "San Lorenzo"],
  Galápagos: ["San Cristóbal", "Isabela", "Santa Cruz"],
  Guayas: ["Guayaquil", "Alfredo Baquerizo Moreno", "Balao", "Balzar", "Colimes", "Daule", "Durán", "El Empalme", "El Triunfo", "General Antonio Elizalde", "Isidro Ayora", "Lomas de Sargentillo", "Marcelino Maridueña", "Milagro", "Naranjal", "Naranjito", "Nobol", "Palestina", "Pedro Carbo", "Playas", "Salitre", "Samborondón", "Santa Lucía", "Simón Bolívar", "Yaguachi"],
  Imbabura: ["Ibarra", "Antonio Ante", "Cotacachi", "Otavalo", "Pimampiro", "San Miguel de Urcuquí"],
  Loja: ["Loja", "Calvas", "Catamayo", "Celica", "Chaguarpamba", "Espíndola", "Gonzanamá", "Macará", "Olmedo", "Paltas", "Pindal", "Puyango", "Quilanga", "Saraguro", "Sozoranga", "Zapotillo"],
  "Los Ríos": ["Babahoyo", "Baba", "Buena Fe", "Mocache", "Montalvo", "Palenque", "Puebloviejo", "Quevedo", "Quinsaloma", "Urdaneta", "Valencia", "Ventanas", "Vinces"],
  Manabí: ["Portoviejo", "24 de Mayo", "Bolívar", "Chone", "El Carmen", "Flavio Alfaro", "Jama", "Jaramijó", "Jipijapa", "Junín", "Manta", "Montecristi", "Olmedo", "Paján", "Pedernales", "Pichincha", "Puerto López", "Rocafuerte", "San Vicente", "Santa Ana", "Sucre", "Tosagua"],
  "Morona Santiago": ["Morona", "Gualaquiza", "Huamboya", "Limón Indanza", "Logroño", "Pablo Sexto", "Palora", "San Juan Bosco", "Santiago", "Sucúa", "Taisha", "Tiwintza"],
  Napo: ["Tena", "Archidona", "Carlos Julio Arosemena Tola", "El Chaco", "Quijos"],
  Orellana: ["Francisco de Orellana", "Aguarico", "La Joya de los Sachas", "Loreto"],
  Pastaza: ["Pastaza", "Arajuno", "Mera", "Santa Clara"],
  Pichincha: ["Quito", "Cayambe", "Mejía", "Pedro Moncayo", "Pedro Vicente Maldonado", "Puerto Quito", "Rumiñahui", "San Miguel de los Bancos"],
  "Santa Elena": ["Santa Elena", "La Libertad", "Salinas"],
  "Santo Domingo de los Tsáchilas": ["Santo Domingo", "La Concordia"],
  Sucumbíos: ["Lago Agrio", "Cascales", "Cuyabeno", "Gonzalo Pizarro", "Putumayo", "Shushufindi", "Sucumbíos"],
  Tungurahua: ["Ambato", "Baños de Agua Santa", "Cevallos", "Mocha", "Patate", "Pelileo", "Píllaro", "Quero", "Tisaleo"],
  "Zamora Chinchipe": ["Zamora", "Centinela del Cóndor", "Chinchipe", "El Pangui", "Nangaritza", "Palanda", "Paquisha", "Yacuambi", "Yantzaza"],
};
function formatSupabaseError(message: string) {
  const lower = message.toLowerCase();

  if (lower.includes("invalid api key") || lower.includes("api key")) {
    return "No se pudo conectar con Supabase. Revisa NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local, luego reinicia npm run dev.";
  }

  if (lower.includes("user already registered") || lower.includes("already registered") || lower.includes("already exists")) {
    return "Este correo ya está registrado. Usa otro correo o solicita recuperación de acceso.";
  }

  return message;
}

function field(form: FormData, name: string) {
  return String(form.get(name) || "").trim();
}

function digits(value: string) {
  return value.replace(/\D/g, "");
}

function makeReferralCode(fullName: string) {
  const base = fullName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 8)
    .toUpperCase();
  return `${base || "GPT"}${Math.floor(1000 + Math.random() * 9000)}`;
}

export default function RegisterSection() {
  const [role, setRole] = useState<Role>("ambassador");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const cities = useMemo(() => (province ? ECUADOR_LOCATIONS[province] || [] : []), [province]);

  function validate(form: FormData) {
    const fullName = field(form, "fullName");
    const email = field(form, "email");
    const password = field(form, "password");
    const phone = digits(field(form, "phone"));
    const documentId = digits(field(form, "documentId"));

    if (fullName.length < 5) return "Ingresa tu nombre completo.";
    if (!email.includes("@")) return "Ingresa un correo válido.";
    if (password.length < 6) return "La contraseña debe tener mínimo 6 caracteres.";
    if (phone.length < 8) return "Ingresa un celular válido.";
    if (documentId.length < 8) return "Ingresa un documento válido.";
    if (!province) return "Selecciona una provincia.";
    if (!city) return "Selecciona una ciudad.";

    if (role === "ambassador") {
      if (field(form, "experienceSummary").length < 10) return "Cuéntanos un poco más sobre tu experiencia.";
      if (field(form, "motivation").length < 10) return "Cuéntanos por qué quieres ser embajador.";
    }

    if (role === "advertiser") {
      if (field(form, "businessName").length < 2) return "Ingresa el nombre del negocio.";
      if (field(form, "businessCategory").length < 2) return "Ingresa la categoría del negocio.";
      if (field(form, "businessAddress").length < 5) return "Ingresa la dirección del negocio.";
    }

    return "";
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const form = new FormData(event.currentTarget);
    const validationError = validate(form);

    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    const fullName = field(form, "fullName");
    const email = field(form, "email");
    const password = field(form, "password");
    const phone = digits(field(form, "phone"));
    const documentId = digits(field(form, "documentId"));
    const facebookUrl = field(form, "facebookUrl");
    const instagramUrl = field(form, "instagramUrl");
    const tiktokUrl = field(form, "tiktokUrl");
    const address = field(form, "address");
    const referredByCode = field(form, "ref");

    const formElement = event.currentTarget;

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password });

      if (signUpError || !data.user) {
        setError(formatSupabaseError(signUpError?.message || "No se pudo crear la solicitud."));
        return;
      }

     const referralCode = role === "ambassador" ? makeReferralCode(fullName) : null;

const response = await fetch("/api/partners/apply", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    userId: data.user.id,
    role,
    fullName,
    email,
    phone,
    province,
    city,
    documentId,
    address,
    facebookUrl,
    instagramUrl,
    tiktokUrl,
    referredByCode,
    referralCode,
    knownLeaguesCount:
      role === "ambassador"
        ? Number(field(form, "knownLeaguesCount") || 0)
        : 0,
    hasSalesExperience:
      role === "ambassador"
        ? form.get("hasSalesExperience") === "on"
        : false,
    hasSportsContacts:
      role === "ambassador"
        ? form.get("hasSportsContacts") === "on"
        : false,
    experienceSummary:
      role === "ambassador"
        ? field(form, "experienceSummary")
        : null,
    motivation:
      role === "ambassador"
        ? field(form, "motivation")
        : null,
    businessName: field(form, "businessName"),
    taxId: field(form, "taxId"),
    businessCategory: field(form, "businessCategory"),
    businessAddress: field(form, "businessAddress"),
  }),
});

const result = await response.json();

if (!response.ok) {
  setError(
    formatSupabaseError(
      result.error || "No se pudo crear la solicitud."
    )
  );
  return;
}
      setSuccess("Solicitud recibida correctamente. Revisaremos tu perfil y te contactaremos por correo durante las próximas 24 horas laborables. Si eres aprobado, recibirás instrucciones para acceder a capacitación y certificación.");
      formElement.reset();
      setProvince("");
      setCity("");
      setRole("ambassador");
    } catch (err) {
      setError("No se pudo enviar la solicitud. Revisa tu conexión e intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="registro" className="bg-slate-50 px-5 py-20 text-slate-950 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <div className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-cyan-600">Solicitud pública</div>
          <h2 className="text-3xl font-extrabold leading-tight md:text-5xl">Aplica para entrar al programa.</h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Esta página solo crea la solicitud. El acceso real, cursos, prueba, certificación, ventas y comisiones se manejan en el aplicativo privado.
          </p>

          <div className="mt-8 space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="font-bold text-slate-950">Estado inicial</div>
              <div className="mt-1 text-slate-600">Tu registro queda como pendiente de aprobación.</div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="font-bold text-slate-950">Después de aprobar</div>
              <div className="mt-1 text-slate-600">Recibirás acceso para capacitarte, rendir prueba y certificarte.</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-8">
            <p className="font-bold uppercase tracking-[0.18em] text-cyan-600">GPT Robotic Partners</p>
            <h3 className="mt-3 text-3xl font-extrabold text-slate-950 md:text-4xl">Solicitud de aplicación</h3>
            <p className="mt-3 text-slate-600">Completa la solicitud. Revisaremos tus datos y te contactaremos por correo durante las próximas 24 horas laborables.</p>
          </div>

          {error && <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 font-bold text-red-700">{error}</div>}
          {success && <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 font-bold text-emerald-700">{success}</div>}

          <div className="grid gap-5 md:grid-cols-2">
            <label className="md:col-span-2">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Tipo de solicitud</span>
              <select value={role} onChange={(event) => setRole(event.target.value as Role)} className="gpt-input">
                <option value="ambassador">Embajador vendedor</option>
                <option value="advertiser">Anunciante / publicista</option>
              </select>
            </label>

            <Input name="fullName" label="Nombre completo" required />
            <Input name="email" label="Email" type="email" required />
            <Input name="password" label="Contraseña" type="password" required />
            <Input name="phone" label="Celular" required />
            <Input name="documentId" label="Cédula / Documento" required />
            <Input name="ref" label="Código referido (opcional)" />

            <label>
              <span className="mb-2 block text-sm font-semibold text-slate-700">Provincia</span>
              <select required value={province} onChange={(event) => { setProvince(event.target.value); setCity(""); }} className="gpt-input">
                <option value="">Selecciona provincia</option>
                {Object.keys(ECUADOR_LOCATIONS).map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>

            <label>
              <span className="mb-2 block text-sm font-semibold text-slate-700">Ciudad</span>
              <select required value={city} onChange={(event) => setCity(event.target.value)} className="gpt-input">
                <option value="">Selecciona ciudad</option>
                {cities.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>

            <div className="md:col-span-2"><Input name="address" label="Dirección referencial" /></div>
            <Input name="facebookUrl" label="Facebook URL" placeholder="https://facebook.com/..." />
            <Input name="instagramUrl" label="Instagram URL" placeholder="https://instagram.com/..." />

            {role === "ambassador" && (
              <>
                <Input name="tiktokUrl" label="TikTok URL" placeholder="https://tiktok.com/@..." />
                <Input name="knownLeaguesCount" label="Ligas o clubes de fútbol que conoces" type="number" min="0" defaultValue="0" />

                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 font-semibold text-slate-700">
                  <input name="hasSalesExperience" type="checkbox" className="h-5 w-5 accent-cyan-500" />
                  Tengo experiencia en ventas
                </label>

                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 font-semibold text-slate-700">
                  <input name="hasSportsContacts" type="checkbox" className="h-5 w-5 accent-cyan-500" />
                  Conozco o tengo contacto con ligas o clubes de fútbol
                </label>

                <Textarea name="experienceSummary" label="Experiencia" placeholder="Cuéntanos tu experiencia vendiendo, en deporte o tecnología." required />
                <Textarea name="motivation" label="Motivación" placeholder="¿Por qué quieres ser embajador?" required />
              </>
            )}

            {role === "advertiser" && (
              <>
                <Input name="businessName" label="Nombre del negocio" required />
                <Input name="taxId" label="RUC / Cédula" />
                <Input name="businessCategory" label="Categoría del negocio" required />
                <Input name="businessAddress" label="Dirección del negocio" required />
              </>
            )}
          </div>

          <button disabled={loading} className="mt-8 w-full rounded-2xl bg-cyan-500 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-cyan-500/25 transition hover:-translate-y-0.5 hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? "Enviando solicitud..." : role === "ambassador" ? "Aplicar como embajador" : "Registrar anunciante"}
          </button>

          <p className="mt-4 text-center text-xs leading-5 text-slate-500">
            Al enviar aceptas que GPT Robotic revise tu perfil antes de habilitar acceso privado.
          </p>
        </form>
      </div>
    </section>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  const { label, ...rest } = props;
  return (
    <label>
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      <input {...rest} className="gpt-input" />
    </label>
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; name: string }) {
  const { label, ...rest } = props;
  return (
    <label className="md:col-span-2">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      <textarea {...rest} className="gpt-input min-h-[110px] resize-y" />
    </label>
  );
}
