"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ContactoForm from "@/components/ContactoForm";

const features = [
  "Registro de vehículos con fotos, precio, estado y características",
  "Control de interesados, llamadas, WhatsApp y seguimiento",
  "Embudo comercial desde el primer contacto hasta la venta",
  "Gestión de citas, pruebas de manejo y reservas",
  "Historial de negociaciones por cliente",
  "Reportes de ventas, prospectos y oportunidades abiertas",
  "Catálogo digital para compartir por redes sociales",
  "Panel para dueños, vendedores y administración",
];

export default function AutosPage() {
  const [mostrarModal, setMostrarModal] = useState(false);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white text-slate-950">
        <section className="relative overflow-hidden px-5 py-20 md:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.16),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.14),transparent_34%)]" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="mb-5 inline-flex rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
                Sistema para patios de autos desde $9.99 mensuales
              </div>

              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
                Controla tus ventas de autos de principio a fin.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Organiza vehículos, clientes, interesados, seguimientos, pruebas de manejo, reservas y cierres de venta en una sola plataforma.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setMostrarModal(true)}
                  className="rounded-2xl bg-orange-500 px-6 py-3 font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600"
                >
                  Solicitar información
                </button>
                <a
                  href="https://wa.me/593963203102?text=Hola%20GPT%20Robotic%2C%20quiero%20informaci%C3%B3n%20del%20sistema%20para%20patios%20de%20autos%20desde%209.99%20mensuales."
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

            <div className="rounded-[32px] border border-slate-200 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-200/80">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-400">Embudo comercial</div>
                  <div className="text-2xl font-semibold">Patio de autos</div>
                </div>
                <div className="rounded-full bg-orange-400/15 px-3 py-1 text-xs font-semibold text-orange-300">Ventas</div>
              </div>
              <div className="grid gap-3">
                {["Lead recibido", "Contacto por WhatsApp", "Prueba de manejo", "Reserva", "Venta cerrada"].map((item, index) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-400 text-sm font-semibold text-slate-950">{index + 1}</div>
                    <div className="font-medium">{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-16 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-3xl">
              <h2 className="text-3xl font-semibold md:text-5xl">Menos desorden, más seguimiento y más cierres.</h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">Pensado para patios de autos que manejan prospectos por redes, WhatsApp y llamadas, pero necesitan control real del proceso comercial.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-50 text-orange-700">✓</div>
                  <p className="font-medium leading-7 text-slate-700">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-20 md:px-8">
          <div className="mx-auto max-w-5xl rounded-[32px] border border-slate-200 bg-slate-950 p-8 text-center text-white shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-300">Precio inicial</p>
            <h2 className="mt-3 text-4xl font-semibold md:text-6xl">$9.99 / mes</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">Controla vehículos, interesados y ventas con una plataforma simple, moderna y conectada al proceso real del negocio.</p>
            <button
              type="button"
              onClick={() => setMostrarModal(true)}
              className="mt-8 rounded-2xl bg-orange-500 px-7 py-3 font-semibold text-white transition hover:bg-orange-600"
            >
              Quiero que me contacten
            </button>
          </div>
        </section>

        {mostrarModal && <ContactoForm sector="Patios de Autos" modal onClose={() => setMostrarModal(false)} />}
      </main>
    </>
  );
}
