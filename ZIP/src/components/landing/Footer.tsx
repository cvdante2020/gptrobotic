import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#020617] px-5 py-14 text-white md:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
        <div>
          <div className="text-3xl font-extrabold text-white">GPT<span className="text-emerald-400">ROBOTIC</span></div>
          <p className="mt-4 max-w-md leading-7 text-slate-400">
            Software empresarial para clínicas, comercios, procesos de visa y presencia web profesional.
          </p>
        </div>

        <div>
          <h4 className="font-extrabold text-white">Soluciones</h4>
          <div className="mt-4 space-y-3 text-sm text-slate-400">
            <a href="#clinicas" className="block hover:text-emerald-300">Clínicas</a>
            <a href="#facturacion-pos" className="block hover:text-emerald-300">Facturación + POS</a>
            <Link href="/visa" className="block hover:text-emerald-300">Visas</Link>
            <a href="#web" className="block hover:text-emerald-300">Página Web</a>
          </div>
        </div>

        <div>
          <h4 className="font-extrabold text-white">Promoción</h4>
          <div className="mt-4 space-y-3 text-sm text-slate-400">
            <a href="#tiendago" className="block hover:text-emerald-300">TiendaGo</a>
            <span className="block">Compra. Acumula. Gana.</span>
          </div>
        </div>

        <div>
          <h4 className="font-extrabold text-white">Contacto</h4>
          <div className="mt-4 space-y-3 text-sm text-slate-400">
            <a href="mailto:info@gptrobotic.com" className="block hover:text-emerald-300">info@gptrobotic.com</a>
            <a href="https://wa.me/593963203102" target="_blank" rel="noopener noreferrer" className="block hover:text-emerald-300">+593 96 320 3102</a>
            <span className="block">Ecuador</span>
            <span className="block">© 2026 GPT Robotic</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
