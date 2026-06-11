"use client";

const whatsappUrl =
  "https://wa.me/593963203102?text=Hola%20GPT%20Robotic%2C%20quiero%20una%20demostraci%C3%B3n%20de%20sus%20soluciones.";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 px-5 py-20 text-white md:px-8 lg:py-24">
      <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="absolute -right-24 bottom-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,.25)_1px,transparent_0)] [background-size:30px_30px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="mb-5 inline-flex rounded-full border border-emerald-300/30 bg-white/10 px-4 py-2 text-sm font-semibold text-emerald-200 shadow-sm backdrop-blur">
            Software empresarial para negocios reales
          </div>

          <h1 className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl lg:text-7xl">
            Tecnología simple para vender, atender y crecer.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 md:text-xl">
            Clínicas, consultorios, facturación electrónica, punto de venta, visas y páginas web profesionales. Todo en la nube, sin instalaciones y con acompañamiento humano.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#soluciones" className="rounded-2xl bg-emerald-500 px-7 py-4 text-center text-base font-bold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:bg-emerald-400">
              Ver soluciones
            </a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="rounded-2xl border border-white/20 bg-white/10 px-7 py-4 text-center text-base font-bold text-white shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15">
              Hablar por WhatsApp
            </a>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <div className="text-2xl font-extrabold text-emerald-300">$1.99</div>
              <p className="mt-1 text-sm text-slate-300">planes desde este valor mensual</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <div className="text-2xl font-extrabold text-cyan-300">Sin límites</div>
              <p className="mt-1 text-sm text-slate-300">sin licenciamiento por usuario</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <div className="text-2xl font-extrabold text-amber-300">Ecuador</div>
              <p className="mt-1 text-sm text-slate-300">pensado para negocios locales</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[32px] border border-white/10 bg-white/10 p-6 shadow-2xl shadow-black/30 backdrop-blur">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-sm font-semibold text-slate-300">GPTRobotic Cloud</p>
                <h2 className="text-2xl font-extrabold text-white">Centro de soluciones</h2>
              </div>
              <span className="rounded-full bg-emerald-400/15 px-4 py-2 text-sm font-bold text-emerald-200">Activo</span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ["Clínicas", "$1.99/mes", "Pacientes, citas e historia clínica"],
                ["Facturación + POS", "$1.99/mes", "Ventas, inventario y SRI"],
                ["Visas", "Asesoría", "Evaluación y preparación"],
                ["Página web", "$200", "Dominio y hosting por 1 año"],
              ].map(([title, price, text]) => (
                <div key={title} className="rounded-3xl border border-white/10 bg-white p-5 text-slate-950">
                  <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">{title}</p>
                  <div className="mt-3 text-3xl font-extrabold">{price}</div>
                  <p className="mt-1 text-sm text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
