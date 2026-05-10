"use client";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-emerald-50 px-5 py-20 text-slate-950 md:px-8 lg:py-24">
      <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl" />
      <div className="absolute -right-24 bottom-20 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl" />
      <div className="absolute inset-0 opacity-[0.35] [background-image:radial-gradient(circle_at_1px_1px,rgba(14,165,233,.18)_1px,transparent_0)] [background-size:28px_28px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="mb-5 inline-flex rounded-full border border-cyan-200 bg-white/80 px-4 py-2 text-sm font-semibold text-cyan-700 shadow-sm">
            Programa de Embajadores y Publicidad Digital
          </div>

          <h1 className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl lg:text-7xl">
            Gana dinero recomendando soluciones digitales.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
            Aplica como embajador o registra tu negocio para anunciar. Revisaremos tu solicitud y te contactaremos por correo durante las próximas 24 horas laborables.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#registro" className="rounded-2xl bg-cyan-500 px-7 py-4 text-center text-base font-bold text-white shadow-lg shadow-cyan-500/25 transition hover:-translate-y-0.5 hover:bg-cyan-600">
              Quiero aplicar
            </a>
            <a href="#calculadora" className="rounded-2xl border border-slate-200 bg-white px-7 py-4 text-center text-base font-bold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300">
              Calcular utilidad
            </a>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-2xl font-extrabold text-cyan-600">$5</div>
              <p className="mt-1 text-sm text-slate-600">pago único por venta efectiva</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-2xl font-extrabold text-emerald-600">recurrente</div>
              <p className="mt-1 text-sm text-slate-600">bonificación mensual según actividad aprobada</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-2xl font-extrabold text-amber-500">10%-20%</div>
              <p className="mt-1 text-sm text-slate-600">por campañas publicitarias aprobadas</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/80">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <p className="text-sm font-semibold text-slate-500">Vista referencial</p>
                <h2 className="text-2xl font-extrabold text-slate-950">Embajador digital</h2>
              </div>
              <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700">Solicitud</span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-cyan-50 p-5">
                <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">Venta efectiva</p>
                <div className="mt-3 text-4xl font-extrabold text-slate-950">$5</div>
                <p className="mt-1 text-sm text-slate-600">pago único</p>
              </div>
              <div className="rounded-3xl bg-emerald-50 p-5">
                <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">Publicidad</p>
                <div className="mt-3 text-4xl font-extrabold text-slate-950">10%-20%</div>
                <p className="mt-1 text-sm text-slate-600">según campaña</p>
              </div>
            </div>

            <div className="mt-5 rounded-3xl bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-500">Proceso</p>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm font-bold text-slate-700">
                <div className="rounded-2xl bg-white px-3 py-3 shadow-sm">Aplica</div>
                <div className="rounded-2xl bg-white px-3 py-3 shadow-sm">Aprobación</div>
                <div className="rounded-2xl bg-white px-3 py-3 shadow-sm">Certifica</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
