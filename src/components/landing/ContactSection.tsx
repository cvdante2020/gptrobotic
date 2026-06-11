import ContactoForm from "@/components/ContactoForm";

export default function ContactSection() {
  return (
    <section id="contacto" className="bg-slate-950 px-5 py-20 text-white md:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <span className="text-sm font-medium tracking-[0.24em] text-cyan-300 uppercase">Contacto</span>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-6xl">Armemos tu sistema sin complicarte.</h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">Escríbenos y te guiamos según tu negocio: consultorio, facturación o paquete web completo.</p>
          <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.04] p-6 text-sm leading-7 text-slate-300">
            WhatsApp: <b className="text-white">+593 998 260550 </b><br />
            Enfoque: sistemas de bajo costo, rápidos de activar y listos para vender.
          </div>
        </div>
        <div className="rounded-[34px] border border-white/10 bg-white p-4 shadow-[0_30px_100px_rgba(0,0,0,0.30)]">
          <ContactoForm />
        </div>
      </div>
    </section>
  );
}
