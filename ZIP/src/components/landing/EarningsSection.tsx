const items = [
  {
    amount: "$5",
    title: "Venta efectiva",
    text: "Pago único por cada venta real y aprobada dentro del sistema privado.",
  },
  {
    amount: "Mensual",
    title: "Bonificación recurrente",
    text: "Puedes construir una bonificación mensual según clientes aprobados y actividad validada.",
  },
  {
    amount: "10%-20%",
    title: "Publicidad digital",
    text: "Porcentaje sobre campañas publicitarias aprobadas, según tipo de campaña y condiciones internas.",
  },
];

export default function EarningsSection() {
  return (
    <section id="ingresos" className="bg-white px-5 py-20 text-slate-950 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-cyan-600">Cómo ganas dinero</div>
          <h2 className="text-3xl font-extrabold leading-tight md:text-5xl">Un programa simple, revisado y certificado.</h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">La página pública solo capta solicitudes. La aprobación, capacitación, certificación y pagos se manejan en el aplicativo privado.</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="rounded-[28px] border border-slate-200 bg-slate-50 p-7 shadow-sm">
              <div className="text-4xl font-extrabold text-cyan-600">{item.amount}</div>
              <h3 className="mt-5 text-xl font-extrabold text-slate-950">{item.title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
