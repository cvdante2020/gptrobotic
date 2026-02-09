"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // Contacto
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    celular: "",
    mensaje: "",
  });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  // Visa login
  const [showVisaLogin, setShowVisaLogin] = useState(false);
  const [visaLogin, setVisaLogin] = useState({ username: "", password: "" });
  const [visaErr, setVisaErr] = useState<string | null>(null);
  const [visaLoading, setVisaLoading] = useState(false);

  const waBase = "https://wa.me/593963203102";
  const wa = useMemo(
    () => ({
      facturacion: `${waBase}?text=${encodeURIComponent(
        "Hola GPTROBOTIC, quiero información de Facturación Electrónica ($0.03 por factura) y una demo."
      )}`,
      visaPagar: `${waBase}?text=${encodeURIComponent(
        "Hola GPTROBOTIC, quiero PAGAR la evaluación de Visa Americana y recibir usuario y clave."
      )}`,
      whatsappMasivo: `${waBase}?text=${encodeURIComponent(
        "Hola GPTROBOTIC, quiero una demo del Sistema de Envío Masivo de WhatsApp (desde $9.99)."
      )}`,
      general: waBase,
    }),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setSent(true);
        setForm({ nombre: "", email: "", celular: "", mensaje: "" });
      } else {
        alert("Hubo un error al enviar el mensaje. Inténtalo de nuevo más tarde.");
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      alert("No se pudo enviar el mensaje. Inténtalo de nuevo más tarde.");
    } finally {
      setSending(false);
    }
  };

  const handleVisaLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setVisaErr(null);
    setVisaLoading(true);

    try {
      const r = await fetch("/api/visa/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(visaLogin),
      });

      const j = await r.json();
      if (!r.ok) {
        setVisaErr(j?.error || "Error de acceso");
        return;
      }
      router.push("/visa");
    } catch (err) {
      setVisaErr("No se pudo validar. Intenta de nuevo.");
    } finally {
      setVisaLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 relative">
      <Navbar />

      {/* =========================
          HERO (enfocado en 2 estrellas)
         ========================= */}
      <section className="relative overflow-hidden bg-black">
        <div className="absolute inset-0 opacity-70">
          <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-yellow-500/20 blur-3xl animate-pulse" />
          <div className="absolute top-10 -right-40 h-[520px] w-[520px] rounded-full bg-blue-500/20 blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 left-1/3 h-[520px] w-[520px] rounded-full bg-green-500/15 blur-3xl animate-pulse" />
        </div>

        <div
          className="absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.22) 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-14 pb-10 text-center">
          <div className="flex flex-col items-center gap-4">
            <Image
              src="/logo-gptrobotic-v2.png"
              alt="GPT Robotic Logo"
              width={110}
              height={110}
              className="mx-auto"
              priority
            />
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              GPT<span className="text-blue-400">ROBOTIC</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
              Automatiza ventas y operación con <b>Facturación Electrónica</b> y <b>Evaluación de Visa</b> como productos estrella.
              <br />
              Y si lo necesitas, también bots, CRM y automatización omnicanal.
            </p>

            {/* mini proof */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-2xl font-extrabold">+100</div>
                <div className="text-xs text-gray-300">Bots activos</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-2xl font-extrabold">99.8%</div>
                <div className="text-xs text-gray-300">Disponibilidad</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-2xl font-extrabold">+8</div>
                <div className="text-xs text-gray-300">Financieras</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-2xl font-extrabold">+3k</div>
                <div className="text-xs text-gray-300">Consultas/día</div>
              </div>
            </div>

            {/* Primary CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#facturacion"
                className="inline-block px-8 py-4 rounded-2xl font-extrabold text-lg bg-yellow-500 hover:bg-yellow-600 text-black shadow-xl transition"
              >
                💛 Ver Facturación Electrónica
              </a>
              <a
                href="#visa"
                className="inline-block px-8 py-4 rounded-2xl font-extrabold text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xl transition"
              >
                🇺🇸 Ver Evaluación de Visa
              </a>
            </div>

            {/* Secondary quick links (compactos) */}
            <div className="mt-7 flex flex-wrap justify-center gap-3 text-sm">
              <Link href="/clinicas" className="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition">
                Clínicas
              </Link>
              <Link href="/autos" className="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition">
                Patios de Autos
              </Link>
              <a href="#whatsapp-masivo" className="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition">
                WhatsApp masivo
              </a>
              <a href="#contacto" className="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition">
                Contacto
              </a>
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />
      </section>

      {/* =========================
          BLOQUE: 2 PRODUCTOS ESTRELLA (tarjetas)
         ========================= */}
      <section className="py-14 px-6 max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-10">
          Empieza Ahora mismo <span className="text-yellow-400">Listo</span> y <span className="text-blue-400">bajo demanda</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Facturación */}
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-7 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-extrabold text-yellow-400">💛 Facturación Electrónica</h3>
                <p className="text-gray-300 mt-2">
                  Emite, envía por WhatsApp/Email, reportes listos para contabilidad y opción online/offline (según configuración).
                </p>
              </div>
              <div className="px-3 py-2 rounded-xl bg-yellow-500 text-black font-extrabold text-sm">
                Desde $0.03*
              </div>
            </div>

            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <a href="#facturacion" className="px-6 py-3 rounded-xl font-extrabold bg-yellow-500 hover:bg-yellow-600 text-black text-center transition">
                Ver detalles
              </a>
              <a
                href={wa.facturacion}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl font-extrabold bg-green-600 hover:bg-green-700 text-white text-center transition"
              >
                Pedir demo por WhatsApp
              </a>
            </div>

            <p className="mt-4 text-xs text-gray-400">*Tarifa referencial; puede variar por plan y volumen.</p>
          </div>

          {/* Visa */}
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-7 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-extrabold text-blue-400">🇺🇸 Evaluación Visa Americana</h3>
                <p className="text-gray-300 mt-2">
                  Evaluación rápida e informativa para entender la fortaleza de tu perfil antes del proceso consular.
                </p>
              </div>
              <div className="px-3 py-2 rounded-xl bg-blue-600 text-white font-extrabold text-sm">
                $1.00
              </div>
            </div>

            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <a href="#visa" className="px-6 py-3 rounded-xl font-extrabold bg-blue-600 hover:bg-blue-700 text-white text-center transition">
                Empezar
              </a>
              <button
                onClick={() => {
                  setShowVisaLogin(true);
                  setVisaErr(null);
                  // scroll suave al bloque visa si quieres
                  document.getElementById("visa")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-6 py-3 rounded-xl font-extrabold bg-white/10 hover:bg-white/15 border border-white/10 text-white text-center transition"
              >
                Ya tengo usuario y clave
              </button>
            </div>

            <p className="mt-4 text-xs text-gray-400">
              No garantiza aprobación. No constituye asesoría legal ni migratoria.
            </p>
          </div>
        </div>
      </section>

      {/* =========================
          FACTURACIÓN (FULL PRO) - estrella 1
         ========================= */}
      <section id="facturacion" className="relative w-full overflow-hidden text-white">
        {/* Fondo */}
        <div className="absolute inset-0 bg-[#05070c]" />
        <div className="absolute inset-0 opacity-70">
          <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-yellow-500/25 blur-3xl animate-pulse" />
          <div className="absolute top-10 -right-40 h-[520px] w-[520px] rounded-full bg-blue-500/25 blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 left-1/3 h-[520px] w-[520px] rounded-full bg-green-500/20 blur-3xl animate-pulse" />
        </div>
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.22) 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-400/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />

        {/* Banda promo */}
        <div className="relative z-10 w-full">
          <div className="w-full bg-gradient-to-r from-yellow-500/15 via-blue-500/15 to-green-500/15 border-y border-white/10">
            <div className="mx-auto max-w-7xl px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-sm text-gray-200">
                ⚡ Emite en segundos • Reportes listos para contabilidad • Envío por WhatsApp/Email
              </p>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-yellow-500 text-black">
                PROMO: Firma electrónica 1 año GRATIS (planes elegibles)
              </span>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            {/* Col 1 */}
            <div className="lg:col-span-1 space-y-5">
              <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight">
                <span className="block text-yellow-400">Facturación Electrónica</span>
                <span className="block text-white">de extremo a extremo</span>
              </h2>

              <p className="text-gray-300 text-base sm:text-lg">
                Emite facturas desde la web con una experiencia moderna y rápida.
                <span className="text-gray-400"> Modo offline disponible (según configuración).</span>
              </p>

              <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="text-2xl">💰</span>
                <div>
                  <p className="text-xs text-gray-300">Desde</p>
                  <p className="text-xl font-extrabold">
                    <span className="text-green-400">$0.03</span>{" "}
                    <span className="text-gray-200">por factura*</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <a
                  href="#contacto"
                  className="inline-block px-7 py-3 rounded-xl font-extrabold bg-yellow-500 hover:bg-yellow-600 text-black shadow-lg transition text-center"
                >
                  🚀 Quiero una demo
                </a>

                <a
                  href={wa.facturacion}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-7 py-3 rounded-xl font-extrabold bg-green-600 hover:bg-green-700 text-white shadow-lg transition text-center"
                >
                  💬 WhatsApp
                </a>
              </div>
            </div>

            {/* Col 2 */}
            <div className="lg:col-span-1 bg-gray-900/60 backdrop-blur border border-white/10 rounded-2xl p-7 shadow-xl">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <span>✅</span> Todo lo que necesitas
              </h3>

              <ul className="mt-6 space-y-4 text-gray-200">
                <li className="flex gap-3">
                  <span className="text-yellow-400 mt-0.5">⚡</span>
                  <div>
                    <b>Emisión ágil</b>: menos pasos, menos errores.
                  </div>
                </li>

                <li className="flex gap-3">
                  <span className="text-sky-400 mt-0.5">👤</span>
                  <div>
                    <b>Autollenado por cédula</b> (cuando el servicio esté disponible) para reducir tiempo.
                  </div>
                </li>

                <li className="flex gap-3">
                  <span className="text-emerald-300 mt-0.5">📡</span>
                  <div>
                    <b>Online + Offline</b>: guarda y sincroniza al volver la conexión (según configuración).
                  </div>
                </li>

                <li className="flex gap-3">
                  <span className="text-purple-300 mt-0.5">📊</span>
                  <div>
                    <b>Reportes</b> para contabilidad + exportaciones.
                  </div>
                </li>

                <li className="flex gap-3">
                  <span className="text-amber-200 mt-0.5">🔒</span>
                  <div>Seguridad y trazabilidad de documentos.</div>
                </li>
              </ul>

              <div className="mt-6 text-xs text-gray-400 space-y-2 leading-relaxed">
                <p>* Tarifa referencial; puede variar por plan y volumen.</p>
                <p>** Autollenado por cédula sujeto a disponibilidad/configuración; no reemplaza verificaciones.</p>
                <p>*** Offline: registro local y sincronización al volver la conexión (según configuración).</p>
              </div>
            </div>

            {/* Col 3 */}
            <div className="lg:col-span-1">
              <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-200 font-semibold">Panel de emisión</div>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200">
                    LIVE
                  </span>
                </div>

                <div className="mt-5 rounded-2xl bg-black/30 border border-white/10 p-4">
                  <div className="h-3 w-32 rounded bg-white/20 mb-3" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-10 rounded-xl bg-white/10 border border-white/10" />
                    <div className="h-10 rounded-xl bg-white/10 border border-white/10" />
                    <div className="col-span-2 h-10 rounded-xl bg-white/10 border border-white/10" />
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="h-9 flex-1 rounded-xl bg-yellow-500/80 hover:bg-yellow-500 transition" />
                    <div className="h-9 w-24 rounded-xl bg-green-500/70" />
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="h-14 rounded-xl bg-white/10 border border-white/10" />
                    <div className="h-14 rounded-xl bg-white/10 border border-white/10" />
                    <div className="h-14 rounded-xl bg-white/10 border border-white/10" />
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-gray-950/60 border border-white/10 p-4 text-sm text-gray-200">
                  <b>¿Integración contable/API?</b> Te dejamos reportes listos o conectamos por API (según alcance).
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          VISA (estrella 2)
         ========================= */}
      <section id="visa" className="py-16 px-6 bg-gradient-to-b from-black to-gray-950 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-blue-400">
          🇺🇸 ¿Qué tan fuerte es tu perfil para la Visa Americana?
        </h2>

        <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-200 mb-8">
          Descúbrelo en minutos con una <b>evaluación rápida e informativa</b>.
          <br />
          <span className="block mt-2 text-blue-200 font-bold">Inversión única: $1,00 USD</span>
          <span className="block text-sm text-gray-400 mt-3">
            No garantiza aprobación. No constituye asesoría legal ni migratoria.
          </span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={wa.visaPagar}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 rounded-xl font-extrabold text-lg bg-green-500 hover:bg-green-600 text-black shadow-xl transition"
          >
            💳 PAGAR Y OBTENER MI SCORE
          </a>

          <button
            onClick={() => {
              setShowVisaLogin(true);
              setVisaErr(null);
            }}
            className="px-8 py-4 rounded-xl font-extrabold text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xl transition"
          >
            🔐 YA TENGO USUARIO Y CLAVE
          </button>
        </div>

        {showVisaLogin && (
          <div className="max-w-md mx-auto mt-10 bg-gray-900 border border-gray-700 rounded-2xl p-6 text-left shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold mb-1">Acceso a tu evaluación</h3>
                <p className="text-sm text-gray-300 mb-5">
                  Ingresa el usuario y clave que recibiste luego del pago.
                </p>
              </div>
              <button
                onClick={() => setShowVisaLogin(false)}
                className="text-gray-300 hover:text-white text-xl leading-none"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleVisaLogin} className="space-y-4">
              <div>
                <label className="text-sm font-semibold">Usuario</label>
                <input
                  value={visaLogin.username}
                  onChange={(e) => setVisaLogin((p) => ({ ...p, username: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Clave</label>
                <input
                  type="password"
                  value={visaLogin.password}
                  onChange={(e) => setVisaLogin((p) => ({ ...p, password: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={visaLoading}
                className="w-full py-3 rounded-lg font-extrabold bg-blue-600 hover:bg-blue-700 transition disabled:opacity-60"
              >
                {visaLoading ? "Validando acceso..." : "INGRESAR A MI EVALUACIÓN"}
              </button>

              {visaErr && <div className="text-red-400 font-bold">{visaErr}</div>}
            </form>
          </div>
        )}
      </section>

      {/* =========================
          WhatsApp masivo (producto adicional)
         ========================= */}
      <section id="whatsapp-masivo" className="py-16 px-6 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-left space-y-4">
            <h2 className="text-3xl font-extrabold text-green-400">📢 Sistema de Envío Masivo de WhatsApp</h2>
            <p className="text-lg text-gray-200">
              Envía campañas de marketing, servicios y cobranza de manera automatizada.
              <br />
              <b>Respetamos las políticas de Meta</b>.
            </p>

            <div className="text-xl font-extrabold">
              Desde <span className="text-yellow-400">$9.99 mensual</span>
            </div>

            <ul className="list-disc pl-6 text-gray-200">
              <li>✅ Marketing y promociones</li>
              <li>✅ Servicios personalizados</li>
              <li>✅ Cobranza y recordatorios</li>
            </ul>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href="#contacto"
                className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-extrabold rounded-xl shadow-lg transition text-center"
              >
                Solicita tu demo ahora
              </a>
              <a
                href={wa.whatsappMasivo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/10 text-white font-extrabold rounded-xl shadow-lg transition text-center"
              >
                WhatsApp directo
              </a>
            </div>
          </div>

          <div className="md:w-full">
            <img
              src="/whatsapp-crm.png"
              alt="Sistema de Envío Masivo"
              className="rounded-2xl shadow-lg mx-auto border border-white/10"
            />
          </div>
        </div>
      </section>

      {/* =========================
          Precios (compacto)
         ========================= */}
      <section className="py-16 px-6 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-blue-400 mb-10">Planes y precios (Bots/CRM)</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-white/10">
            <h3 className="text-xl font-bold text-white mb-2">🚀 Plan Básico</h3>
            <p className="text-green-400 text-3xl font-bold mb-4">
              $49<span className="text-sm text-gray-300">/mes</span>
            </p>
            <ul className="text-sm text-white space-y-2 mb-6 text-left">
              <li>✔ 1 Bot personalizado</li>
              <li>✔ Integración con WhatsApp</li>
              <li>✔ Panel de control simple</li>
              <li>✔ Soporte vía email</li>
            </ul>
            <a href="#contacto" className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full font-bold transition">
              Elegir este plan
            </a>
          </div>

          <div className="bg-yellow-600 p-6 rounded-xl shadow-lg border-4 border-yellow-300 transform md:scale-105">
            <h3 className="text-xl font-bold text-black mb-2">🔥 Plan Profesional</h3>
            <p className="text-black text-3xl font-bold mb-4">
              $99<span className="text-sm">/mes</span>
            </p>
            <ul className="text-sm text-black space-y-2 mb-6 text-left">
              <li>✔ 1 Bot personalizado</li>
              <li>✔ CRM integrado</li>
              <li>✔ Dashboard y estadísticas</li>
              <li>✔ Soporte prioritario</li>
            </ul>
            <a href="#contacto" className="block bg-black hover:bg-gray-800 text-white px-4 py-2 rounded w-full font-bold transition">
              Recomendado
            </a>
          </div>

          <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-white/10">
            <h3 className="text-xl font-bold text-white mb-2">🏢 Plan Empresarial</h3>
            <p className="text-green-400 text-3xl font-bold mb-4">
              Desde $199<span className="text-sm text-gray-300">/mes</span>
            </p>
            <ul className="text-sm text-white space-y-2 mb-6 text-left">
              <li>✔ 1 Bot personalizado</li>
              <li>✔ Módulos a medida (agenda, pagos, etc.)</li>
              <li>✔ Integración con sistemas externos</li>
              <li>✔ Soporte dedicado 24/7</li>
            </ul>
            <a href="#contacto" className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full font-bold transition">
              Solicitar demo
            </a>
          </div>
        </div>
      </section>

      {/* =========================
          Industrias (compacto)
         ========================= */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center text-sky-400 mb-8">
          Soluciones CRM Cloud por industria
        </h2>

        <p className="text-center text-gray-300 mb-10 max-w-3xl mx-auto">
          Sistemas inteligentes para clínicas, consultorios, tiendas, almacenes y más.
          Controla tu negocio con reportes, fichas, inventarios y automatización.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-900 rounded-2xl p-4 text-white border border-white/10">
            <img src="/clinic-crm.png" alt="CRM Clínicas" className="rounded-xl mb-3" />
            <h3 className="font-bold text-yellow-400 text-lg mb-1">Consultorios y Clínicas</h3>
            <p className="text-sm text-gray-300">Historia médica, agendamiento, recetas, pagos y alertas.</p>
          </div>

          <div className="bg-gray-900 rounded-2xl p-4 text-white border border-white/10">
            <img src="/store-crm.png" alt="CRM Tiendas" className="rounded-xl mb-3" />
            <h3 className="font-bold text-yellow-400 text-lg mb-1">Tiendas y Almacenes</h3>
            <p className="text-sm text-gray-300">Stock, ventas, usuarios, promociones y reportes.</p>
          </div>

          <div className="bg-gray-900 rounded-2xl p-4 text-white border border-white/10">
            <img src="/warehouse-crm.png" alt="CRM Inventarios" className="rounded-xl mb-3" />
            <h3 className="font-bold text-yellow-400 text-lg mb-1">Gestión de Inventarios</h3>
            <p className="text-sm text-gray-300">Códigos de barras, trazabilidad y control por sucursal.</p>
          </div>

          <div className="bg-gray-900 rounded-2xl p-4 text-white border border-white/10">
            <img src="/cloud-benefits.png" alt="CRM Cloud" className="rounded-xl mb-3" />
            <h3 className="font-bold text-yellow-400 text-lg mb-1">Contable / Facturación</h3>
            <p className="text-sm text-gray-300">Acceso 24/7, backups automáticos y seguridad avanzada.</p>
          </div>
        </div>

        <div className="text-center mt-10">
          <p className="text-lg font-bold text-green-400">
            🥇 ¡Primeros 3 meses completamente <span className="underline text-white">gratis en CRM</span>!
          </p>
          <a href="#contacto" className="inline-block mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg transition-all font-extrabold">
            Solicita tu sistema CRM ahora
          </a>
        </div>
      </section>

      {/* =========================
          Clientes (logos)
         ========================= */}
      <section className="py-12 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">Clientes que ya confían en nosotros</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-items-center">
          <a href="https://ruedajusta.com" target="_blank" rel="noopener noreferrer" className="bg-gray-900 p-4 rounded-2xl border border-white/10 hover:scale-105 transition">
            <Image src="/cliente1.png" alt="Rueda Justa" width={110} height={60} />
          </a>
          <a href="https://aclassblog.com" target="_blank" rel="noopener noreferrer" className="bg-gray-900 p-4 rounded-2xl border border-white/10 hover:scale-105 transition">
            <Image src="/cliente2.png" alt="AclassBlog" width={110} height={60} />
          </a>
          <a href="https://tiendago.app" target="_blank" rel="noopener noreferrer" className="bg-gray-900 p-4 rounded-2xl border border-white/10 hover:scale-105 transition">
            <Image src="/cliente3.png" alt="TiendaGo" width={110} height={60} />
          </a>
          <a href="https://ecovia.space" target="_blank" rel="noopener noreferrer" className="bg-gray-900 p-4 rounded-2xl border border-white/10 hover:scale-105 transition">
            <Image src="/cliente4.png" alt="Ecovia" width={110} height={60} />
          </a>
          <a href="https://impulsuscorp.com/" target="_blank" rel="noopener noreferrer" className="bg-gray-900 p-4 rounded-2xl border border-white/10 hover:scale-105 transition">
            <Image src="/cliente6.png" alt="Impulsus" width={110} height={60} />
          </a>
          <a href="https://boxmedia.com.ec/" target="_blank" rel="noopener noreferrer" className="bg-gray-900 p-4 rounded-2xl border border-white/10 hover:scale-105 transition">
            <Image src="/cliente7.png" alt="Boxmedia" width={110} height={60} />
          </a>
        </div>
      </section>

      {/* =========================
          Testimonios
         ========================= */}
      <section className="bg-gray-900 py-14 px-6">
        <h2 className="text-3xl font-bold text-center text-blue-400 mb-8">Lo que opinan nuestros clientes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto text-white">
          <blockquote className="bg-gray-950 p-6 rounded-2xl border border-white/10">
            <p className="italic">“GPTROBOTIC automatizó el 80% de nuestras consultas repetitivas. Increíble.”</p>
            <footer className="mt-4 text-sm text-blue-300">— Cooperativa</footer>
          </blockquote>
          <blockquote className="bg-gray-950 p-6 rounded-2xl border border-white/10">
            <p className="italic">“Rápidos, profesionales y con soluciones reales para el sector financiero.”</p>
            <footer className="mt-4 text-sm text-blue-300">— Banco</footer>
          </blockquote>
          <blockquote className="bg-gray-950 p-6 rounded-2xl border border-white/10">
            <p className="italic">“No necesito estar siempre pendiente del Whatsapp, GPTRobotic automatizó mi trabajo.”</p>
            <footer className="mt-4 text-sm text-blue-300">— AclassBlog</footer>
          </blockquote>
          <blockquote className="bg-gray-950 p-6 rounded-2xl border border-white/10">
            <p className="italic">“Una página transaccional en tiempo récord, ágiles, profesionales y muy rápidos.”</p>
            <footer className="mt-4 text-sm text-blue-300">— RuedaJusta</footer>
          </blockquote>
        </div>
      </section>

      {/* =========================
          Partners
         ========================= */}
      <section className="py-14 px-6 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-center text-blue-400 mb-4">Nuestros partners cloud</h2>
        <p className="text-lg text-center text-gray-300 mb-10">
          Servicio 100% en la nube, respaldado por proveedores confiables.
        </p>
        <div className="flex justify-center gap-10 items-center">
          <Image src="/aws-logo.png" alt="AWS Logo" width={70} height={35} />
          <Image src="/azure-logo.png" alt="Azure Logo" width={70} height={35} />
        </div>
      </section>

      {/* =========================
          Contacto (final)
         ========================= */}
      <section id="contacto" className="py-16 px-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-400 text-center mb-6">Contáctanos</h2>

        {sent ? (
          <p className="text-green-400 text-center text-lg">
            ✅ Gracias por contactarnos. Te responderemos pronto.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="nombre"
              type="text"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Tu nombre"
              maxLength={80}
              pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$"
              title="Solo letras y espacios"
              className="w-full px-4 py-3 border border-gray-700 bg-gray-900 text-white rounded-xl"
              required
            />

            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Tu correo"
              maxLength={120}
              className="w-full px-4 py-3 border border-gray-700 bg-gray-900 text-white rounded-xl"
              required
            />

            <input
              name="celular"
              type="tel"
              value={form.celular}
              onChange={handleChange}
              placeholder="Tu número de celular"
              pattern="^(09\\d{8}|593\\d{9})$"
              title="Debe iniciar con 09 o 593 y tener el formato correcto"
              className="w-full px-4 py-3 border border-gray-700 bg-gray-900 text-white rounded-xl"
              required
            />

            <textarea
              name="mensaje"
              value={form.mensaje}
              onChange={handleChange}
              placeholder="Cuéntanos qué necesitas (facturación / visa / whatsapp masivo / bots / crm) y te contactamos..."
              maxLength={3000}
              rows={6}
              className="w-full px-4 py-3 border border-gray-700 bg-gray-900 text-white rounded-xl"
              required
            />

            <button
              type="submit"
              disabled={sending}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-extrabold py-3 px-4 rounded-xl w-full flex justify-center items-center"
            >
              {sending ? (
                <>
                  <Image src="/loader-white.svg" alt="Cargando..." width={20} height={20} className="mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar mensaje"
              )}
            </button>
          </form>
        )}
      </section>

      {/* Floating CTA */}
      <a
        href="#contacto"
        className="fixed bottom-20 right-6 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-extrabold px-5 py-3 rounded-full shadow-xl z-50 transition-all"
      >
        🚀 Solicita tu demo
      </a>

      <a
        href={wa.general}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg text-sm font-extrabold z-50"
      >
        💬 WhatsApp
      </a>

      <footer className="bg-gradient-to-r from-red-700 via-blue-800 to-gray-700 text-white text-center py-6">
        <p className="text-sm">GPTROBOTIC © {new Date().getFullYear()} - Todos los derechos reservados</p>
      </footer>
    </main>
  );
}
