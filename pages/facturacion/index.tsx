import Navbar from "../../src/components/Navbar";
import { useRouter } from "next/router";
import { useState } from "react";

export default function FacturacionLogin() {
  const router = useRouter();
  const [login, setLogin] = useState({ username: "", password: "" });
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const r = await fetch("/api/facturacion/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(login)
      });
      const j = await r.json();
      setLoading(false);

      if (!r.ok) return setErr(j.error || "Error de acceso");
      router.push("/facturacion/panel");
    } catch {
      setLoading(false);
      setErr("No se pudo validar. Intenta de nuevo.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar />

      <section className="py-20 px-6 bg-gradient-to-b from-black to-gray-950 text-white text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-3 text-yellow-400">
          🧾 Facturación Electrónica
        </h1>

        <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-200 mb-8">
          Accede al módulo para <b>Onboarding</b>, emisión <b>online/offline</b> y <b>reportes</b>.
        </p>

        <div className="max-w-md mx-auto mt-6 bg-gray-900 border border-gray-700 rounded-2xl p-6 text-left shadow-2xl">
          <h3 className="text-xl font-bold mb-2">Acceso al módulo</h3>
          <p className="text-sm text-gray-300 mb-5">
            Ingresa tu usuario y clave.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-semibold">Usuario</label>
              <input
                value={login.username}
                onChange={(e) => setLogin((p) => ({ ...p, username: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Clave</label>
              <input
                type="password"
                value={login.password}
                onChange={(e) => setLogin((p) => ({ ...p, password: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-extrabold bg-blue-600 hover:bg-blue-700 transition"
            >
              {loading ? "Validando acceso..." : "INGRESAR"}
            </button>

            {err && <div className="text-red-400 font-bold">{err}</div>}
          </form>
        </div>
      </section>
    </main>
  );
}
