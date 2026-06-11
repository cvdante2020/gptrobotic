import Link from "next/link";
import Navbar from "@/components/Navbar";
import ContactSection from "@/components/landing/ContactSection";
import Footer from "@/components/landing/Footer";

const steps = ["Lead recibido", "Contacto", "Prueba de manejo", "Negociación", "Reserva", "Venta cerrada"];

export default function AutosPage() {
  return (
    <main className="bg-white text-slate-950">
      <Navbar />
      <section className="relative overflow-hidden px-5 py-20 md:px-8 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(249,115,22,0.16),transparent_30%),radial-gradient(circle_at_10%_50%,rgba(37,99,235,0.12),transparent_30%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <span className="rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700">Patio de autos · USD 9.99 mensuales</span>
            <h1 className="mt-6 text-5xl font-semibold tracking-[-0.06em] md:text-7xl">Controla tus ventas de principio a fin.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">Vehículos, prospectos, WhatsApp, seguimiento, reservas y cierres de venta en un solo flujo comercial.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="https://wa.me/593963203102?text=Hola%20GPT%20Robotic%2C%20quiero%20informaci%C3%B3n%20del%20sistema%20para%20patio%20de%20autos." className="rounded-full bg-slate-950 px-7 py-3.5 text-sm font-medium text-white" target="_blank" rel="noopener noreferrer">Solicitar demo</a>
              <Link href="/" className="rounded-full border border-slate-200 px-7 py-3.5 text-sm font-medium text-slate-950">Volver al inicio</Link>
            </div>
          </div>
          <div className="rounded-[38px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_30px_100px_rgba(15,23,42,0.18)]">
            <div className="text-sm text-slate-400">Embudo comercial</div>
            <div className="mt-6 grid gap-3">{steps.map((s,i)=><div key={s} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-400 text-sm font-semibold text-slate-950">{i+1}</span>{s}</div>)}</div>
          </div>
        </div>
      </section>
      <ContactSection />
      <Footer />
    </main>
  );
}
