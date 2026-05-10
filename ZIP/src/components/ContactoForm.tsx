"use client";

import { useState } from "react";

interface ContactoFormProps {
  sector?: string;
  modal?: boolean;
  onClose?: () => void;
}

export default function ContactoForm({ sector, modal = false, onClose }: ContactoFormProps) {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    celular: "",
    mensaje: "",
  });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    try {
      const payload = {
        ...form,
        sector: sector || "General"
      };

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setEnviado(true);
        setForm({ nombre: "", email: "", celular: "", mensaje: "" });
      } else {
        alert("Error al enviar el mensaje. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      alert("No se pudo enviar el mensaje.");
    } finally {
      setEnviando(false);
    }
  };

  const content = (
    <div className="space-y-4">
      {enviado ? (
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
            required
            className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded"
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Tu correo"
            maxLength={120}
            required
            className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded"
          />
          <input
            name="celular"
            type="tel"
            value={form.celular}
            onChange={handleChange}
            placeholder="Tu número de celular"
            pattern="^(09\d{8}|593\d{9})$"
            title="Debe iniciar con 09 o 593"
            required
            className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded"
          />
          <textarea
            name="mensaje"
            value={form.mensaje}
            onChange={handleChange}
            placeholder="Cuéntanos un poco de tu negocio y qué necesitas..."
            maxLength={3000}
            rows={6}
            required
            className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded"
          />
          <button
            type="submit"
            disabled={enviando}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full flex justify-center items-center"
          >
            {enviando ? (
  <>
    <svg
      className="animate-spin mr-2 h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
    Enviando...
  </>
) : (
  "Enviar mensaje"
)}
          </button>
        </form>
      )}
    </div>
  );

  return modal ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg max-w-xl w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold text-blue-400 mb-4 text-center">
          Contáctanos {sector ? `- ${sector}` : ""}
        </h2>
        {content}
      </div>
    </div>
  ) : (
    <section id="contacto" className="py-20 px-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-400 text-center mb-6">
        Contáctanos {sector ? `- ${sector}` : ""}
      </h2>
      {content}
    </section>
  );
}
