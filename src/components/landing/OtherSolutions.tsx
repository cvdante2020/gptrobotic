import Link from "next/link";

const solutions = [
  {
    title: "Clínicas y consultorios",
    price: "desde $1.99/mes",
    text: "Citas, agendamiento, pacientes, historial clínico, radiografías, imágenes y documentos en una sola plataforma.",
    href: "/clinicas",
  },
  {
    title: "Visa Score",
    price: "acceso privado",
    text: "Evaluación informativa con login. Si no tienes cuenta, puedes solicitar pago y activación por WhatsApp.",
    href: "/visa",
  },
  {
    title: "Patios de autos",
    price: "desde $9.99/mes",
    text: "Controla vehículos, interesados, WhatsApp, seguimientos, reservas y ventas de principio a fin.",
    href: "/autos",
  },
];

export default function OtherSolutions() {
  return (
    <section id="soluciones" className="relative px-5 py-24 md:px-8">
      <div className="absolute inset-0 bg-white" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl">
          <div className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Otras soluciones</div>
          <h2 className="text-4xl font-semibold tracking-tight md:text-6xl">También tenemos sistemas listos para negocios.</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Estas soluciones están separadas del programa de embajadores para mantener claro el flujo principal de inscripción.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {solutions.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-[30px] border border-slate-200 bg-slate-50 p-7 transition hover:-translate-y-1 hover:border-sky-200 hover:bg-white hover:shadow-xl hover:shadow-slate-200/70"
            >
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">{item.price}</div>
              <h3 className="mt-5 text-2xl font-semibold text-slate-950">{item.title}</h3>
              <p className="mt-4 leading-7 text-slate-600">{item.text}</p>
              <div className="mt-8 font-semibold text-sky-600">Ver solución →</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
