"use client";

import Navbar from "@/components/Navbar";

export default function PlanesClinicas() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto text-center">
      <h2 className="text-3xl font-bold text-blue-400 mb-10">Planes para Clínicas y Consultorios</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {/* Plan Médico Básico */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-blue-500">
          <h3 className="text-xl font-bold text-white mb-2">🩺 Plan Médico Básico</h3>
          <p className="text-green-400 text-3xl font-bold mb-4">$59<span className="text-sm text-gray-300">/mes</span></p>
          <ul className="text-sm text-white space-y-2 mb-6 text-left">
            <li>✔ Chatbot para agendamiento</li>
            <li>✔ Panel de control con calendario</li>
            <li>✔ 1 especialidad</li>
            <li>✔ Recordatorios automáticos</li>
                  <li>✔ Envio de promociones por WhatsApp</li>
          </ul>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full font-bold transition">Elegir plan</button>
        </div>

        {/* Plan Pro Salud */}
        <div className="bg-yellow-600 p-6 rounded-xl shadow-lg border-4 border-yellow-300 transform scale-105">
          <h3 className="text-xl font-bold text-black mb-2">🏥 Plan Pro Salud</h3>
          <p className="text-black text-3xl font-bold mb-4">$99<span className="text-sm">/mes</span></p>
          <ul className="text-sm text-black space-y-2 mb-6 text-left">
             <li>✔ 1 Bot personalizado</li>
            <li>✔ Hasta 5 especialidades</li>
            <li>✔ Fichas clínicas digitales</li>
            <li>✔ Firma electrónica de recetas</li>
            <li>✔ Dashboard de estadísticas</li>
                  <li>✔ Envio de promociones por WhatsApp</li>
          </ul>
          <button className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded w-full font-bold transition">Recomendado</button>
        </div>

        {/* Plan Clínica Premium */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-blue-500">
          <h3 className="text-xl font-bold text-white mb-2">💎 Plan Clínica Premium</h3>
          <p className="text-green-400 text-3xl font-bold mb-4">Desde $149<span className="text-sm text-gray-300">/mes</span></p>
          <ul className="text-sm text-white space-y-2 mb-6 text-left">
             <li>✔ 1 Bot personalizado</li>
            <li>✔ Agenda avanzada por médico</li>
            <li>✔ Portal del paciente</li>
            <li>✔ Módulo de pagos online</li>
            <li>✔ Soporte dedicado + entrenamientos</li>
                  <li>✔ Envio de promociones por WhatsApp</li>
          </ul>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full font-bold transition">Solicitar demo</button>
        </div>
      </div>
    </section>
  );
}
