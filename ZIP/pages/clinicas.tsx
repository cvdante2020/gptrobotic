"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ContactoForm from "@/components/ContactoForm";

const features = [
  "Agenda de citas por día, profesional o consultorio",
  "Registro de pacientes y datos de contacto",
  "Historial clínico digital organizado",
  "Carga de imágenes, radiografías, resultados y documentos",
  "Recordatorios y seguimiento por WhatsApp o email según configuración",
  "Panel para controlar consultas, atenciones y próximos turnos",
  "Acceso desde computadora, tablet o celular",
  "Espacio amplio para archivos e imágenes de pacientes",
];

export default function ClinicasPage() {
  const [mostrarModal, setMostrarModal] = useState(false);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 text-slate-950">
        <section className="relative overflow-hidden px-5 py-20 md:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.16),transparent_34%)]" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="mb-5 inline-flex rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-700 shadow-sm">
                Sistema para clínicas y consultorios desde $1.99 mensuales
              </div>

              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
                Administra tu clínica, tus citas y tus imágenes médicas en un solo lugar.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Una solución sencilla para organizar pacientes, agendamiento, historiales, radiografías, imágenes y documentos sin depender de hojas sueltas o mensajes perdidos.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setMostrarModal(true)}
                  className="rounded-2xl bg-sky-600 px-6 py-3 font-semibold text-white shadow-lg shadow-sky-200 transition hover:bg-sky-700"
                >
                  Solicitar información
                </button>
                <a
                  href="https://wa.me/593963203102?text=Hola%20GPT%20Robotic%2C%20quiero%20informaci%C3%B3n%20del%20sistema%20para%20cl%C3%ADnicas%20desde%201.99%20mensuales."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-800 transition hover:border-emerald-300 hover:text-emerald-700"
                >
                  Escribir por WhatsApp
                </a>
                <Link href="/" className="rounded-2xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100">
                  Volver al inicio
                </Link>
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/80">
              <div className="rounded-3xl bg-slate-950 p-5 text-white">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-slate-300">Panel de clínica</span>
                  <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">Activo</span>
                </div>
                <div className="grid gap-3">
                  {[
                    ["Citas de hoy", "18"],
                    ["Pacientes registrados", "+240"],
                    ["Imágenes cargadas", "Ilimitadas*"],
                    ["Recordatorios", "Automáticos"],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="text-sm text-slate-400">{label}</div>
                      <div className="mt-1 text-2xl font-semibold">{value}</div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-slate-400">*Según configuración y plan de almacenamiento disponible.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-16 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-3xl">
              <h2 className="text-3xl font-semibold md:text-5xl">Todo lo que una clínica pequeña necesita para ordenar su operación.</h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">Ideal para consultorios, centros médicos, odontología, estética, laboratorios y servicios que necesitan controlar citas e información del paciente.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">✓</div>
                  <p className="font-medium leading-7 text-slate-700">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-20 md:px-8">
          <div className="mx-auto max-w-5xl rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">Precio inicial</p>
            <h2 className="mt-3 text-4xl font-semibold md:text-6xl">$1.99 / mes</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600">Empieza con una solución ligera, escalable y fácil de usar. Para clínicas con más necesidades se puede ampliar con módulos personalizados.</p>
            <button
              type="button"
              onClick={() => setMostrarModal(true)}
              className="mt-8 rounded-2xl bg-slate-950 px-7 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
              Quiero que me contacten
            </button>
          </div>
        </section>

        {mostrarModal && <ContactoForm sector="Clínicas" modal onClose={() => setMostrarModal(false)} />}
      </main>
    </>
  );
}
