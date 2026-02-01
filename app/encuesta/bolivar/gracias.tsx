"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Gracias() {
  const [seconds, setSeconds] = useState(8);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  // Redirección opcional
  useEffect(() => {
    if (seconds === 0) window.location.href = "/";
  }, [seconds]);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
        <div className="text-5xl mb-3">✅</div>
        <h2 className="text-3xl font-bold mb-3 text-yellow-300">
          ¡Gracias por tu opinión!
        </h2>

        <p className="text-gray-300 mb-6">
          Tu respuesta se registró correctamente. Con tu participación ayudas a entender
          mejor las prioridades reales de Bolívar.
        </p>

        <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 text-sm text-gray-300 mb-6">
          Esta encuesta es anónima y no solicita datos personales.
        </div>

        <Link
          href="/"
          className="inline-block bg-yellow-500 text-gray-900 font-bold px-6 py-3 rounded-lg hover:bg-yellow-400 transition"
        >
          Volver al PATROCINADOR
        </Link>

        <p className="text-xs text-gray-500 mt-4">
          Redirigiendo automáticamente en {seconds}s…
        </p>
      </div>
    </div>
  );
}
