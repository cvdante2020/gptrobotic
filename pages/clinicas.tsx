import Link from "next/link";
import Navbar from "@/components/Navbar";
import ContactSection from "@/components/landing/ContactSection";
import Footer from "@/components/landing/Footer";

const features = ["Agenda de citas", "Pacientes e historias clínicas", "Imágenes y documentos", "Recordatorios", "Multiusuario", "Acceso desde celular", "Reportes", "Sin límite de registros"];

export default function ClinicasPage() {
  return (
    <main className="bg-white text-slate-950">
      <Navbar />
      <section className="relative overflow-hidden px-5 py-20 md:px-8 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(37,99,235,0.15),transparent_30%),radial-gradient(circle_at_80%_40%,rgba(6,182,212,0.15),transparent_28%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <span className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">GPT Clinic · USD 1.99 mensuales</span>
            <h1 className="mt-6 text-5xl font-semibold tracking-[-0.06em] md:text-7xl">Tu consultorio ordenado desde el primer día.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">Agenda, pacientes, historial clínico, imágenes y documentos en una plataforma simple para médicos, odontólogos, psicólogos, laboratorios y centros médicos.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="https://wa.me/593963203102?text=Hola%20GPT%20Robotic%2C%20quiero%20activar%20GPT%20Clinic%20por%201.99%20mensuales." className="rounded-full bg-slate-950 px-7 py-3.5 text-sm font-medium text-white" target="_blank" rel="noopener noreferrer">Solicitar activación</a>
              <Link href="/" className="rounded-full border border-slate-200 px-7 py-3.5 text-sm font-medium text-slate-950">Volver al inicio</Link>
            </div>
          </div>
          <div className="rounded-[38px] border border-slate-200 bg-[#f8fafc] p-6 shadow-[0_30px_100px_rgba(15,23,42,0.08)]">
            <div className="rounded-[30px] bg-slate-950 p-6 text-white">
              <div className="text-sm text-slate-400">Panel médico</div>
              <div className="mt-2 text-3xl font-semibold tracking-[-0.04em]">18 citas hoy</div>
              <div className="mt-6 grid gap-3">
                {features.slice(0,4).map((f) => <div key={f} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">{f}</div>)}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="px-5 pb-20 md:px-8"><div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">{features.map((f)=><div key={f} className="rounded-[26px] border border-slate-200 bg-white p-5 text-sm font-medium shadow-sm">{f}</div>)}</div></section>
      <ContactSection />
      <Footer />
    </main>
  );
}
