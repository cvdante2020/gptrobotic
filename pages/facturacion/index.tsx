import Navbar from "@/components/Navbar";
import ContactSection from "@/components/landing/ContactSection";
import Footer from "@/components/landing/Footer";
import Link from "next/link";

const items = ["Facturas electrónicas", "Notas de crédito", "Clientes", "Productos", "Multiempresa", "Reportes", "Onboarding", "Acceso seguro"];

export default function FacturacionLanding() {
  return (
    <main className="bg-white text-slate-950">
      <Navbar />
      <section className="relative overflow-hidden px-5 py-20 md:px-8 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(124,58,237,0.14),transparent_30%),radial-gradient(circle_at_80%_35%,rgba(37,99,235,0.14),transparent_28%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <span className="rounded-full border border-violet-100 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700">GPT Factura · USD 0.03 por factura emitida</span>
            <h1 className="mt-6 text-5xl font-semibold tracking-[-0.06em] md:text-7xl">Facturación electrónica sin mensualidades pesadas.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">Paga por uso: emite facturas, administra clientes, productos y reportes. La firma electrónica se adquiere por separado.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="https://wa.me/593998260550?text=Hola%20GPT%20Robotic%2C%20quiero%20informaci%C3%B3n%20de%20GPT%20Factura%20a%200.03%20por%20factura." className="rounded-full bg-slate-950 px-7 py-3.5 text-sm font-medium text-white" target="_blank" rel="noopener noreferrer">Pedir información</a>
              <Link href="/facturacion/panel" className="rounded-full border border-slate-200 px-7 py-3.5 text-sm font-medium text-slate-950">Ya tengo cuenta</Link>
            </div>
          </div>
          <div className="rounded-[38px] border border-slate-200 bg-[#f8fafc] p-6 shadow-[0_30px_100px_rgba(15,23,42,0.08)]">
            <div className="rounded-[30px] bg-white p-6">
              <div className="text-sm text-slate-500">Costo variable</div>
              <div className="mt-2 text-5xl font-semibold tracking-[-0.06em]">$0.03</div>
              <p className="mt-3 text-sm text-slate-600">por factura emitida</p>
              <div className="mt-6 grid gap-3">{items.slice(0,4).map((i)=><div key={i} className="rounded-2xl border border-slate-200 p-4 text-sm font-medium">{i}</div>)}</div>
            </div>
          </div>
        </div>
      </section>
      <section className="px-5 pb-20 md:px-8"><div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">{items.map((f)=><div key={f} className="rounded-[26px] border border-slate-200 bg-white p-5 text-sm font-medium shadow-sm">{f}</div>)}</div></section>
      <ContactSection />
      <Footer />
    </main>
  );
}
