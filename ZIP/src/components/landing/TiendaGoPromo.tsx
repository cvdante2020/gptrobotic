import Image from "next/image";

export default function TiendaGoPromo() {
  return (
    <section id="tiendago" className="bg-white px-5 py-20 md:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <div className="mb-5 inline-flex rounded-full border border-yellow-200 bg-yellow-50 px-4 py-2 text-sm font-extrabold text-yellow-700">
            Próximamente · Promoción especial
          </div>

          <h2 className="text-4xl font-extrabold tracking-tight text-slate-950 md:text-6xl">TiendaGo</h2>
          <p className="mt-3 text-2xl font-bold text-emerald-700">Compra. Acumula. Gana.</p>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            TiendaGo no se presenta como producto principal de GPTRobotic todavía. Se muestra como una promoción de lo que estamos construyendo: una plataforma para que los comercios conviertan compradores en clientes frecuentes.
          </p>

          <div className="mt-7 rounded-[28px] border border-emerald-100 bg-emerald-50 p-6">
            <h3 className="text-xl font-extrabold text-slate-950">La fidelización que sí hace volver a comprar.</h3>
            <p className="mt-3 leading-7 text-slate-700">
              Tus clientes acumulan monedas, desbloquean premios, participan en trivias, reciben promociones y siguen su progreso desde el celular.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {["Monedas por compras validadas", "Premios y canjes digitales", "Trivias y referidos", "Precio bomba del día", "Panel administrador", "Campañas para clientes"].map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-white p-4 font-semibold text-slate-700 shadow-sm">
                <span className="mr-2 text-emerald-600">✓</span>
                {item}
              </div>
            ))}
          </div>

          <p className="mt-7 text-xl font-black text-slate-950">No compitas solo por precio. Haz que tus clientes quieran volver.</p>
        </div>

        <div className="rounded-[34px] border border-slate-200 bg-slate-50 p-3 shadow-2xl shadow-slate-200/80">
          <Image
            src="/tiendago-preview.png"
            alt="Vista promocional de TiendaGo con monedas, premios, productos y progreso de compras"
            width={1400}
            height={1000}
            className="h-auto w-full rounded-[28px] object-cover"
            priority={false}
          />
        </div>
      </div>
    </section>
  );
}
