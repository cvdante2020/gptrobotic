"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Gracias() {
  const [seconds, setSeconds] = useState(8);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (seconds === 0) window.location.href = "/";
  }, [seconds]);

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center relative overflow-hidden">
        
        {/* glow decorativo */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[420px] h-[120px] bg-yellow-500/10 blur-3xl" />
        </div>

        {/* icono */}
        <div className="relative mx-auto mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/10 border border-yellow-400/30">
          <span className="text-3xl text-yellow-400">✓</span>
        </div>

        <h2 className="text-3xl font-bold text-white mb-3">
          Gracias por participar
        </h2>

        <p className="text-gray-300 mb-6 max-w-xl mx-auto">
          Tu respuesta ha sido registrada correctamente.  
          Aportes como el tuyo permiten analizar con mayor precisión
          las prioridades ciudadanas del cantón Bolívar.
        </p>

        <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 text-sm text-gray-300 mb-8 max-w-xl mx-auto">
          🔒 La encuesta es <b>completamente anónima</b>.  
          Los resultados se utilizan únicamente con fines estadísticos y de análisis.
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center bg-yellow-500 text-gray-900 font-bold px-8 py-3 rounded-lg hover:bg-yellow-400 transition"
        >
          Volver al sitio principal
        </Link>

        <p className="text-xs text-gray-500 mt-5">
          Redirección automática en <span className="text-gray-300">{seconds}s</span>
        </p>
      </div>
    </div>
  );
}
