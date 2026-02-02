import { useState } from "react";
import { useRouter } from "next/router";

export default function AdminLogin() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    const r = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });
    const j = await r.json();
    if (!j?.ok) return setError(j?.error || "No autorizado");
    router.replace("/admin/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h1 className="text-2xl font-extrabold">Acceso Admin</h1>
        <p className="text-sm text-slate-400">Ingresa el PIN para entrar al dashboard.</p>

        {error && (
          <div className="bg-red-950/40 border border-red-900 text-red-200 rounded-xl p-3 text-sm">
            {error}
          </div>
        )}

        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 outline-none"
          placeholder="PIN"
        />

        <button
          onClick={submit}
          className="w-full bg-yellow-500 text-black font-semibold rounded-lg px-4 py-2 hover:bg-yellow-400"
        >
          Entrar
        </button>
      </div>
    </div>
  );
}
