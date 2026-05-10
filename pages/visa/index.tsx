// pages/visa/index.tsx
import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

type Question = {
  id: string;
  section: string;
  label: string;
  options: { value: string; label: string }[];
};

export default function VisaPage() {
  const router = useRouter();

  const [phase2Read, setPhase2Read] = useState(false);
  const [policyVersion] = useState("1.0");

  // Consent
  const [consentChecked, setConsentChecked] = useState(false);
  const [consentOk, setConsentOk] = useState(false);

  // Form
  const [profile, setProfile] = useState({
    full_name: "",
    id_number: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  // Acceso
  const [accessGranted, setAccessGranted] = useState(false);
  const [login, setLogin] = useState({ username: "", password: "" });

  // Toast
  const [toast, setToast] = useState<string | null>(null);
  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  }

  const grouped = useMemo(() => {
    const map: Record<string, Question[]> = {};
    for (const q of questions) {
      map[q.section] = map[q.section] || [];
      map[q.section].push(q);
    }
    return map;
  }, [questions]);

  async function saveConsentAndLoad() {
    setErr(null);
    if (!consentChecked) return setErr("Debes aceptar el tratamiento de datos para continuar.");

    setLoading(true);

    // 1) guardar consentimiento
    const rc = await fetch("/api/visa/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accepted: true, policy_version: policyVersion }),
    });

    const jc = await rc.json().catch(() => ({}));
    if (!rc.ok) {
      setLoading(false);
      if (rc.status === 401) { setAccessGranted(false); return setErr("Tu sesión no está activa. Ingresa nuevamente o solicita acceso por WhatsApp."); }
      return setErr(jc?.error || "No se pudo registrar el consentimiento.");
    }

    setConsentOk(true);

    // 2) cargar preguntas
    const r = await fetch("/api/visa/start");
    const j = await r.json().catch(() => ({}));
    setLoading(false);

    if (!r.ok) {
      if (r.status === 401) { setAccessGranted(false); return setErr("Tu sesión no está activa. Ingresa nuevamente o solicita acceso por WhatsApp."); }
      return setErr(j?.error || "Error cargando preguntas.");
    }

    setQuestions(j.questions || []);
  }

  function validateProfile() {
    const n = profile.full_name.trim();
    const id = profile.id_number.trim().toUpperCase();
    const em = profile.email.trim();
    const ph = profile.phone.trim();

    if (n.length < 5) return "Ingresa nombres completos.";

    // Email
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(em);
    if (!emailOk) return "Email inválido.";

    // Phone: only digits 7-15
    if (!/^\d{7,15}$/.test(ph)) return "Celular inválido (solo números, 7 a 15 dígitos).";

    // Cédula EC (10 dígitos) OR Pasaporte gen (6-9 alfanum y al menos 1 número)
    const isCedulaEC = /^\d{10}$/.test(id);
    const isPassportGeneral = /^(?=.*\d)[A-Z0-9]{6,9}$/.test(id);

    if (!isCedulaEC && !isPassportGeneral) {
      return "Cédula/Pasaporte inválido. Cédula: 10 dígitos. Pasaporte: 6–9 alfanuméricos (ej: A12345678).";
    }

    return null;
  }

  async function submit() {
    setErr(null);
    setResult(null);

    const perr = validateProfile();
    if (perr) return setErr(perr);

    for (const q of questions) {
      if (!answers[q.id]) return setErr(`Responde: ${q.label}`);
    }

    setLoading(true);

    const r = await fetch("/api/visa/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        policy_version: policyVersion,
        profile: {
          ...profile,
          id_number: profile.id_number.trim().toUpperCase(),
          phone: profile.phone.replace(/\D/g, ""),
        },
        questions: questions.map((q) => q.id),
        answers,
      }),
    });

    const j = await r.json().catch(() => ({}));
    setLoading(false);

    if (!r.ok) {
      if (r.status === 401) { setAccessGranted(false); return setErr("Tu sesión no está activa. Ingresa nuevamente o solicita acceso por WhatsApp."); }
      return setErr(j?.error || "Error calculando score.");
    }

    setResult(j);
  }

  async function sendResultToEmail() {
    if (!result) return;

    setErr(null);
    setLoading(true);

    const r = await fetch("/api/visa/send-result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profile: {
          ...profile,
          id_number: profile.id_number.trim().toUpperCase(),
          phone: profile.phone.replace(/\D/g, ""),
        },
        result,
      }),
    });

    const j = await r.json().catch(() => ({}));
    setLoading(false);

    if (!r.ok) return setErr(j?.error || "No se pudo enviar el email.");

    showToast("✅ Enviado a tu email. Redirigiendo…");
    setTimeout(() => router.push("/"), 1200);
  }


  async function loginVisa() {
    setErr(null);
    if (!login.username.trim() || !login.password.trim()) {
      return setErr("Ingresa usuario y contraseña.");
    }

    setLoading(true);
    const r = await fetch("/api/visa/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: login.username.trim(), password: login.password }),
    });

    const j = await r.json().catch(() => ({}));
    setLoading(false);

    if (!r.ok) {
      return setErr(j?.error || "No se pudo iniciar sesión.");
    }

    setAccessGranted(true);
    setErr(null);
    showToast("Acceso correcto. Ahora acepta el consentimiento para iniciar.");
  }

  const cardStyle: React.CSSProperties = {
    border: "1px solid #222",
    borderRadius: 16,
    padding: 16,
    background: "#0b1220",
    color: "#fff",
  };

  const btnPrimary: React.CSSProperties = {
    width: "100%",
    padding: "14px 16px",
    fontWeight: 900,
    borderRadius: 12,
    background: "#2563eb",
    color: "#fff",
    border: "1px solid #334155",
    cursor: "pointer",
  };

  const btnGreen: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    fontWeight: 900,
    borderRadius: 12,
    background: "#22c55e",
    color: "#0b1220",
    border: "1px solid #334155",
    cursor: "pointer",
  };

  const btnDark: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    fontWeight: 900,
    borderRadius: 12,
    background: "#0f172a",
    color: "#fff",
    border: "1px solid #334155",
    cursor: "pointer",
  };

  if (!accessGranted) {
    return (
      <div style={{ minHeight: "100vh", background: "#f8fafc", color: "#0f172a" }}>
        <div style={{ maxWidth: 980, margin: "0 auto", padding: "28px 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <Link href="/" style={{ fontWeight: 900, textDecoration: "none", color: "#0f172a" }}>
              GPT Robotic
            </Link>
            <Link href="/" style={{ fontWeight: 800, textDecoration: "underline", color: "#475569" }}>
              Volver
            </Link>
          </div>

          <div style={{ marginTop: 42, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 22, alignItems: "stretch" }}>
            <section style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 28, padding: 28, boxShadow: "0 20px 60px rgba(15, 23, 42, 0.08)" }}>
              <div style={{ color: "#2563eb", fontWeight: 900, letterSpacing: ".08em", textTransform: "uppercase", fontSize: 13 }}>
                Visa Score
              </div>
              <h1 style={{ margin: "12px 0 0", fontSize: 42, lineHeight: 1.05 }}>
                Ingresa a tu evaluación privada.
              </h1>
              <p style={{ marginTop: 16, color: "#475569", lineHeight: 1.7 }}>
                Si ya tienes una cuenta, inicia sesión para continuar. Si todavía no has pagado o no tienes credenciales, escríbenos por WhatsApp para activar tu acceso.
              </p>

              <div style={{ marginTop: 22, display: "grid", gap: 12 }}>
                <label style={{ display: "grid", gap: 6, fontWeight: 800 }}>
                  Usuario
                  <input
                    value={login.username}
                    onChange={(e) => setLogin((p) => ({ ...p, username: e.target.value }))}
                    style={{ padding: 13, borderRadius: 14, border: "1px solid #cbd5e1" }}
                    placeholder="Tu usuario"
                  />
                </label>
                <label style={{ display: "grid", gap: 6, fontWeight: 800 }}>
                  Contraseña
                  <input
                    type="password"
                    value={login.password}
                    onChange={(e) => setLogin((p) => ({ ...p, password: e.target.value }))}
                    style={{ padding: 13, borderRadius: 14, border: "1px solid #cbd5e1" }}
                    placeholder="Tu contraseña"
                  />
                </label>
                <button onClick={loginVisa} disabled={loading} style={{ ...btnPrimary, marginTop: 4 }}>
                  {loading ? "Ingresando..." : "Ingresar a Visa Score"}
                </button>
                {err && <div style={{ color: "#dc2626", fontWeight: 800 }}>{err}</div>}
              </div>
            </section>

            <aside style={{ background: "#0f172a", color: "#fff", borderRadius: 28, padding: 28 }}>
              <h2 style={{ marginTop: 0, fontSize: 28 }}>¿No tienes cuenta?</h2>
              <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
                Solicita el acceso por WhatsApp. Te indicaremos el valor, forma de pago y después recibirás usuario y contraseña para entrar a la evaluación.
              </p>
              <a
                href="https://wa.me/593963203102?text=Hola%20GPT%20Robotic%2C%20quiero%20pagar%20y%20activar%20mi%20acceso%20a%20Visa%20Score."
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "block", marginTop: 18, textAlign: "center", background: "#22c55e", color: "#052e16", fontWeight: 900, padding: "14px 16px", borderRadius: 16, textDecoration: "none" }}
              >
                Pagar por WhatsApp
              </a>
              <div style={{ marginTop: 18, padding: 14, borderRadius: 18, background: "rgba(255,255,255,.06)", color: "#cbd5e1", fontSize: 14, lineHeight: 1.6 }}>
                Importante: esta evaluación es informativa. No garantiza aprobación ni reemplaza asesoría legal o migratoria.
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 980, margin: "30px auto", padding: 18 }}>
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#111827",
            color: "#fff",
            padding: "12px 14px",
            borderRadius: 12,
            border: "1px solid #334155",
            fontWeight: 800,
            zIndex: 9999,
            boxShadow: "0 10px 30px rgba(0,0,0,.35)",
          }}
        >
          {toast}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
        <h1 style={{ margin: 0 }}>Visa Americana – Evaluación</h1>
        <Link href="/" style={{ fontWeight: 800, textDecoration: "underline" }}>
          Volver
        </Link>
      </div>

      <p style={{ opacity: 0.85 }}>
        Estimación informativa del perfil. <b>No garantiza aprobación</b>.
      </p>

     {!consentOk && (
  <div style={cardStyle}>
    <h3
      style={{
        marginTop: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <span style={{ fontSize: 22, fontWeight: 900 }}>
        🇺🇸 Visa Americana – Consentimiento 🇺🇸
      </span>
      <span style={{ opacity: 0.9, fontSize: 20 }}>🇺🇸</span>
    </h3>

    {/* Mensaje motivacional / advertencia positiva */}
    <div
      style={{
        marginTop: 10,
        padding: "10px 12px",
        borderRadius: 12,
        background: "rgba(255, 255, 255, 0.06)",
        border: "1px solid rgba(255, 255, 255, 0.10)",
      }}
    >
      <div style={{ fontWeight: 900, marginBottom: 4 }}>
        ✅ Responde con honestidad y a conciencia
      </div>
      <div style={{ opacity: 0.9, lineHeight: 1.35 }}>
        Mientras más precisas sean tus respuestas, <b>mejor será la estimación</b> del score y las recomendaciones
        informativas.
      </div>
    </div>

    <p style={{ opacity: 0.9, marginTop: 12 }}>
      Para iniciar, debes aceptar el tratamiento de datos personales según la{" "}
      <b>LOPDP (Ecuador)</b>.{" "}
      <Link href="/visa/privacy" target="_blank" style={{ textDecoration: "underline" }}>
        Leer política
      </Link>
      .
      <span style={{ display: "block", marginTop: 6, fontSize: 13, opacity: 0.75 }}>
        No garantiza aprobación. No constituye asesoría legal ni migratoria.
      </span>
    </p>

    <label style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 6 }}>
      <input
        type="checkbox"
        checked={consentChecked}
        onChange={(e) => setConsentChecked(e.target.checked)}
      />
      <span style={{ fontWeight: 700 }}>Acepto el tratamiento de datos.</span>
    </label>

    <button
      onClick={saveConsentAndLoad}
      disabled={loading}
      style={{ marginTop: 14, ...btnPrimary }}
    >
      {loading ? "Procesando..." : "Aceptar y continuar 🇺🇸"}
    </button>

    {err && <div style={{ marginTop: 12, color: "#ff6b6b", fontWeight: 800 }}>{err}</div>}
  </div>
)}


      {consentOk && (
        <div style={{ display: "grid", gap: 14 }}>
          {/* PERFIL */}
          <div style={cardStyle}>
            <h3 style={{ marginTop: 0 }}>Datos del solicitante</h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontWeight: 800 }}>Nombres completos *</label>
                <input
                  value={profile.full_name}
                  onChange={(e) => setProfile((p) => ({ ...p, full_name: e.target.value }))}
                  style={{ width: "100%", padding: 10, borderRadius: 10, marginTop: 6 }}
                  placeholder="Ej: Juan Pérez López"
                  required
                />
              </div>

              <div>
                <label style={{ fontWeight: 800 }}>Cédula o Pasaporte *</label>
                <input
                  value={profile.id_number}
                  onChange={(e) => setProfile((p) => ({ ...p, id_number: e.target.value.toUpperCase() }))}
                  style={{ width: "100%", padding: 10, borderRadius: 10, marginTop: 6 }}
                  placeholder="Cédula (10 dígitos) o Pasaporte (A12345678)"
                  autoCapitalize="characters"
                  required
                />
              </div>

              <div>
                <label style={{ fontWeight: 800 }}>Email *</label>
                <input
                  value={profile.email}
                  onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                  style={{ width: "100%", padding: 10, borderRadius: 10, marginTop: 6 }}
                  placeholder="correo@dominio.com"
                  inputMode="email"
                  required
                />
              </div>

              <div>
                <label style={{ fontWeight: 800 }}>Celular *</label>
                <input
                  value={profile.phone}
                  onChange={(e) => {
                    const onlyNums = e.target.value.replace(/\D/g, "");
                    setProfile((p) => ({ ...p, phone: onlyNums }));
                  }}
                  style={{ width: "100%", padding: 10, borderRadius: 10, marginTop: 6 }}
                  placeholder="Ej: 0999999999"
                  inputMode="numeric"
                  required
                />
              </div>
            </div>
          </div>

          {/* PREGUNTAS */}
          {questions.length === 0 ? (
            <div style={cardStyle}>Cargando preguntas…</div>
          ) : (
            <>
              {Object.entries(grouped).map(([section, qs]) => (
                <div key={section} style={cardStyle}>
                  <h3 style={{ marginTop: 0 }}>{section}</h3>

                  {qs.map((q) => (
                    <div key={q.id} style={{ margin: "12px 0" }}>
                      <div style={{ fontWeight: 800, marginBottom: 6 }}>{q.label}</div>

                      <select
                        value={answers[q.id] || ""}
                        onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                        style={{
                          width: "100%",
                          padding: 12,
                          borderRadius: 12,
                          background: "#0f172a",
                          color: "#ffffff",
                          border: "1px solid #334155",
                          outline: "none",
                        }}
                      >
                        <option value="" style={{ color: "#94a3b8" }}>
                          Selecciona…
                        </option>

                        {q.options.map((o) => (
                          <option key={o.value} value={o.value} style={{ color: "#0b1220", background: "#ffffff" }}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              ))}

              {/* ✅ SOLO UN BOTÓN DE CALCULAR (se oculta cuando ya hay result) */}
              {!result && (
                <button onClick={submit} disabled={loading} style={btnPrimary}>
                  {loading ? "Calculando…" : "Calcular Score"}
                </button>
              )}

              {err && <div style={{ color: "#ff6b6b", fontWeight: 900 }}>{err}</div>}

              {result && (
                <div style={cardStyle}>
                  <h2 style={{ marginTop: 0 }}>🎯 Tu resultado</h2>

                  <div style={{ fontSize: 18, marginBottom: 8 }}>
                    <b>Tu score estimado es:</b>{" "}
                    <span style={{ fontSize: 26, fontWeight: 900 }}>{result.score}%</span>
                  </div>

                  <div style={{ opacity: 0.9, marginBottom: 14 }}>
                    {result.score >= result.threshold ? (
                      <>
                        ✅ Tu perfil se ve <b>fuerte</b> para continuar.
                        <div style={{ marginTop: 6, opacity: 0.85 }}>
                          Si quieres, podemos pasar a <b>Fase 2</b> (acompañamiento completo).
                        </div>
                      </>
                    ) : (
                      <>
                        ⚠️ Tu perfil se ve <b>medio/bajo</b> por ahora.
                        <div style={{ marginTop: 6, opacity: 0.85 }}>
                          Podemos ayudarte a entender qué mejorar antes de aplicar.
                        </div>
                      </>
                    )}
                  </div>

                  {result.flags?.length ? (
                    <>
                      <hr />
                      <h4>Alertas detectadas</h4>
                      <ul>
                        {result.flags.map((f: any) => (
                          <li key={f.id}>{f.message}</li>
                        ))}
                      </ul>
                    </>
                  ) : null}

                  <hr />
                  <h4>Factores principales</h4>
                  <ul>
                    {result.top_factors?.map((t: any, idx: number) => (
                      <li key={idx}>
                        <b>{t.delta > 0 ? "+" : ""}{t.delta}</b> — {t.label}
                        <span style={{ opacity: 0.8 }}> ({t.why})</span>
                      </li>
                    ))}
                  </ul>

                  <hr />

                  {/* === FASE 2 === */}
                  <div style={{ padding: 14, borderRadius: 14, background: "#0f172a", border: "1px solid #334155" }}>
                    <h3 style={{ marginTop: 0 }}>🚀 Fase 2 (Acompañamiento)</h3>

                    <div style={{ opacity: 0.9 }}>
                      Esta fase es un acompañamiento guiado para:
                      <ul style={{ marginTop: 8 }}>
                        <li>✅ Revisar coherencia del perfil (historia + propósito)</li>
                        <li>✅ Preparar información para formularios (sin prometer aprobación)</li>
                        <li>✅ Checklist de documentos y datos que debes tener listos</li>
                        <li>✅ Guía paso a paso para evitar errores típicos</li>
                      </ul>
                    </div>

                    <div style={{ marginTop: 10, opacity: 0.8, fontSize: 13 }}>
                      <b>Importante:</b> No garantizamos aprobación. No es asesoría legal. La decisión final siempre es consular.
                    </div>

                    <label style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10 }}>
                      <input
                        type="checkbox"
                        checked={phase2Read}
                        onChange={(e) => setPhase2Read(e.target.checked)}
                      />
                      He leído lo anterior y entiendo que es un acompañamiento informativo.
                    </label>

                    <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
                      {result.score >= result.threshold ? (
                        <a
                          href={`https://wa.me/593963203102?text=${encodeURIComponent(
                            `Hola GPTROBOTIC, mi score fue ${result.score}%. Quiero pagar y continuar con la Fase 2 (acompañamiento). Mis datos: ${profile.full_name}, ${profile.id_number}, ${profile.email}, ${profile.phone}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            pointerEvents: phase2Read ? "auto" : "none",
                            opacity: phase2Read ? 1 : 0.5,
                            background: "#22c55e",
                            color: "#0b1220",
                            fontWeight: 900,
                            padding: "12px 14px",
                            borderRadius: 12,
                            textDecoration: "none",
                            flex: 1,
                            textAlign: "center",
                          }}
                        >
                          PAGAR Y CONTINUAR A FASE 2
                        </a>
                      ) : (
                        <a
                          href={`https://wa.me/593963203102?text=${encodeURIComponent(
                            `Hola GPTROBOTIC, mi score fue ${result.score}%. Quiero una recomendación para mejorar mi perfil antes de aplicar. Mis datos: ${profile.full_name}, ${profile.id_number}, ${profile.email}, ${profile.phone}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            pointerEvents: phase2Read ? "auto" : "none",
                            opacity: phase2Read ? 1 : 0.5,
                            background: "#f59e0b",
                            color: "#0b1220",
                            fontWeight: 900,
                            padding: "12px 14px",
                            borderRadius: 12,
                            textDecoration: "none",
                            flex: 1,
                            textAlign: "center",
                          }}
                        >
                          QUIERO MEJORAR MI PERFIL
                        </a>
                      )}
                    </div>
                  </div>

                  <div style={{ marginTop: 12, opacity: 0.8 }}>{result.disclaimer}</div>

                  {/* ✅ BOTONES FINALES (solo 1 enviar) */}
                  <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
                    <button onClick={sendResultToEmail} disabled={loading} style={btnGreen}>
                      {loading ? "Enviando…" : "Enviar a mi email"}
                    </button>

                    <button onClick={() => router.push("/")} style={btnDark}>
                      Volver a GPTROBOTIC
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
