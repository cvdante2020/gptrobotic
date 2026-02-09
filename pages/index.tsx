"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import { useRouter } from "next/router";


export default function Home() {
  const router = useRouter();
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    celular: "",
    mensaje: ""
  });
  const [enviando, setEnviando] = useState(false);
 const [showVisaLogin, setShowVisaLogin] = useState(false);
  const [visaLogin, setVisaLogin] = useState({ username: "", password: "" });
  const [visaErr, setVisaErr] = useState<string | null>(null);
  const [visaLoading, setVisaLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        setEnviando(true);
        setForm({ nombre: "", email: "", celular: "", mensaje: "" });
      } else {
        alert("Hubo un error al enviar el mensaje. Inténtalo de nuevo más tarde.");
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      alert("No se pudo enviar el mensaje. Inténtalo de nuevo más tarde.");
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
        body: JSON.stringify(visaLogin)
      });

      const j = await r.json();
      setVisaLoading(false);

      if (!r.ok) return setVisaErr(j.error || "Error de acceso");
      router.push("/visa");
    } catch (err) {
      setVisaLoading(false);
      setVisaErr("No se pudo validar. Intenta de nuevo.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 relative">
      <Navbar />
      <section className="py-16 px-6 bg-gray-900 text-white text-center">
  <h2 className="text-3xl font-bold mb-4 text-green-400">📢 Sistema de Envío Masivo de WhatsApp</h2>
  <div className="flex flex-col md:flex-row items-center justify-center gap-8">
    <div className="md:w-1/2">
      <img 
        src="/whatsapp-crm.png" // Usa aquí la ruta de tu imagen o sube una a /public
        alt="Sistema de Envío Masivo"
        className="rounded-lg shadow-lg mx-auto"
      />
    </div>
    <div className="md:w-1/2 text-left space-y-4">
      <p className="text-lg">
        📲 Envia campañas de marketing, servicios y cobranza de manera automatizada
        Comunica a tus clientes cambios o actualizaciones.     
          **Respetamos las políticas de Meta
      </p>
      <p className="text-xl font-bold text-green-400">
        Desde <span className="text-yellow-400">$9.99 Mensual</span>.
      </p>
      <ul className="list-disc pl-6">
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
  </div>
</section>


   {/* ✅ NUEVA SECCIÓN VISA AMERICANA (AQUÍ VA) */}
<section className="py-20 px-6 bg-gradient-to-b from-black to-gray-950 text-white text-center">
  <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-yellow-400">
    🇺🇸 ¿Qué tan fuerte es tu perfil para la Visa Americana?
  </h2>

  <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-200 mb-8">
    Descúbrelo en minutos con una <b>evaluación rápida e informativa</b> que analiza la fortaleza real de tu perfil
    antes de iniciar el proceso consular.
    <br />
    <span className="block mt-2 text-yellow-300 font-bold">
      Inversión única: $1,00 USD
    </span>
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
      <h3 className="text-xl font-bold mb-2">
        Acceso a tu evaluación
      </h3>
      <p className="text-sm text-gray-300 mb-5">
        Ingresa el usuario y clave que recibiste luego del pago para continuar con tu evaluación.
      </p>

      <form onSubmit={handleVisaLogin} className="space-y-4">
        <div>
          <label className="text-sm font-semibold">Usuario</label>
          <input
            value={visaLogin.username}
            onChange={(e) =>
              setVisaLogin((p) => ({ ...p, username: e.target.value }))
            }
            className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded"
            required
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Clave</label>
          <input
            type="password"
            value={visaLogin.password}
            onChange={(e) =>
              setVisaLogin((p) => ({ ...p, password: e.target.value }))
            }
            className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded"
            required
          />
        </div>

        <button
          type="submit"
          disabled={visaLoading}
          className="w-full py-3 rounded-lg font-extrabold bg-blue-600 hover:bg-blue-700 transition"
        >
          {visaLoading ? "Validando acceso..." : "INGRESAR A MI EVALUACIÓN"}
        </button>

        {visaErr && (
          <div className="text-red-400 font-bold">{visaErr}</div>
        )}
      </form>
    </div>
  )}
</section>


      <section className="py-20 px-6 text-center bg-black text-white relative">
        <Image src="/logo-gptrobotic-v2.png" alt="GPT Robotic Logo" width={130} height={130} className="mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">GPTROBOTIC</h1>
        <div className="flex justify-center gap-4 mb-6">
          <Link href="/clinicas" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Ver solución para Clínicas</Link>
          <Link href="/autos" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Ver solución para Patios de Autos</Link>
        </div>
        <p className="text-lg md:text-xl max-w-3xl mx-auto text-white">
          Más de <strong>100 chatbots activos</strong> en menos de 3 meses 🚀<br />
          Automatizamos negocios en los sectores <strong>retail</strong>, <strong>financiero</strong>, <strong>médico</strong>, <strong>farmacéutico</strong>, <strong>venta de autos</strong>, <strong>educación</strong>, <strong>restauración</strong>, <strong>logística</strong>, <strong>turismo</strong>, <strong>ONGs</strong> y <strong>e-commerce</strong>.
        </p>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-blue-500 to-gray-400"></div>
      </section>

      <section className="py-20 px-6 max-w-7xl mx-auto text-center">
  <h2 className="text-3xl font-bold text-blue-400 mb-10">Planes y precios</h2>
  <div className="grid md:grid-cols-3 gap-8">
    {/* Plan Básico */}
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-blue-500">
      <h3 className="text-xl font-bold text-white mb-2">🚀 Plan Básico</h3>
      <p className="text-green-400 text-3xl font-bold mb-4">$49<span className="text-sm text-gray-300">/mes</span></p>
      <ul className="text-sm text-white space-y-2 mb-6 text-left">
        <li>✔ 1 Bot personalizado</li>
        <li>✔ Integración con WhatsApp</li>
        <li>✔ Panel de control simple</li>
        <li>✔ Soporte vía email</li>
      </ul>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full font-bold transition">Elegir este plan</button>
    </div>

    {/* Plan Pro */}
    <div className="bg-yellow-600 p-6 rounded-xl shadow-lg border-4 border-yellow-300 transform scale-105">
      <h3 className="text-xl font-bold text-black mb-2">🔥 Plan Profesional</h3>
      <p className="text-black text-3xl font-bold mb-4">$99<span className="text-sm">/mes</span></p>
      <ul className="text-sm text-black space-y-2 mb-6 text-left">
        <li>✔ 1 Bot personalizado</li>
        <li>✔ CRM integrado</li>
        <li>✔ Dashboard y estadísticas</li>
        <li>✔ Soporte prioritario</li>
      </ul>
      <button className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded w-full font-bold transition">Recomendado</button>
    </div>

    {/* Plan Empresarial */}
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-blue-500">
      <h3 className="text-xl font-bold text-white mb-2">🏢 Plan Empresarial</h3>
      <p className="text-green-400 text-3xl font-bold mb-4">Desde $199<span className="text-sm text-gray-300">/mes</span></p>
      <ul className="text-sm text-white space-y-2 mb-6 text-left">
        <li>✔ 1 Bot personalizado</li>
        <li>✔ Módulos a medida (agenda, pagos, etc.)</li>
        <li>✔ Integración con sistemas externos</li>
        <li>✔ Soporte dedicado 24/7</li>
      </ul>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full font-bold transition">Solicitar demo</button>
    </div>
  </div>
</section>
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">Clientes que ya confían en nosotros</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-items-center">
          <a href="https://ruedajusta.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-4 rounded-lg shadow-md hover:scale-105 transition">
            <Image src="/cliente1.png" alt="Rueda Justa" width={100} height={50} />
          </a>
          <a href="https://aclassblog.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-4 rounded-lg shadow-md hover:scale-105 transition">
            <Image src="/cliente2.png" alt="AclassBlog" width={100} height={50} />
          </a>
          <a href="https://tiendago.app" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-4 rounded-lg shadow-md hover:scale-105 transition">
            <Image src="/cliente3.png" alt="TiendaGo" width={100} height={50} />
          </a>
          <a href="https://ecovia.space" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-4 rounded-lg shadow-md hover:scale-105 transition">
            <Image src="/cliente4.png" alt="Ecovia" width={100} height={50} />
          </a>
           <a href="https://impulsuscorp.com/" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-4 rounded-lg shadow-md hover:scale-105 transition">
            <Image src="/cliente6.png" alt="Impulsus" width={100} height={50} />
          </a>
          <a href="https://boxmedia.com.ec/" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-4 rounded-lg shadow-md hover:scale-105 transition">
            <Image src="/cliente7.png" alt="Boxmedia" width={100} height={50} />
          </a>
        </div>
      
      </section>

<section className="py-20 px-6 max-w-5xl mx-auto">
  <h2 className="text-3xl font-bold text-blue-400 text-center mb-6">Soluciones para entidades financieras</h2>
  <p className="text-lg text-center mb-10 text-gray-300">
    Somos especialistas en automatizar procesos clave del sector financiero, asegurando eficiencia, seguridad y experiencia del cliente de alto nivel.
  </p>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left text-lg text-white">
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-2 text-yellow-400">💳 Consultas automatizadas</h3>
      <p>Automatizamos consultas como saldos, estados de cuenta y movimientos bancarios mediante autenticación segura.</p>
    </div>
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-2 text-yellow-400">⏰ Horarios y sucursales</h3>
      <p>Resolvemos preguntas frecuentes sobre horarios, ubicación de agencias, cajeros y canales disponibles.</p>
    </div>
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-2 text-yellow-400">📲 Integración omnicanal</h3>
      <p>Integramos los bots con WhatsApp, apps móviles, sitios web y plataformas de atención al cliente.</p>
    </div>
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-2 text-yellow-400">🔐 Seguridad y privacidad</h3>
      <p>Utilizamos encriptación, validaciones y control de acceso para proteger datos sensibles de los usuarios.</p>
    </div>
  </div>
</section>

      <section className="py-20 px-6 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 text-center text-gray-900">
        <h2 className="text-3xl font-bold mb-4">Promociones exclusivas</h2>
        <p className="text-lg mb-8">
          ¡Este mes! Tu primer chatbot desde <strong>$49.99</strong> mensuales con activación gratuita 💥
        </p>
        <a href="#contacto" className="inline-block bg-yellow-700 hover:bg-yellow-800 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition">Solicita tu demo ahora</a>
      </section>

      <section className="py-20 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6 text-blue-400">¿Por qué elegir GPTROBOTIC?</h2>
        <ul className="space-y-4 text-left text-lg">
          <li>✅ Integración rápida con WhatsApp, web o redes sociales</li>
          <li>✅ Panel administrativo incluido</li>
          <li>✅ Asistentes inteligentes entrenados por sector</li>
          <li>✅ Atención personalizada y soporte continuo</li>
          <li>✅ Casos de éxito documentados y crecimiento medible</li>
        </ul>
      </section>

      <section className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-400 text-center mb-6">Ejemplos de bots y Sistemas CRM</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 p-4 rounded-lg shadow-lg">
            <Image src="/whatsapp1.png" alt="WhatsApp Bot Demo 1" width={300} height={300} className="rounded-lg" />
          </div>
          <div className="bg-gray-900 p-4 rounded-lg shadow-lg">
            <Image src="/whatsapp2.png" alt="WhatsApp Bot Demo 2" width={300} height={300} className="rounded-lg" />
          </div>
          <div className="bg-gray-900 p-4 rounded-lg shadow-lg">
            <Image src="/whatsapp3.png" alt="WhatsApp Bot Demo 3" width={300} height={300} className="rounded-lg" />
          </div>
        </div>
      </section>

      <h2 className="text-2xl font-bold text-center text-sky-400 mt-20 mb-6">
  Soluciones CRM Cloud para tu Negocio
</h2>

{/* ✅ SECCIÓN FACTURACIÓN ELECTRÓNICA (FULL WIDTH PRO) */}
<section className="relative w-full overflow-hidden text-white">
  {/* Fondo animado */}
  <div className="absolute inset-0 bg-[#05070c]" />
  <div className="absolute inset-0 opacity-70">
    <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-yellow-500/25 blur-3xl animate-pulse" />
    <div className="absolute top-10 -right-40 h-[520px] w-[520px] rounded-full bg-blue-500/25 blur-3xl animate-pulse" />
    <div className="absolute -bottom-40 left-1/3 h-[520px] w-[520px] rounded-full bg-green-500/20 blur-3xl animate-pulse" />
  </div>

  {/* Patrón sutil */}
  <div
    className="absolute inset-0 opacity-[0.12]"
    style={{
      backgroundImage:
        "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.22) 1px, transparent 0)",
      backgroundSize: "22px 22px",
    }}
  />

  {/* Glow en bordes */}
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
      {/* Col 1: Titular */}
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
              <span className="text-green-400">$0.03</span> <span className="text-gray-200">por factura*</span>
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
      </div>

      {/* Col 2: Beneficios */}
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
            <span className="text-sky-400 mt-0.5">👤</span>
            <div>
              <b>Autollenado por cédula</b> (cuando el servicio esté disponible) para reducir tiempo.
            </div>
          </li>

          <li className="flex gap-3">
            <span className="text-emerald-300 mt-0.5">📡</span>
            <div><b>Online + Offline</b>: guarda y sincroniza al volver la conexión (según configuración).</div>
          </li>

          <li className="flex gap-3">
            <span className="text-purple-300 mt-0.5">📊</span>
            <div><b>Reportes</b> para contabilidad + exportaciones.</div>
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

      {/* Col 3: “Mockup” visual */}
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



<p className="text-center text-white mb-12 max-w-3xl mx-auto text-base md:text-lg">
  En GPT Robotic desarrollamos <span className="text-yellow-400 font-semibold">sistemas inteligentes</span> para 
  <span className="text-green-400"> clínicas, consultorios, tiendas, almacenes</span> y más. 
  Controla tu negocio desde cualquier lugar, con reportes, fichas, inventarios y automatización total.
</p>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 md:px-16">
  <div className="bg-gray-800 rounded-xl p-4 text-white shadow-lg">
    <img src="/clinic-crm.png" alt="CRM Clínicas" className="rounded mb-3" />
    <h3 className="font-bold text-yellow-400 text-lg mb-2">Consultorios y Clínicas</h3>
    <p className="text-sm">Historia médica, agendamiento, recetas, pagos y alertas en tiempo real.</p>
  </div>
  <div className="bg-gray-800 rounded-xl p-4 text-white shadow-lg">
    <img src="/store-crm.png" alt="CRM Tiendas" className="rounded mb-3" />
    <h3 className="font-bold text-yellow-400 text-lg mb-2">Tiendas y Almacenes</h3>
    <p className="text-sm">Controla stock, ventas, usuarios, promociones y reportes desde tu celular.</p>
  </div>
  <div className="bg-gray-800 rounded-xl p-4 text-white shadow-lg">
    <img src="/warehouse-crm.png" alt="CRM Almacenes" className="rounded mb-3" />
    <h3 className="font-bold text-yellow-400 text-lg mb-2">Gestión de Inventarios</h3>
    <p className="text-sm">Inventarios inteligentes, códigos de barras, trazabilidad por sucursal.</p>
  </div>
  <div className="bg-gray-800 rounded-xl p-4 text-white shadow-lg">
    <img src="/cloud-benefits.png" alt="CRM Cloud" className="rounded mb-3" />
    <h3 className="font-bold text-yellow-400 text-lg mb-2">Sistema Contable o Módulo de Facturación</h3>
    <p className="text-sm">Sin límite de espacio, accesible 24/7, backups automáticos y seguridad avanzada.</p>
  </div>
</div>

<div className="text-center mt-10">
  <p className="text-xl font-bold text-green-400">
    🥇 ¡Primeros 3 meses completamente <span className="underline text-white">gratis en CRM</span>!
  </p>
  <button className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-lg transition-all">
    Solicita tu sistema CRM ahora
  </button>
</div>


    <section id="contacto" className="py-20 px-6 max-w-3xl mx-auto">
  <h2 className="text-3xl font-bold text-blue-400 text-center mb-6">Contáctanos</h2>

  {enviando ? (
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
  pattern="^(09\d{8}|593\d{9})$"
  title="Debe iniciar con 09 o 593 y tener el formato correcto"
  className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded"
  required
/>

      <textarea
        name="mensaje"
        value={form.mensaje}
        onChange={handleChange}
        placeholder="Cuéntanos un poco de tu negocio y enseguida un ejecutivo se comunicará..."
        maxLength={3000}
        rows={6}
        className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded"
        required
      />
      <button
        type="submit"
        disabled={enviando}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full flex justify-center items-center"
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

<section className="bg-gray-900 py-16 px-6">
  <h2 className="text-3xl font-bold text-center text-blue-400 mb-8">Lo que opinan nuestros clientes</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto text-white">
  <blockquote className="bg-gray-800 p-4 rounded-lg shadow min-w-[300px] max-w-xs">
              <p className="italic">“GPTROBOTIC automatizó el 80% de nuestras consultas repetitivas. Increíble.”</p>
              <footer className="mt-4 text-sm text-blue-300">— Cooperativa</footer>
            </blockquote>
            <blockquote className="bg-gray-800 p-4 rounded-lg shadow min-w-[300px] max-w-xs">
              <p className="italic">“Rápidos, profesionales y con soluciones reales para el sector financiero.”</p>
              <footer className="mt-4 text-sm text-blue-300">— Banco</footer>
            </blockquote>
            <blockquote className="bg-gray-800 p-4 rounded-lg shadow min-w-[300px] max-w-xs">
              <p className="italic">“No necesito estar siempre pendiente del Whatsapp, GPTRobotic automatizó mi trabajo.”</p>
              <footer className="mt-4 text-sm text-blue-300">— AclassBlog</footer>
            </blockquote>
            <blockquote className="bg-gray-800 p-4 rounded-lg shadow min-w-[300px] max-w-xs">
              <p className="italic">“Una página transaccional en tiempo récord, ágiles, profesionales y muy rápidos.”</p>
              <footer className="mt-4 text-sm text-blue-300">— RuedaJusta</footer>
            </blockquote>
   </div>
        <style jsx>{`
          @keyframes slide {
            0% { transform: translateX(0); }
            25% { transform: translateX(-25%); }
            50% { transform: translateX(-50%); }
            75% { transform: translateX(-75%); }
            100% { transform: translateX(0); }
          }
          .animate-slide {
            animation: slide 20s linear infinite;
          }
        `}</style>
      </section>
<section className="py-20 bg-black text-white text-center">
  <h2 className="text-3xl font-bold mb-10 text-blue-400">Nuestros resultados</h2>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
    <div>
      <p className="text-4xl font-extrabold">+100</p>
      <p className="text-gray-400">Bots activos</p>
    </div>
    <div>
      <p className="text-4xl font-extrabold">+8</p>
      <p className="text-gray-400">Instituciones financieras</p>
    </div>
    <div>
      <p className="text-4xl font-extrabold">99.8%</p>
      <p className="text-gray-400">Disponibilidad</p>
    </div>
    <div>
      <p className="text-4xl font-extrabold">+3k</p>
      <p className="text-gray-400">Consultas automatizadas al día</p>
    </div>
  </div>
</section>



      <a href="#contacto" className="fixed bottom-20 right-6 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-5 py-3 rounded-full shadow-xl z-50 transition-all">
        🚀 Solicita tu demo ahora
      </a>

      <a href="https://wa.me/593963203102" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg text-sm font-bold z-50">
        💬 WhatsApp
      </a>
<section className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">Nuestros partners cloud</h2>
        <p className="text-lg text-center text-gray-300 mb-10">
          Nuestro servicio es 100% en la nube, respaldado por los proveedores más confiables del mundo.
        </p>
        <div className="flex justify-center gap-10 items-center">
          <Image src="/aws-logo.png" alt="AWS Logo" width={60} height={30} />
          <Image src="/azure-logo.png" alt="Azure Logo" width={60} height={30} />
        </div>

      </section>
      <footer className="bg-gradient-to-r from-red-700 via-blue-800 to-gray-700 text-white text-center py-6">
        <p className="text-sm">GPTROBOTIC © {new Date().getFullYear()} - Todos los derechos reservados</p>
      </footer>

      
    </main>
  );
}
