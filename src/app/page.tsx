// src/app/page.tsx
"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    mensaje: ""
  });
  const [enviado, setEnviado] = useState(false);

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
        setEnviado(true);
        setForm({ nombre: "", email: "", mensaje: "" });
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
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <Image src="/cliente1.png" alt="Cliente 1" width={100} height={50} />
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <Image src="/cliente2.png" alt="Cliente 2" width={100} height={50} />
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <Image src="/cliente3.png" alt="Cliente 3" width={100} height={50} />
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <Image src="/cliente4.png" alt="Cliente 4" width={100} height={50} />
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
        <h2 className="text-3xl font-bold text-blue-400 text-center mb-6">Ejemplos de bots en acción</h2>
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

      <section id="contacto" className="py-20 px-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-400 text-center mb-6">Contáctanos</h2>
        {enviado ? (
          <p className="text-green-400 text-center text-lg">✅ Gracias por contactarnos. Te responderemos pronto.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Tu nombre" className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded" required />
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Tu correo" className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded" required />
            <textarea name="mensaje" value={form.mensaje} onChange={handleChange} placeholder="Cuéntanos un poco de tu negocio y enseguida un ejecutivo se comunicara..." className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded" rows={4} required />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">Enviar mensaje</button>
          </form>
        )}
      </section>

      <a href="#contacto" className="fixed bottom-20 right-6 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-5 py-3 rounded-full shadow-xl z-50 transition-all">
        🚀 Solicita tu demo ahora
      </a>

      <a href="https://wa.me/593963203102" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg text-sm font-bold z-50">
        💬 WhatsApp
      </a>

      <footer className="bg-gradient-to-r from-red-700 via-blue-800 to-gray-700 text-white text-center py-6">
        <p className="text-sm">GPTROBOTIC © {new Date().getFullYear()} - Todos los derechos reservados</p>
      </footer>
    </main>
  );
}
