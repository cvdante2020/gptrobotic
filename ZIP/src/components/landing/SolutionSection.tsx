"use client";

const whatsappBase = "https://wa.me/593963203102?text=";

const solutions = [
  {
    id: "clinicas",
    badge: "Producto activo",
    icon: "🏥",
    title: "Sistema Operativo para Clínicas y Consultorios",
    price: "$1.99",
    period: "mensual",
    description:
      "Organiza pacientes, agenda, historia clínica, documentos, recetas, certificados, resultados y seguimiento desde una sola plataforma.",
    bullets: [
      "Pacientes e historia clínica",
      "Agenda médica y consultorios",
      "Recetas, órdenes y certificados",
      "Portal paciente y recordatorios",
      "IA para resúmenes y seguimientos",
    ],
    note: "Sin límite de uso, sin licenciamiento y sin límite de espacio dentro del servicio ofrecido.",
    cta: "Quiero información de clínicas",
    message:
      "Hola GPTRobotic, quiero información del sistema para clínicas y consultorios de 1.99 mensual.",
  },
  {
    id: "facturacion-pos",
    badge: "Producto activo",
    icon: "🧾",
    title: "Facturación Electrónica + Punto de Venta",
    price: "$1.99",
    period: "mensual",
    description:
      "Vende, factura, cobra y controla inventario con un POS conectado a la operación diaria de tu negocio.",
    bullets: [
      "Facturas, notas de crédito y retenciones",
      "Caja, ventas y arqueo",
      "Inventario, kardex y bodegas",
      "Clientes, proveedores y cuentas por cobrar",
      "Reportes e IA para ventas",
    ],
    note: "La firma electrónica no está incluida. Debe adquirirse por separado al servicio mensual.",
    cta: "Quiero información de POS",
    message:
      "Hola GPTRobotic, quiero información de facturación electrónica y punto de venta de 1.99 mensual.",
  },
  {
    id: "visas",
    badge: "Servicio visible",
    icon: "🌎",
    title: "Visas y Migración",
    price: "Asesoría",
    period: "según proceso",
    description:
      "Mantén tu proceso de visa en un lugar visible, con evaluación, preparación y acompañamiento según el caso.",
    bullets: [
      "Evaluación inicial",
      "Preparación de entrevistas",
      "Revisión de información",
      "Seguimiento del proceso",
      "Canal de contacto directo",
    ],
    note: "Este servicio se mantiene como línea visible de GPTRobotic.",
    cta: "Ir a visas",
    href: "/visa",
  },
  {
    id: "web",
    badge: "Pago único",
    icon: "💻",
    title: "Página Web Profesional",
    price: "$200",
    period: "único pago",
    description:
      "Diseño de página web para negocios, profesionales y marcas que necesitan presencia digital rápida y clara.",
    bullets: [
      "Diseño profesional",
      "Dominio por 1 año",
      "Hosting por 1 año",
      "SSL y formulario de contacto",
      "WhatsApp integrado",
    ],
    note: "Ideal para negocios que necesitan salir rápido al mercado sin complicarse con temas técnicos.",
    cta: "Quiero mi página web",
    message:
      "Hola GPTRobotic, quiero información de la página web de 200 dólares con dominio y hosting por 1 año.",
  },
];

export default function SolutionsSection() {
  return (
    <section id="soluciones" className="bg-slate-50 px-5 py-20 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-emerald-600">
            Soluciones GPTRobotic
          </p>

          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 md:text-5xl">
            Cuatro líneas claras para vender mejor desde la portada.
          </h2>

          <p className="mt-4 text-lg leading-8 text-slate-600">
            La página queda enfocada en negocios reales: atender pacientes,
            facturar, vender, asesorar y publicar presencia web.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {solutions.map((item) => {
            const href =
              item.href ||
              `${whatsappBase}${encodeURIComponent(
                item.message || "Hola GPTRobotic, quiero información."
              )}`;

            const external = !item.href;

            return (
              <article
                key={item.id}
                id={item.id}
                className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70 md:p-8"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
                      <span>{item.icon}</span>
                      {item.badge}
                    </div>

                    <h3 className="max-w-xl text-2xl font-extrabold tracking-tight text-slate-950 md:text-3xl">
                      {item.title}
                    </h3>
                  </div>

                  <div className="rounded-3xl bg-slate-950 px-5 py-4 text-right text-white">
                    <div className="text-3xl font-black">{item.price}</div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                      {item.period}
                    </div>
                  </div>
                </div>

                <p className="mt-5 text-base leading-8 text-slate-600">
                  {item.description}
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {item.bullets.map((bullet) => (
                    <div
                      key={bullet}
                      className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-semibold text-slate-700"
                    >
                      <span className="text-emerald-600">✓</span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-900">
                  {item.note}
                </div>

                <a
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="mt-6 inline-flex rounded-2xl bg-emerald-600 px-6 py-3 font-bold text-white transition hover:bg-emerald-700"
                >
                  {item.cta}
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}