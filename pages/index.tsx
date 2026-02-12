"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  // Contacto
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    celular: "",
    mensaje: "",
  });
  const [enviandoOk, setEnviandoOk] = useState(false);
  const [enviando, setEnviando] = useState(false);

  // Visa
  const [showVisaLogin, setShowVisaLogin] = useState(false);
  const [visaLogin, setVisaLogin] = useState({ username: "", password: "" });
  const [visaErr, setVisaErr] = useState<string | null>(null);
  const [visaLoading, setVisaLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setEnviandoOk(true);
        setForm({ nombre: "", email: "", celular: "", mensaje: "" });
      } else {
        alert("Hubo un error al enviar el mensaje. Inténtalo de nuevo más tarde.");
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      alert("No se pudo enviar el mensaje. Inténtalo de nuevo más tarde.");
    } finally {
      setEnviando(false);
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
        setVisaErr(j.error || "Error de acceso");
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

      {/* ======================================================
          HERO (SOLO EMPRESAS) - NO MEZCLAR MENSAJE CON VISA
         ====================================================== */}
      <section className="py-20 px-6 text-center bg-black text-white relative overflow-hidden">
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

        <div className="relative z-10">
          <Image
            src="/logo-gptrobotic-v2.png"
            alt="GPT Robotic Logo"
            width={130}
            height={130}
            className="mx-auto mb-4"
            priority
          />

          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            GPT<span className="text-blue-400">ROBOTIC</span>
          </h1>

          <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-200">
            <span className="text-gray-300 font-semibold">Para empresas:</span> automatizamos tu operación con{" "}
            <b className="text-yellow-300">Facturación Electrónica</b>, bots, CRM y sistemas a medida.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#facturacion"
              className="inline-block px-8 py-4 rounded-2xl font-extrabold text-lg bg-yellow-500 hover:bg-yellow-600 text-black shadow-xl transition"
            >
              💛 Ver Facturación
            </a>
            <a
              href="#contacto"
              className="inline-block px-8 py-4 rounded-2xl font-extrabold text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xl transition"
            >
              🚀 Solicitar demo
            </a>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
            <Link
              href="/clinicas"
              className="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition"
            >
              Clínicas
            </Link>
            <Link
              href="/autos"
              className="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition"
            >
              Patios de Autos
            </Link>
            <a
              href="#whatsapp-masivo"
              className="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition"
            >
              WhatsApp masivo
            </a>
            {/* Visa como link, pero SIN mezclar copy */}
            <a
              href="#visa"
              className="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition"
            >
              Visa Score
            </a>
          </div>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-2xl font-extrabold">+100</div>
              <div className="text-xs text-gray-300">Bots activos</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-2xl font-extrabold">+8</div>
              <div className="text-xs text-gray-300">Financieras</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-2xl font-extrabold">99.8%</div>
              <div className="text-xs text-gray-300">Disponibilidad</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-2xl font-extrabold">+3k</div>
              <div className="text-xs text-gray-300">Consultas/día</div>
            </div>
          </div>
        </div>

        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-blue-500 to-gray-400" />
      </section>

      {/* ======================================================
          SECCIÓN: PARA EMPRESAS (Etiqueta)
         ====================================================== */}
      <section className="py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-200">
            <span className="text-lg">🏢</span>
            <span className="font-bold">Soluciones para Empresas</span>
          </div>
        </div>
      </section>

      {/* ======================================================
          FACTURACIÓN (PRODUCTO ESTRELLA B2B)
         ====================================================== */}
      <section id="facturacion" className="relative w-full overflow-hidden text-white">
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

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
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
                  href="https://wa.me/593963203102?text=Hola%20GPTROBOTIC,%20quiero%20informaci%C3%B3n%20de%20Facturaci%C3%B3n%20Electr%C3%B3nica%20(%240.03%20por%20factura)%20y%20una%20demo."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-7 py-3 rounded-xl font-extrabold bg-green-600 hover:bg-green-700 text-white shadow-lg transition text-center"
                >
                  💬 WhatsApp
                </a>
              </div>

              <p className="text-xs text-gray-400">* Tarifa referencial; puede variar por plan y volumen.</p>
            </div>

            <div className="lg:col-span-1 bg-gray-900/60 backdrop-blur border border-white/10 rounded-2xl p-7 shadow-xl">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <span>✅</span> Todo lo que necesitas
              </h3>

              <ul className="mt-6 space-y-4 text-gray-200">
                <li className="flex gap-3">
                  <span className="text-yellow-400 mt-0.5">⚡</span>
                  <div><b>Emisión ágil</b>: menos pasos, menos errores.</div>
                </li>
                <li className="flex gap-3">
                  <span className="text-sky-400 mt-0.5">📊</span>
                  <div><b>Reportes</b> listos para contabilidad + exportaciones.</div>
                </li>
                <li className="flex gap-3">
                  <span className="text-emerald-300 mt-0.5">📡</span>
                  <div><b>Online + Offline</b> (según configuración).</div>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-200 mt-0.5">🔒</span>
                  <div>Seguridad y trazabilidad de documentos.</div>
                </li>
              </ul>
            </div>

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
                    <div className="h-9 flex-1 rounded-xl bg-yellow-500/80" />
                    <div className="h-9 w-24 rounded-xl bg-green-500/70" />
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

      {/* ======================================================
          WhatsApp masivo (B2B)
         ====================================================== */}
      <section id="whatsapp-masivo" className="py-16 px-6 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-left space-y-4">
            <h2 className="text-3xl font-bold mb-2 text-green-400">📢 Sistema de Envío Masivo de WhatsApp</h2>
            <p className="text-lg text-gray-200">
              Envía campañas de marketing, servicios y cobranza de manera automatizada. <b>Respetamos las políticas de Meta</b>.
            </p>
            <p className="text-xl font-bold text-green-400">
              Desde <span className="text-yellow-400">$9.99 Mensual</span>.
            </p>
            <ul className="list-disc pl-6 text-gray-200">
              <li>✅ Marketing y promociones</li>
              <li>✅ Servicios personalizados</li>
              <li>✅ Cobranza y recordatorios</li>
            </ul>
            <a
              href="#contacto"
              className="inline-block mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg transition"
            >
              Solicita tu demo ahora
            </a>
          </div>

          <div className="md:w-1/2 md:ml-auto">
            <img
              src="/whatsapp-crm.png"
              alt="Sistema de Envío Masivo"
              className="rounded-lg shadow-lg mx-auto border border-white/10"
            />
          </div>
        </div>
      </section>

      {/* ======================================================
          DIVISOR / CAMBIO DE AUDIENCIA (NO MEZCLA)
         ====================================================== */}
      <section className="py-14 px-6 bg-black">
        <div className="max-w-7xl mx-auto flex items-center gap-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-400/20 text-yellow-200 font-bold">
            👤 Soluciones para Personas
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
        <p className="text-center text-gray-400 mt-4 max-w-3xl mx-auto">
        
        </p>
      </section>

      {/* ======================================================
          VISA (B2C) - MÁS ABAJO Y SEPARADA
         ====================================================== */}
      <section id="visa" className="py-20 px-6 bg-gradient-to-b from-black to-gray-950 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-yellow-400">
          🇺🇸 Evaluación de Perfil para Visa Americana
        </h2>

        <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-200 mb-8">
          Descúbrelo en minutos con una <b>evaluación rápida e informativa</b>.
          <br />
          <span className="block mt-2 text-yellow-300 font-bold">Inversión única: $1,00 USD</span>
          <span className="block text-sm text-gray-400 mt-3">
            No garantiza aprobación. No constituye asesoría legal ni migratoria.
          </span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://wa.me/593963203102?text=Hola%20GPTROBOTIC,%20quiero%20PAGAR%20la%20evaluaci%C3%B3n%20de%20Visa%20Americana%20y%20recibir%20usuario%20y%20clave."
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
            className="px-8 py-4 rounded-xl font-extrabold text-lg bg-yellow-500 hover:bg-yellow-600 text-black shadow-xl transition"
          >
            🔐 YA TENGO USUARIO Y CLAVE
          </button>
        </div>

        {showVisaLogin && (
          <div className="max-w-md mx-auto mt-10 bg-gray-900 border border-gray-700 rounded-2xl p-6 text-left shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold mb-2">Acceso a tu evaluación</h3>
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

      {/* ======================================================
          CONTACTO
         ====================================================== */}
      <section id="contacto" className="py-20 px-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-400 text-center mb-6">Contáctanos</h2>

        {enviandoOk ? (
          <p className="text-green-400 text-center text-lg">✅ Gracias por contactarnos. Te responderemos pronto.</p>
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
              className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded"
              required
            />

            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Tu correo"
              maxLength={120}
              className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded"
              required
            />

           <input
  name="celular"
  type="tel"
  value={form.celular}
  onChange={handleChange}
  placeholder="Tu número de celular"
  pattern="^(?:09\d{8}|5939\d{8})$"
  title="Debe iniciar con 09 o 5939 y tener el formato correcto"
  className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded"
  required
/>


            <textarea
              name="mensaje"
              value={form.mensaje}
              onChange={handleChange}
              placeholder="Cuéntanos qué necesitas y un ejecutivo se comunicará..."
              maxLength={3000}
              rows={6}
              className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded"
              required
            />

            <button
              type="submit"
              disabled={enviando}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full flex justify-center items-center disabled:opacity-60"
            >
              {enviando ? (
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
        className="fixed bottom-20 right-6 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-5 py-3 rounded-full shadow-xl z-50 transition-all"
      >
        🚀 Solicita tu demo ahora
      </a>

      <a
        href="https://wa.me/593963203102"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg text-sm font-bold z-50"
      >
        💬 WhatsApp
      </a>

      <footer className="bg-gradient-to-r from-red-700 via-blue-800 to-gray-700 text-white text-center py-6">
        <p className="text-sm">GPTROBOTIC © 2023- Todos los derechos reservados</p>
      </footer>
    </main>
  );
}
