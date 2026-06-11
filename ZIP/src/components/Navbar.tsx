"use client";

import Link from "next/link";
import { useState } from "react";

const menu = [
  { label: "Clínicas", href: "#clinicas" },
  { label: "Facturación + POS", href: "#facturacion-pos" },
  { label: "Visas", href: "#visas" },
  { label: "Desarrollo Web", href: "#web" },
  { label: "TiendaGo", href: "#tiendago" },
];

const whatsappUrl =
  "https://wa.me/593963203102?text=Hola%20GPT%20Robotic%2C%20quiero%20informaci%C3%B3n%20de%20sus%20soluciones%20empresariales.";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 text-slate-950 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-lg font-black text-white">G</span>
          <div className="leading-tight">
            <div className="text-lg font-extrabold tracking-tight">GPT ROBOTIC</div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600">Software empresarial</div>
          </div>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {menu.map((item) => (
            <a key={item.href} href={item.href} className="text-sm font-semibold text-slate-600 transition hover:text-emerald-600">
              {item.label}
            </a>
          ))}
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700">
            WhatsApp
          </a>
        </div>

        <button type="button" onClick={() => setIsOpen((v) => !v)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xl lg:hidden" aria-label="Abrir menú">
          ☰
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-slate-200 bg-white px-5 pb-5 pt-2 lg:hidden">
          <div className="flex flex-col gap-2">
            {menu.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setIsOpen(false)} className="rounded-xl px-3 py-3 font-semibold text-slate-700 hover:bg-slate-50">
                {item.label}
              </a>
            ))}
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)} className="mt-2 rounded-2xl bg-emerald-600 px-5 py-3 text-center font-bold text-white">
              Escribir por WhatsApp
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
