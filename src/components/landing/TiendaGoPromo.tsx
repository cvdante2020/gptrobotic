type Platform = {
  name: string;
  description: string;
  url: string;
};

const platforms: Platform[] = [
  {
    name: "Impulsus Corp",
    description:
      "Plataforma empresarial para automatización comercial, CRM y crecimiento de negocios.",
    url: "https://impulsuscorp.com/",
  },
  {
    name: "Rueda Justa",
    description:
      "Tecnología especializada en valoración vehicular y gestión automotriz.",
    url: "https://ruedajusta.com/",
  },
  {
    name: "Sphaera Club",
    description: "Plataforma para gestión deportiva, competiciones y comunidades.",
    url: "https://sphaera.club/",
  },
  {
    name: "Tienda GO",
    description:
      "Marketplace digital diseñado para impulsar negocios locales y comercio electrónico.",
    url: "https://tiendago.app/",
  },
];

export default function TiendaGoPromo() {
  return (
    <section id="ecosistema" className="bg-white px-5 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <span className="text-sm font-medium tracking-[0.24em] text-violet-600 uppercase">
            Experiencia real
          </span>

          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-slate-950 md:text-6xl">
            Tecnología que ya está generando resultados.
          </h2>

          <p className="mt-6 text-xl leading-8 text-slate-600">
            Las empresas no necesitan más software. Necesitan soluciones que
            funcionen. Estas son algunas de las plataformas impulsadas por
            tecnología GPT Robotic.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {platforms.map((platform) => (
            <a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noreferrer"
              className="group rounded-[32px] border border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <h3 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950">
                {platform.name}
              </h3>

              <p className="mt-4 text-lg leading-8 text-slate-600">
                {platform.description}
              </p>

              <div className="mt-6 text-sm font-medium text-violet-600">
                Visitar plataforma →
              </div>
            </a>
          ))}
        </div>

        <div className="mt-20 grid gap-8 border-t border-slate-200 pt-12 md:grid-cols-3">
          <div>
            <div className="text-5xl font-bold text-slate-950">4+</div>
            <div className="mt-2 text-slate-600">
              Plataformas especializadas
            </div>
          </div>

          <div>
            <div className="text-5xl font-bold text-slate-950">100%</div>
            <div className="mt-2 text-slate-600">Desarrollo propio</div>
          </div>

          <div>
            <div className="text-5xl font-bold text-slate-950">EC</div>
            <div className="mt-2 text-slate-600">
              Tecnología desarrollada en Ecuador
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}