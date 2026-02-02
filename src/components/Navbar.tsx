"use client";

import React from "react";
import Link from "next/link";
import { useState } from "react";


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-yellow-400">GPTROBOTIC</Link>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
            ☰
          </button>
        </div>
       <div className="hidden md:flex gap-6 items-center">
  <Link href="/" className="hover:text-yellow-400">Inicio</Link>
  <Link href="/clinicas" className="hover:text-yellow-400">Clínicas</Link>
  <Link href="/autos" className="hover:text-yellow-400">Patios de Autos</Link>

  <Link href="/facturacion" className="text-yellow-300 hover:text-yellow-200">
    Facturación electrónica
  </Link>

 

  <a href="#contacto" className="hover:text-yellow-400">Contacto</a>

  <Link
    href="https://www.facebook.com/gptrobotic"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-blue-400"
  >
    Facebook
  </Link>
</div>

      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-4">
          <Link href="/" className="hover:text-yellow-400" onClick={() => setIsOpen(false)}>Inicio</Link>
          <Link href="/clinicas" className="hover:text-yellow-400" onClick={() => setIsOpen(false)}>Clínicas</Link>
          <Link href="/autos" className="hover:text-yellow-400" onClick={() => setIsOpen(false)}>Patios de Autos</Link>
          <Link href="/facturacion" className="text-yellow-300 hover:text-yellow-200">
          Facturación electrónica
        </Link>
          <a href="#contacto" className="hover:text-yellow-400" onClick={() => setIsOpen(false)}>Contacto</a>
          <Link
          
            href="https://www.facebook.com/gptrobotic"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400"
            onClick={() => setIsOpen(false)}
          >
            Facebook
          </Link>
        </div>
      )}
    </nav>
  );
}
