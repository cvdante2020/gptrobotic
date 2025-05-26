"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import PlanesClinicas from "@/components/PlanesClinicas";
import ContactoForm from "@/components/ContactoForm";

export default function ClinicasPage() {
  const [mostrarModal, setMostrarModal] = useState(false);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-950 text-white">
        <section className="py-20 px-6 max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-blue-400 mb-6">
            Soluciones para Clínicas y Consultorios
          </h1>
          <p className="text-lg text-gray-300 mb-10">
            Automatiza tu atención médica, agenda citas, administra fichas clínicas y brinda una experiencia moderna a tus pacientes.
          </p>
          <button
            onClick={() => setMostrarModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg transition"
          >
            Solicitar demo
          </button>
        </section>

        <PlanesClinicas />

        {/* Modal del formulario */}
        {mostrarModal && (
          <ContactoForm
            sector="Clínicas"
            modal={true}
            onClose={() => setMostrarModal(false)}
          />
        )}
      </main>
    </>
  );
}
