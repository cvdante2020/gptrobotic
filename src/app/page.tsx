// src/app/page.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
export default function Home() {
 const [form, setForm] = useState({
  nombre: "",
  email: "",
  celular: "", // nuevo campo
  mensaje: ""
});
const [enviando, setEnviando] = useState(false); // eslint-disable-line @typescript-eslint/no-unused-vars

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
        setForm({ nombre: "", email: "",celular:"", mensaje: "" });
      } else {
        alert("Hubo un error al enviar el mensaje. Inténtalo de nuevo más tarde.");
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      alert("No se pudo enviar el mensaje. Inténtalo de nuevo más tarde.");
    }
  };

    return (
      
    <main className="min-h-screen bg-gray-950 text-gray-100 relative">
      <section className="py-20 px-6 text-center bg-black text-white relative">
        <Image src="/logo-gptrobotic-v2.png" alt="GPT Robotic Logo" width={130} height={130} className="mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">GPTROBOTIC</h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto text-white">
          Más de <strong>100 chatbots activos</strong> en menos de 3 meses 🚀<br />
          Automatizamos negocios en el mundo <strong>retail</strong>, <strong>financiero</strong>, <strong>médico</strong>, <strong>farmacéutico</strong>, <strong>venta de autos</strong>, <strong>educación</strong>, <strong>restauración</strong>, <strong>logística</strong>, <strong>turismo</strong>, <strong>ONGs</strong> y <strong>e-commerce</strong>.
        </p>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-blue-500 to-gray-400"></div>
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
        </div>
      </section>
<section className="py-20 px-6 max-w-5xl mx-auto">
  <h2 className="text-3xl font-bold text-blue-400 text-center mb-6">¿Qué hacemos en GPTROBOTIC?</h2>
  <p className="text-lg text-center mb-10 text-gray-300">
    En GPT Robotic transformamos ideas en soluciones tecnológicas para negocios inteligentes y automatizados.
  </p>
<div className="bg-gray-800 text-white rounded-lg p-6 mb-6">
  <h3 className="text-xl font-bold mb-2 text-yellow-400">
    🧠 Desarrollo de Sistemas
  </h3>
  <p className="text-sm text-white">
    Creamos soluciones tecnológicas a la medida para tu negocio: consultorios, clínicas, almacenes, puntos de venta, tiendas, sistemas contables y todo lo que necesite ser automatizado. Integramos software eficiente para hacer tu operación más inteligente.
  </p>
</div>



  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left text-lg text-white">
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-2 text-yellow-400">🌐 Desarrollo Web</h3>
      <p>Diseñamos y desarrollamos páginas web profesionales, modernas, responsivas y enfocadas en conversión.</p>
    </div>

    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-2 text-yellow-400">🗣️ Voice Bots & Chatbots</h3>
      <p>Implementamos asistentes virtuales por voz o chat conectados a WhatsApp, Web o llamadas telefónicas, usando IA.</p>
    </div>

    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-2 text-yellow-400">📣 Marketing Digital</h3>
      <p>Diseñamos e implementamos campañas publicitarias con segmentación precisa y resultados medibles.</p>
    </div>
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-2 text-yellow-400">🔍 Posicionamiento SEO</h3>
      <p>Mejoramos tu visibilidad en Google con estrategias de posicionamiento orgánico y contenido optimizado.</p>
    </div>
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
    🥇 ¡Primeros 3 meses completamente <span className="underline text-white">gratis</span>!
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
