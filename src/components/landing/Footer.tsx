import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-5 py-10 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="font-semibold text-slate-950">GPT Robotic</div>
          <div>Software empresarial accesible para Ecuador y Latinoamérica.</div>
        </div>
        <div className="flex flex-wrap gap-5">
          <Link href="/clinicas" className="hover:text-slate-950">Clinic</Link>
          <Link href="/facturacion" className="hover:text-slate-950">Factura</Link>
          <Link href="/autos" className="hover:text-slate-950">Autos</Link>
          <Link href="/#contacto" className="hover:text-slate-950">Contacto</Link>
        </div>
      </div>
    </footer>
  );
}
