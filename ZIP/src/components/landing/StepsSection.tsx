const steps = [
  ["01", "Aplica", "Completa tu solicitud como embajador o anunciante desde esta página pública."],
  ["02", "Revisión", "Revisamos tus datos y te contactamos por correo durante las próximas 24 horas laborables."],
  ["03", "Capacitación", "Si eres aprobado, recibirás instrucciones para entrar al sistema privado."],
  ["04", "Certificación", "Aprendes la plataforma y rindes una prueba interna antes de vender."],
  ["05", "Ventas", "Gestionas oportunidades, publicidad y comisiones desde el aplicativo privado."],
];

export default function StepsSection() {
  return (
    <section id="como-funciona" className="bg-slate-50 px-5 py-20 text-slate-950 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl">
          <div className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-emerald-600">Proceso seguro</div>
          <h2 className="text-3xl font-extrabold leading-tight md:text-5xl">Primero aplicas. Luego revisamos y aprobamos.</h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">La capacitación, prueba, certificación y ventas no viven en esta página pública; todo eso se maneja en el aplicativo privado.</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-5">
          {steps.map(([number, title, text]) => (
            <div key={number} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-3xl font-extrabold text-cyan-600">{number}</div>
              <h3 className="mt-5 text-lg font-bold text-slate-950">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
