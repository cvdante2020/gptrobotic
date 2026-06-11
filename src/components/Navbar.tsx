"use client";

import Link from "next/link";
import { useState } from "react";

const menu = [
  { label: "Clinic", href: "/clinicas" },
  { label: "Factura", href: "/facturacion" },
  { label: "Web", href: "/#web" },
  { label: "Ecosistema", href: "/#ecosistema" },
  { label: "Contacto", href: "/#contacto" },
];

const whatsappUrl =
  "https://wa.me/593998260550?text=Hola%20GPT%20Robotic%2C%20quiero%20informaci%C3%B3n%20sobre%20sus%20sistemas.";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/70 bg-white/80 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold tracking-tight text-white shadow-sm">GP</span>
          <div className="leading-tight">
            <div className="text-[15px] font-semibold tracking-[-0.02em] text-slate-950">GPT Robotic</div>
            <div className="text-[11px] tracking-[0.22em] text-slate-500 uppercase">Business systems</div>
          </div>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {menu.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-slate-600 transition hover:text-slate-950">
              {item.label}
            </Link>
          ))}
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-950 shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:border-slate-300">
            Hablar ahora
          </a>
        </div>

        <button type="button" onClick={() => setIsOpen((v) => !v)} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-slate-700 lg:hidden" aria-label="Abrir menú">
          ☰
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-slate-100 bg-white px-5 pb-5 pt-2 lg:hidden">
          <div className="flex flex-col gap-2">
            {menu.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)} className="rounded-2xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
                {item.label}
              </Link>
            ))}
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)} className="mt-2 rounded-full bg-slate-950 px-5 py-3 text-center text-sm font-medium text-white">
              Escribir por WhatsApp
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
