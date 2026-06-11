"use client";

import ContactoForm from "@/components/ContactoForm";

const phone = "+593 96 320 3102";
const email = "info@gptrobotic.com";
const whatsappUrl =
  "https://wa.me/593963203102?text=Hola%20GPT%20Robotic%2C%20quiero%20informaci%C3%B3n%20de%20sus%20soluciones.";

export default function ContactSection() {
  return (
    <section id="contacto" className="bg-slate-950 px-5 py-20 text-white md:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-emerald-300">Contacto</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl">Hablemos de la solución que necesita tu negocio.</h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">Puedes escribir por WhatsApp, enviar correo o dejar tus datos en el formulario.</p>

          <div className="mt-8 space-y-4">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block rounded-2xl border border-white/10 bg-white/10 p-5 font-bold text-white transition hover:bg-white/15">
              WhatsApp: {phone}
            </a>
            <a href={`mailto:${email}`} className="block rounded-2xl border border-white/10 bg-white/10 p-5 font-bold text-white transition hover:bg-white/15">
              Email: {email}
            </a>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/10 p-4 backdrop-blur md:p-6">
          <ContactoForm sector="GPTRobotic" />
        </div>
      </div>
    </section>
  );
}
