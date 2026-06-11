"use client";

import { useState } from "react";

type ContactoFormProps = {
  sector?: string;
  modal?: boolean;
  onClose?: () => void;
};

type FormState = {
  nombre: string;
  email: string;
  celular: string;
  mensaje: string;
};

const initialForm: FormState = {
  nombre: "",
  email: "",
  celular: "",
  mensaje: "",
};

export default function ContactoForm({ sector = "GPTRobotic", modal = false, onClose }: ContactoFormProps) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const updateField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, sector }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "No se pudo enviar el mensaje.");
      }

      setForm(initialForm);
      setSuccess("Gracias. Recibimos tus datos y te contactaremos pronto.");
    } catch (err: any) {
      setError(err?.message || "No se pudo enviar el mensaje. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Nombre</label>
        <input
          value={form.nombre}
          onChange={(e) => updateField("nombre", e.target.value)}
          required
          placeholder="Tu nombre"
          className="w-full rounded-2xl border border-white/10 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/20"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Correo</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
          required
          placeholder="correo@empresa.com"
          className="w-full rounded-2xl border border-white/10 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/20"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Celular / WhatsApp</label>
        <input
          value={form.celular}
          onChange={(e) => updateField("celular", e.target.value)}
          placeholder="096 000 0000"
          className="w-full rounded-2xl border border-white/10 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/20"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Mensaje</label>
        <textarea
          value={form.mensaje}
          onChange={(e) => updateField("mensaje", e.target.value)}
          required
          rows={4}
          placeholder="Cuéntanos qué solución necesitas"
          className="w-full resize-none rounded-2xl border border-white/10 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/20"
        />
      </div>

    {success && (
  <div className="rounded-2xl border border-emerald-300 bg-emerald-50 px-5 py-4">
    <div className="font-semibold text-emerald-900">
      Información enviada correctamente
    </div>
    <div className="mt-1 text-sm text-emerald-700">
      Gracias. Recibimos tus datos y te contactaremos pronto.
    </div>
  </div>
)}

{error && (
  <div className="rounded-2xl border border-red-300 bg-red-50 px-5 py-4">
    <div className="font-semibold text-red-900">
      No se pudo enviar la información
    </div>
    <div className="mt-1 text-sm text-red-700">
      Inténtalo nuevamente o contáctanos por WhatsApp.
    </div>
  </div>
)}
      <button
        type="submit"
        disabled={loading}
       className="w-full rounded-2xl bg-slate-950 px-5 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60" >
        {loading ? "Enviando..." : "Enviar datos"}
      </button>
    </form>
  );

  if (!modal) return formContent;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-[32px] border border-white/10 bg-slate-950 p-6 text-white shadow-2xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h3 className="text-2xl font-semibold tracking-[-0.04em]">Déjanos tus datos</h3>
          <button type="button" onClick={onClose} className="rounded-full bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20">
            Cerrar
          </button>
        </div>
        {formContent}
      </div>
    </div>
  );
}
