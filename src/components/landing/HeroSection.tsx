import Link from "next/link";

const metrics = [
  ["USD 1.99", "sistema médico mensual"],
  ["USD 0.03", "por factura emitida"],
  ["USD 200", "web + dominio + correos al año"],
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white px-5 py-20 md:px-8 md:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(37,99,235,0.16),transparent_28%),radial-gradient(circle_at_85%_20%,rgba(6,182,212,0.15),transparent_26%),radial-gradient(circle_at_65%_85%,rgba(124,58,237,0.12),transparent_30%)]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-7 inline-flex rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-medium tracking-[0.22em] text-slate-500 shadow-sm uppercase">
            Rebranding 2026 · Sistemas simples, precios reales
          </div>
          <h1 className="text-5xl font-semibold tracking-[-0.06em] text-slate-950 md:text-7xl lg:text-8xl">
            Software empresarial que cuesta menos que un café.
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
            Sistemas para consultorios médicos, facturación electrónica por uso y páginas web profesionales con dominio, hosting y correos incluidos.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="#productos" className="rounded-full bg-slate-950 px-7 py-3.5 text-sm font-medium text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5">
              Ver productos
            </Link>
            <a href="https://wa.me/593998260550?text=Hola%20GPT%20Robotic%2C%20quiero%20hablar%20con%20un%20asesor%20vendedor." target="_blank" rel="noopener noreferrer" className="rounded-full border border-slate-200 bg-white px-7 py-3.5 text-sm font-medium text-slate-950 transition hover:-translate-y-0.5 hover:border-slate-300">
              Solicitar demo
            </a>
          </div>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {metrics.map(([value, label]) => (
            <div key={value} className="rounded-[28px] border border-slate-200 bg-white/80 p-6 text-center shadow-[0_24px_80px_rgba(15,23,42,0.06)] backdrop-blur">
              <div className="text-3xl font-semibold tracking-[-0.04em] text-slate-950">{value}</div>
              <div className="mt-2 text-sm text-slate-500">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
