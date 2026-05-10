import Navbar from "../../src/components/Navbar";
import type { GetServerSideProps } from "next";
import { getFeSessionFromReqCookie } from "../../lib/feAuth";


export default function FacturasFE() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar />
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-extrabold text-yellow-400 mb-2">Facturas</h1>
        <p className="text-gray-300">Aquí va el wizard de alta del negocio.</p>
      </section>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const sess = getFeSessionFromReqCookie(ctx.req.headers.cookie);
  if (!sess) return { redirect: { destination: "/facturacion", permanent: false } };
  return { props: {} };
};
