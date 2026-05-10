import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-[#020617] px-5 py-14 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
        <div>
          <div className="text-3xl font-extrabold text-slate-950">GPT<span className="text-cyan-600">ROBOTIC</span></div>
          <p className="mt-4 max-w-md leading-7 text-slate-500">
            Plataforma de embajadores, automatización, publicidad digital y soluciones SaaS para negocios.
          </p>
        </div>

        <div>
          <h4 className="font-extrabold text-slate-950">Programa</h4>
          <div className="mt-4 space-y-3 text-sm text-slate-500">
            <a href="#registro" className="block hover:text-cyan-600">Aplicar</a>
            <a href="#calculadora" className="block hover:text-cyan-600">Calculadora</a>
            <a href="#como-funciona" className="block hover:text-cyan-600">Cómo funciona</a>
          </div>
        </div>

        <div>
          <h4 className="font-extrabold text-slate-950">Soluciones</h4>
          <div className="mt-4 space-y-3 text-sm text-slate-500">
            <Link href="/clinicas" className="block hover:text-cyan-600">Clínicas</Link>
            <Link href="/autos" className="block hover:text-cyan-600">Autos</Link>
            <Link href="/visa" className="block hover:text-cyan-600">Visa Score</Link>
          </div>
        </div>

        <div>
          <h4 className="font-extrabold text-slate-950">Contacto</h4>
          <div className="mt-4 space-y-3 text-sm text-slate-500">
            <Link href="https://www.facebook.com/gptrobotic" target="_blank" className="block hover:text-cyan-600">Facebook</Link>
            <span className="block">Ecuador</span>
            <span className="block">© 2026 GPT Robotic</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
