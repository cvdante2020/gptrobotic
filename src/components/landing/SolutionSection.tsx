import Link from "next/link";

const products = [
  {
    id: "clinicas",
    name: "GPT Clinic",
    price: "USD 1.99/mes",
    copy: "Agenda, pacientes, historial clínico, imágenes, documentos y seguimiento para consultorios médicos.",
    href: "/clinicas",
    accent: "from-blue-500 to-cyan-400",
    features: ["Agenda médica", "Historial clínico", "Imágenes y documentos", "Acceso móvil"],
  },
  {
    id: "facturacion",
    name: "GPT Factura",
    price: "USD 0.03/factura",
    copy: "Facturación electrónica por uso. Sin mensualidad base, sin licencias pesadas y lista para crecer.",
    href: "/facturacion",
    accent: "from-violet-500 to-blue-500",
    features: ["Factura electrónica", "Clientes y productos", "Reportes", "Multiempresa"],
  },
  {
    id: "web",
    name: "GPT Web",
    price: "USD 200/año",
    copy: "Página web, nombre de dominio, hosting, correos corporativos, SSL y formularios en un solo paquete.",
    href: "#contacto",
    accent: "from-emerald-400 to-cyan-500",
    features: ["Página web", "Dominio", "Correos", "Hosting + SSL"],
  },
];

export default function SolutionsSection() {
  return (
    <section id="productos" className="bg-[#f8fafc] px-5 py-20 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <span className="text-sm font-medium tracking-[0.24em] text-blue-600 uppercase">Productos principales</span>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-slate-950 md:text-6xl">Tres ofertas claras. Una marca más fuerte.</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">La página deja de vender “todo a la vez” y presenta soluciones fáciles de entender, comparar y comprar.</p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {products.map((product) => (
            <article key={product.id} id={product.id} className="group rounded-[34px] border border-slate-200 bg-white p-7 shadow-[0_24px_90px_rgba(15,23,42,0.06)] transition hover:-translate-y-1">
              <div className={`mb-8 h-2 w-24 rounded-full bg-gradient-to-r ${product.accent}`} />
              <div className="text-sm font-medium text-slate-500">{product.name}</div>
              <div className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-slate-950">{product.price}</div>
              <p className="mt-5 min-h-[96px] text-base leading-7 text-slate-600">{product.copy}</p>
              <div className="mt-7 grid gap-3">
                {product.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-sm text-slate-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-950" /> {feature}
                  </div>
                ))}
              </div>
              <Link href={product.href} className="mt-8 inline-flex rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-950 transition group-hover:border-slate-950">
                Conocer solución
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
