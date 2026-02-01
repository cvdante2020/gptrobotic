import Navbar from "../../src/components/Navbar";
import type { GetServerSideProps } from "next";
import { getFeSessionFromReqCookie } from "../../lib/feAuth";
import { useEffect, useState } from "react";

type Business = {
  id: string;
  ruc: string;
  razon_social: string;
  nombre_comercial?: string;
  email?: string;
  telefono?: string;
  direccion_matriz?: string;
  onboarding_status: "DRAFT" | "READY" | "ACTIVE";
  sri_env: "TEST" | "PROD";
};

type Branch = {
  id: string;
  code: string;
  nombre: string;
  direccion?: string;
  ciudad?: string;
};

type Point = {
  id: string;
  code: string;
  nombre: string;
  branch_id: string;
};

export default function Onboarding() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  // Crear negocio
  const [savingBiz, setSavingBiz] = useState(false);
  const [bizErr, setBizErr] = useState<string | null>(null);
  const [bizForm, setBizForm] = useState({
    ruc: "",
    razon_social: "",
    nombre_comercial: "",
    email: "",
    telefono: "",
    direccion_matriz: ""
  });

  // Paso 2-3
  const [branches, setBranches] = useState<Branch[]>([]);
  const [points, setPoints] = useState<Point[]>([]);
  const [selBranch, setSelBranch] = useState<string>("");

  const [bForm, setBForm] = useState({ code: "001", nombre: "Matriz", direccion: "", ciudad: "" });
  const [pForm, setPForm] = useState({ code: "001", nombre: "Caja 1" });

  const [bErr, setBErr] = useState<string | null>(null);
  const [pErr, setPErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const r = await fetch("/api/facturacion/business");
        const j = await r.json();
        if (!alive) return;
        setBusiness(j.business || null);
      } catch (e) {
        console.error("Error cargando business:", e);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  // Cargar establecimientos cuando ya hay negocio
  useEffect(() => {
    if (!business) return;
    let alive = true;

    (async () => {
      try {
        const r = await fetch("/api/facturacion/onboarding/branches");
        const j = await r.json();
        if (!alive) return;
        setBranches(j.branches || []);
        // si hay al menos 1, selecciona el primero para cargar puntos
        if ((j.branches || []).length > 0) {
          setSelBranch((prev) => prev || j.branches[0].id);
        }
      } catch (e) {
        console.error("Error cargando branches:", e);
      }
    })();

    return () => {
      alive = false;
    };
  }, [business]);

  // Cargar puntos cuando se selecciona establecimiento
  useEffect(() => {
    if (!selBranch) {
      setPoints([]);
      return;
    }
    let alive = true;

    (async () => {
      try {
        const r = await fetch(`/api/facturacion/onboarding/points?branch_id=${encodeURIComponent(selBranch)}`);
        const j = await r.json();
        if (!alive) return;
        setPoints(j.points || []);
      } catch (e) {
        console.error("Error cargando points:", e);
      }
    })();

    return () => {
      alive = false;
    };
  }, [selBranch]);

  const submitBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setBizErr(null);
    setSavingBiz(true);

    try {
      const r = await fetch("/api/facturacion/business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bizForm)
      });
      const j = await r.json();
      setSavingBiz(false);

      if (!r.ok) return setBizErr(j.error || "No se pudo crear el negocio");
      setBusiness(j.business);
      window.location.href = "/facturacion/panel";
    } catch {
      setSavingBiz(false);
      setBizErr("Error de red. Intenta de nuevo.");
    }
  };

  const createBranch = async () => {
    setBErr(null);
    try {
      const r = await fetch("/api/facturacion/onboarding/branches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bForm)
      });
      const j = await r.json();
      if (!r.ok) return setBErr(j.error || "Error creando establecimiento");

      setBranches((prev) => [...prev, j.branch]);
      setSelBranch(j.branch.id);
    } catch {
      setBErr("Error de red creando establecimiento.");
    }
  };

  const createPoint = async () => {
    if (!selBranch) return;
    setPErr(null);
    try {
      const payload = { ...pForm, branch_id: selBranch };
      const r = await fetch("/api/facturacion/onboarding/points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const j = await r.json();
      if (!r.ok) return setPErr(j.error || "Error creando punto");

      setPoints((prev) => [...prev, j.point]);
    } catch {
      setPErr("Error de red creando punto.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar />

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-extrabold text-yellow-400 mb-2">Onboarding</h1>
        <p className="text-gray-300 mb-8">Configura el negocio y deja lista la emisión.</p>

        {loading ? (
          <p className="text-gray-300">Cargando...</p>
        ) : !business ? (
          // ✅ Caso 1: NO existe negocio → crear negocio
          <form onSubmit={submitBusiness} className="bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-4">
            <h3 className="text-xl font-bold">Paso 1: Alta del negocio (RUC)</h3>

            <div>
              <label className="text-sm font-semibold">RUC (13 dígitos)</label>
              <input
                value={bizForm.ruc}
                onChange={(e) => setBizForm((p) => ({ ...p, ruc: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded"
                required
                maxLength={13}
                inputMode="numeric"
                pattern="^[0-9]{13}$"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Razón social</label>
              <input
                value={bizForm.razon_social}
                onChange={(e) => setBizForm((p) => ({ ...p, razon_social: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded"
                required
                maxLength={180}
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Nombre comercial (opcional)</label>
              <input
                value={bizForm.nombre_comercial}
                onChange={(e) => setBizForm((p) => ({ ...p, nombre_comercial: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded"
                maxLength={180}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold">Email (opcional)</label>
                <input
                  type="email"
                  value={bizForm.email}
                  onChange={(e) => setBizForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded"
                  maxLength={180}
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Teléfono (opcional)</label>
                <input
                  value={bizForm.telefono}
                  onChange={(e) => setBizForm((p) => ({ ...p, telefono: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded"
                  maxLength={30}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold">Dirección matriz (opcional)</label>
              <input
                value={bizForm.direccion_matriz}
                onChange={(e) => setBizForm((p) => ({ ...p, direccion_matriz: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded"
                maxLength={220}
              />
            </div>

            <button
              type="submit"
              disabled={savingBiz}
              className="w-full py-3 rounded-lg font-extrabold bg-blue-600 hover:bg-blue-700 transition"
            >
              {savingBiz ? "Guardando..." : "CREAR NEGOCIO"}
            </button>

            {bizErr && <div className="text-red-400 font-bold">{bizErr}</div>}
          </form>
        ) : (
          // ✅ Caso 2: Ya existe negocio → mostrar pasos 2 y 3
          <div className="grid gap-6">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-2">Negocio</h3>
              <p className="text-gray-300">
                <b>{business.razon_social}</b> • RUC {business.ruc}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Estado: {business.onboarding_status} • Ambiente SRI: {business.sri_env}
              </p>
            </div>

            {/* Paso 2 */}
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-3">Paso 2: Establecimientos</h3>

              <div className="grid md:grid-cols-4 gap-3">
                <input
                  className="px-3 py-2 rounded bg-gray-800 border border-gray-700"
                  value={bForm.code}
                  onChange={(e) => setBForm((p) => ({ ...p, code: e.target.value }))}
                  placeholder="001"
                />
                <input
                  className="px-3 py-2 rounded bg-gray-800 border border-gray-700 md:col-span-3"
                  value={bForm.nombre}
                  onChange={(e) => setBForm((p) => ({ ...p, nombre: e.target.value }))}
                  placeholder="Nombre (Matriz)"
                />
                <input
                  className="px-3 py-2 rounded bg-gray-800 border border-gray-700 md:col-span-3"
                  value={bForm.direccion}
                  onChange={(e) => setBForm((p) => ({ ...p, direccion: e.target.value }))}
                  placeholder="Dirección"
                />
                <input
                  className="px-3 py-2 rounded bg-gray-800 border border-gray-700"
                  value={bForm.ciudad}
                  onChange={(e) => setBForm((p) => ({ ...p, ciudad: e.target.value }))}
                  placeholder="Ciudad"
                />
              </div>

              <button
                type="button"
                onClick={createBranch}
                className="mt-4 px-5 py-3 rounded-xl font-bold bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                Guardar establecimiento
              </button>

              {bErr && <div className="text-red-400 font-bold mt-3">{bErr}</div>}

              <div className="mt-4 text-sm text-gray-300">
                <b>Existentes:</b>{" "}
                {branches.length === 0 ? "Ninguno" : branches.map((b) => `${b.code}-${b.nombre}`).join(" • ")}
              </div>
            </div>

            {/* Paso 3 */}
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-3">Paso 3: Puntos de emisión</h3>

              <div className="mb-3">
                <label className="text-sm text-gray-300">Selecciona establecimiento</label>
                <select
                  className="w-full mt-1 px-3 py-2 rounded bg-gray-800 border border-gray-700"
                  value={selBranch}
                  onChange={(e) => setSelBranch(e.target.value)}
                >
                  <option value="">-- Seleccionar --</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.code} - {b.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid md:grid-cols-4 gap-3">
                <input
                  className="px-3 py-2 rounded bg-gray-800 border border-gray-700"
                  value={pForm.code}
                  onChange={(e) => setPForm((p) => ({ ...p, code: e.target.value }))}
                  placeholder="001"
                />
                <input
                  className="px-3 py-2 rounded bg-gray-800 border border-gray-700 md:col-span-3"
                  value={pForm.nombre}
                  onChange={(e) => setPForm((p) => ({ ...p, nombre: e.target.value }))}
                  placeholder="Nombre (Caja 1)"
                />
              </div>

              <button
                type="button"
                disabled={!selBranch}
                onClick={createPoint}
                className={`mt-4 px-5 py-3 rounded-xl font-bold transition ${
                  !selBranch ? "bg-gray-700 text-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                Guardar punto
              </button>
                <button
  type="button"
  onClick={async () => {
    const r = await fetch("/api/facturacion/onboarding/ready", { method: "POST" });
    const j = await r.json();
    if (!r.ok) return alert(j.error || "No se pudo finalizar onboarding");
    alert("✅ Onboarding listo. Ya puedes facturar.");
    window.location.href = "/facturacion/panel";
  }}
  className="mt-6 w-full py-3 rounded-xl font-extrabold bg-green-600 hover:bg-green-700 transition"
>
  ✅ Finalizar onboarding y habilitar facturación
</button>

              {pErr && <div className="text-red-400 font-bold mt-3">{pErr}</div>}

              <div className="mt-4 text-sm text-gray-300">
                <b>Puntos:</b>{" "}
                {points.length === 0 ? "Ninguno" : points.map((p) => `${p.code}-${p.nombre}`).join(" • ")}
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => (window.location.href = "/facturacion/panel")}
                  className="px-5 py-3 rounded-xl font-bold bg-gray-800 border border-gray-700 hover:border-yellow-500 transition"
                >
                  Volver al panel
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const sess = getFeSessionFromReqCookie(ctx.req.headers.cookie);
  if (!sess) return { redirect: { destination: "/facturacion", permanent: false } };
  return { props: {} };
};
