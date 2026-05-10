import Link from "next/link";

const solutions = [
  {
    title: "Clínicas",
    price: "desde $1.99/mes",
    text: "Citas, pacientes, radiografías, historial e imágenes para negocios médicos.",
    href: "/clinicas",
  },
  {
    title: "Visa Score",
    price: "evaluación privada",
    text: "Módulo independiente para análisis y proceso de elegibilidad. Se conserva como solución al final de la página.",
    href: "/visa",
  },
  {
    title: "Autos y CRM",
    price: "sistemas a medida",
    text: "Gestión comercial, formularios, WhatsApp, leads y automatización para negocios.",
    href: "/autos",
  },
];

export default function OtherSolutions() {
  return (
    <section id="soluciones" className="relative px-5 py-24 md:px-8">
      <div className="absolute inset-0 bg-white" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl">
          <div className="mb-4 text-sm font-extrabold uppercase tracking-[0.18em] text-slate-500">Otras soluciones</div>
          <h2 className="text-4xl font-extrabold tracking-tight md:text-6xl">También desarrollamos sistemas completos.</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Estas soluciones quedan al final para no romper el flujo principal de embajadores y anunciantes.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {solutions.map((item) => (
            <Link key={item.title} href={item.href} className="group rounded-[34px] border border-slate-200 bg-slate-50 p-8 transition hover:-translate-y-1 hover:bg-white/[0.08]">
              <div className="text-sm font-extrabold uppercase tracking-[0.22em] text-cyan-600">{item.price}</div>
              <h3 className="mt-5 text-3xl font-extrabold text-slate-950">{item.title}</h3>
              <p className="mt-4 leading-7 text-slate-600">{item.text}</p>
              <div className="mt-8 font-extrabold text-cyan-600 group-hover:text-cyan-200">Ver solución →</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
