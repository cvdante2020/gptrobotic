import Navbar from "../../src/components/Navbar";

import Link from "next/link";
import type { GetServerSideProps } from "next";
import { getFeSessionFromReqCookie } from "../../lib/feAuth";
import { useEffect, useState } from "react";

type Business = {
  id: string;
  ruc: string;
  razon_social: string;
  onboarding_status: "DRAFT" | "READY" | "ACTIVE";
  sri_env: "TEST" | "PROD";
};

export default function PanelFE() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  let alive = true;

  (async () => {
    try {
      const r = await fetch("/api/facturacion/business");
      const j = await r.json();

      if (!alive) return;

      setBusiness(j.business || null);
      setLoading(false);
    } catch (e) {
      if (!alive) return;
      console.error("Error cargando business:", e);
      setLoading(false);
    }
  })();

  return () => {
    alive = false;
  };
}, []);


  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar />

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-extrabold text-yellow-400 mb-2">Panel - Facturación Electrónica</h1>

        {loading ? (
          <p className="text-gray-300 mt-6">Cargando...</p>
        ) : !business ? (
          <div className="mt-8 bg-gray-900 border border-gray-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-2">Aún no tienes un negocio registrado</h3>
            <p className="text-gray-300 mb-4">Primero debes dar de alta el RUC y datos de la empresa.</p>
            <Link
              href="/facturacion/onboarding"
              className="inline-block px-6 py-3 rounded-xl font-bold bg-yellow-500 hover:bg-yellow-600 text-black"
            >
              ➕ Crear negocio (Onboarding)
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <div className="text-sm text-gray-400">Negocio</div>
                  <div className="text-xl font-bold">{business.razon_social}</div>
                  <div className="text-gray-300 text-sm">RUC: {business.ruc} • Ambiente: {business.sri_env}</div>
                </div>
                <div className="text-sm">
                  <span className="text-gray-400">Estado onboarding: </span>
                  <span className="font-bold text-yellow-300">{business.onboarding_status}</span>
                </div>
              </div>

              {business.onboarding_status === "DRAFT" && (
                <div className="mt-4">
                  <Link
                    href="/facturacion/onboarding"
                    className="inline-block px-6 py-3 rounded-xl font-bold bg-yellow-500 hover:bg-yellow-600 text-black"
                  >
                    Continuar onboarding
                  </Link>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Link
                href="/facturacion/onboarding"
                className="bg-gray-900 border border-gray-700 rounded-2xl p-6 hover:border-yellow-500 transition"
              >
                <h3 className="text-xl font-bold mb-2">1) Onboarding</h3>
                <p className="text-gray-300 text-sm">RUC, establecimientos, puntos, secuenciales, certificado.</p>
              </Link>

              <Link
                href={business.onboarding_status === "DRAFT" ? "#" : "/facturacion/facturas"}
                className={`bg-gray-900 border rounded-2xl p-6 transition ${
                  business.onboarding_status === "DRAFT"
                    ? "border-gray-800 opacity-40 cursor-not-allowed"
                    : "border-gray-700 hover:border-yellow-500"
                }`}
              >
                <h3 className="text-xl font-bold mb-2">2) Facturación</h3>
                <p className="text-gray-300 text-sm">Emisión online/offline y sincronización.</p>
                {business.onboarding_status === "DRAFT" && (
                  <p className="text-yellow-300 text-xs mt-2">Completa onboarding para habilitar.</p>
                )}
              </Link>

              <Link
                href={business.onboarding_status === "DRAFT" ? "#" : "/facturacion/reportes"}
                className={`bg-gray-900 border rounded-2xl p-6 transition ${
                  business.onboarding_status === "DRAFT"
                    ? "border-gray-800 opacity-40 cursor-not-allowed"
                    : "border-gray-700 hover:border-yellow-500"
                }`}
              >
                <h3 className="text-xl font-bold mb-2">3) Reportes</h3>
                <p className="text-gray-300 text-sm">Consolidado por fecha, zona, local, IVA, etc.</p>
              </Link>
            </div>
          </div>
        )}

        <div className="mt-10">
          <button
            onClick={async () => {
              await fetch("/api/facturacion/logout", { method: "POST" });
              window.location.href = "/facturacion";
            }}
            className="px-6 py-3 rounded-xl font-bold bg-red-600 hover:bg-red-700 transition"
          >
            Cerrar sesión
          </button>
        </div>
      </section>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const sess = getFeSessionFromReqCookie(ctx.req.headers.cookie);
  if (!sess) return { redirect: { destination: "/facturacion", permanent: false } };
  return { props: {} };
};
