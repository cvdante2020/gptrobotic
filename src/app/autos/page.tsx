"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import PlanesAutos from "@/components/PlanesAutos";
import ContactoForm from "@/components/ContactoForm";

export default function AutosPage() {
  const [mostrarModal, setMostrarModal] = useState(false);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-950 text-white">
        <section className="py-20 px-6 max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-blue-400 mb-6">
            Soluciones para Patios de Autos
          </h1>
          <p className="text-lg text-gray-300 mb-10">
            Gestiona tu concesionario con bots inteligentes, catálogos automatizados y CRM de interesados.
          </p>
          <button
            onClick={() => setMostrarModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg transition"
          >
            Solicitar demo
          </button>
        </section>

        <PlanesAutos />

        {/* Modal del formulario */}
        {mostrarModal && (
          <ContactoForm
            sector="Patios de Autos"
            modal={true}
            onClose={() => setMostrarModal(false)}
          />
        )}
      </main>
    </>
  );
}
