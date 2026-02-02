import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookie = req.headers.cookie || "";
  const ok = cookie.includes("admin_auth=1");

  if (!ok) {
    return {
      redirect: {
        destination: "/admin/login",
        permanent: false,
      },
    };
  }

  return { props: {} };
};


/**
 * Dashboard Encuesta - UI Pro
 * Ruta: /admin/dashboard
 *
 * Requiere endpoints:
 *  - /api/reports/forms
 *  - /api/reports/summary?formId=...&from=...&to=...
 *  - /api/reports/vote?formId=...&from=...&to=...
 *  - /api/reports/priorities?formId=...&from=...&to=...
 *  - /api/reports/demographics?formId=...&from=...&to=...
 *  - /api/reports/vote_by_age?formId=...&from=...&to=...
 *
 * .env.local:
 *  NEXT_PUBLIC_REPORT_FORM_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
 */

type Summary = {
  total: number;
  total_valid: number;
  total_duplicates: number;
  avg_duration: number | null;
  p50_duration: number | null;
  p90_duration: number | null;
  with_parish: number;
  with_gender: number;
};

type VoteRow = { vote_choice: string; n: number };
type PriorityRow = { priority: string; n: number };

type FormRow = { id: string; slug: string; title: string; canton: string };

type Demographics = {
  total_valid: number;
  age: { key: string; n: number }[];
  gender: { key: string; n: number }[];
  parish: { key: string; n: number }[];
};

type VoteByAge = {
  votes: string[]; // keys
  series: Array<Record<string, any>>; // {age_range,total,A,B,...}
};

type CandidateMeta = Record<string, { label: string; color: string; sub?: string }>;

const CANDIDATE_META_BOLIVAR: CandidateMeta = {
  A: { label: "A · Marcela Estrada", color: "#2563EB", sub: "MSC · Lista 63" },
  B: { label: "B · Jorge Angulo", color: "#DC2626", sub: "Unidad Popular · 17" },
  C: { label: "C · Pilar Noriega", color: "#38BDF8", sub: "RC · 5" },
  D: { label: "D · Fernando Erazo", color: "#F97316", sub: "Centro Democrático · 1" },
  E: { label: "E · Darío Paspuel", color: "#7C3AED", sub: "ADN · 7" },
  F: { label: "F · Klever Andrade", color: "#22C55E", sub: "Lista 63" },
  blanco: { label: "Voto en blanco", color: "#9CA3AF" },
  nulo: { label: "Voto nulo", color: "#6B7280" },
  no_decidido: { label: "Aún no decide", color: "#EAB308" },
  "(sin_respuesta)": { label: "Sin respuesta", color: "#64748B" },
};

// ⚠️ AQUÍ pones los reales de Quito (no repitas los de Bolívar)
// Cambia nombres/sub/colores según tu encuesta Quito
const CANDIDATE_META_QUITO: CandidateMeta = {
  A: { label: "A · Pabel Muñoz", color: "#2563EB", sub: "..." },
  B: { label: "B · Jorge Angulo", color: "#DC2626", sub: "..." },
  C: { label: "C · Pilar Noriega", color: "#38BDF8", sub: "..." },
  D: { label: "D · Fernando Erazo", color: "#F97316", sub: "..." },
  E: { label: "E · Darío Paspuel", color: "#7C3AED", sub: "..." },
  F: { label: "F · Klever Andrade", color: "#22C55E", sub: "..." },
  blanco: { label: "Voto en blanco", color: "#9CA3AF" },
  nulo: { label: "Voto nulo", color: "#6B7280" },
  no_decidido: { label: "Aún no decide", color: "#EAB308" },
  "(sin_respuesta)": { label: "Sin respuesta", color: "#64748B" },
};

function toISOIfValid(input: string) {
  if (!input) return null;
  const d = new Date(input);
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
}

function formatPct(n: number) {
  if (!isFinite(n)) return "0%";
  return `${(n * 100).toFixed(n < 0.1 ? 1 : 0)}%`;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function safeTitleFromForm(f?: FormRow | null) {
  if (!f) return "Reporte Electoral";
  const canton = f.canton || "Encuesta";
  const year = "2026";
  return `Reporte Electoral · ${canton} ${year}`;
}

const CHART_COLORS = [
  "#EAB308",
  "#60A5FA",
  "#34D399",
  "#F97316",
  "#A78BFA",
  "#F472B6",
  "#22C55E",
  "#94A3B8",
  "#FCA5A5",
  "#38BDF8",
];

export default function Dashboard() {
  const defaultFormId = (process.env.NEXT_PUBLIC_REPORT_FORM_ID as string) || "";

  const [formId, setFormId] = useState(defaultFormId);

  // forms
  const [forms, setForms] = useState<FormRow[]>([]);
  const selectedForm = useMemo(
    () => forms.find((f) => f.id === formId) || null,
    [forms, formId]
  );

  // ✅ ESTE ES EL CAMBIO CLAVE:
  // Elegimos el mapping de candidatos según la encuesta seleccionada
  const CANDIDATE_META: CandidateMeta = useMemo(() => {
    const slug = (selectedForm?.slug || "").toLowerCase();
    const canton = (selectedForm?.canton || "").toLowerCase();
    // decide por slug/canton (ajusta si tus slugs son distintos)
    if (slug.includes("quito") || canton.includes("quito")) return CANDIDATE_META_QUITO;
    if (slug.includes("bolivar") || canton.includes("bolívar") || canton.includes("bolivar"))
      return CANDIDATE_META_BOLIVAR;

    // fallback: por si agregas más ciudades y aún no tienes meta
    return CANDIDATE_META_BOLIVAR;
  }, [selectedForm]);

  // rango fechas
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  // data
  const [summary, setSummary] = useState<Summary | null>(null);
  const [vote, setVote] = useState<VoteRow[]>([]);
  const [priorities, setPriorities] = useState<PriorityRow[]>([]);
  const [demo, setDemo] = useState<Demographics | null>(null);
  const [voteByAge, setVoteByAge] = useState<VoteByAge | null>(null);

  // estados
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // cargar forms
  useEffect(() => {
    fetch("/api/reports/forms")
      .then((r) => r.json())
      .then((j) => {
        if (j?.ok) setForms(j.data || []);
      })
      .catch(() => {});
  }, []);

  // auto leer query param una vez
  useEffect(() => {
    if (typeof window === "undefined") return;
    const u = new URL(window.location.href);
    const qFormId = u.searchParams.get("formId");
    if (qFormId) setFormId(qFormId);
  }, []);

  const qs = useMemo(() => {
    const p = new URLSearchParams();
    if (formId) p.set("formId", formId);
    const isoFrom = toISOIfValid(from);
    const isoTo = toISOIfValid(to);
    if (isoFrom) p.set("from", isoFrom);
    if (isoTo) p.set("to", isoTo);
    return p.toString();
  }, [formId, from, to]);

  async function load() {
    setError("");
    if (!formId) {
      setError(
        "Falta formId. Define NEXT_PUBLIC_REPORT_FORM_ID en .env.local o selecciona una encuesta."
      );
      return;
    }

    setLoading(true);
    try {
      const [s, v, pr, d, vba] = await Promise.all([
        fetch(`/api/reports/summary?${qs}`).then((r) => r.json()),
        fetch(`/api/reports/vote?${qs}`).then((r) => r.json()),
        fetch(`/api/reports/priorities?${qs}`).then((r) => r.json()),
        fetch(`/api/reports/demographics?${qs}`).then((r) => r.json()),
        fetch(`/api/reports/vote_by_age?${qs}`).then((r) => r.json()),
      ]);

      if (!s?.ok) throw new Error(s?.error || "Error summary");
      if (!v?.ok) throw new Error(v?.error || "Error vote");
      if (!pr?.ok) throw new Error(pr?.error || "Error priorities");
      if (!d?.ok) throw new Error(d?.error || "Error demographics");
      if (!vba?.ok) throw new Error(vba?.error || "Error vote_by_age");

      setSummary(s.data || null);
      setVote((v.data || []) as VoteRow[]);
      setPriorities((pr.data || []) as PriorityRow[]);
      setDemo(d.data || null);
      setVoteByAge(vba.data || null);
    } catch (e: any) {
      setError(e?.message || "Error cargando datos");
      setSummary(null);
      setVote([]);
      setPriorities([]);
      setDemo(null);
      setVoteByAge(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (formId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId]);

  const validTotal = summary?.total_valid || 0;

  const voteSorted = useMemo(() => {
    const order = ["A", "B", "C", "D", "E", "F", "no_decidido", "blanco", "nulo", "(sin_respuesta)"];
    const map = new Map(order.map((k, i) => [k, i]));
    return [...vote].sort((a, b) => {
      const ia = map.has(a.vote_choice) ? (map.get(a.vote_choice) as number) : 999;
      const ib = map.has(b.vote_choice) ? (map.get(b.vote_choice) as number) : 999;
      if (ia !== ib) return ia - ib;
      return b.n - a.n;
    });
  }, [vote]);

  const leader = useMemo(() => {
    const onlyCandidates = vote.filter((x) =>
      ["A", "B", "C", "D", "E", "F"].includes(x.vote_choice)
    );
    if (!onlyCandidates.length) return null;
    return [...onlyCandidates].sort((a, b) => b.n - a.n)[0];
  }, [vote]);

  function exportCSV() {
    const lines: string[] = [];
    lines.push("section,key,value");

    if (selectedForm) {
      lines.push(`meta,form_id,${csv(selectedForm.id)}`);
      lines.push(`meta,slug,${csv(selectedForm.slug)}`);
      lines.push(`meta,title,${csv(selectedForm.title)}`);
      lines.push(`meta,canton,${csv(selectedForm.canton)}`);
    }

    if (summary) {
      Object.entries(summary).forEach(([k, v]) => {
        lines.push(`summary,${csv(k)},${csv(String(v ?? ""))}`);
      });
    }

    voteSorted.forEach((r) => lines.push(`vote,${csv(r.vote_choice)},${csv(String(r.n))}`));
    priorities.forEach((r) => lines.push(`priorities,${csv(r.priority)},${csv(String(r.n))}`));

    if (demo) {
      demo.age.forEach((r) => lines.push(`age,${csv(r.key)},${csv(String(r.n))}`));
      demo.gender.forEach((r) => lines.push(`gender,${csv(r.key)},${csv(String(r.n))}`));
      demo.parish.forEach((r) => lines.push(`parish,${csv(r.key)},${csv(String(r.n))}`));
    }

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reporte_${(selectedForm?.canton || "encuesta").toLowerCase()}_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // datos para gráficas
  const agePie = useMemo(() => (demo?.age || []).map((x) => ({ name: x.key, value: x.n })), [demo]);
  const genderPie = useMemo(
    () => (demo?.gender || []).map((x) => ({ name: x.key, value: x.n })),
    [demo]
  );
  const parishBars = useMemo(
    () => (demo?.parish || []).slice(0, 10).map((x) => ({ name: x.key, n: x.n })),
    [demo]
  );

  const voteByAgeKeys = useMemo(() => {
    const base = voteByAge?.votes || [];
    const order = ["A", "B", "C", "D", "E", "F", "no_decidido", "blanco", "nulo", "(sin_respuesta)"];
    const sorted = [...base].sort((a, b) => {
      const ia = order.indexOf(a);
      const ib = order.indexOf(b);
      if (ia === -1 && ib === -1) return a.localeCompare(b);
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
    return sorted;
  }, [voteByAge]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div
        className="pointer-events-none fixed inset-x-0 top-0 h-64 opacity-40"
        style={{
          background:
            "radial-gradient(900px 260px at 20% 0%, rgba(234,179,8,0.30), transparent 60%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-8 space-y-7">
        <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs text-slate-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Panel de reportería · Encuesta ciudadana
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {safeTitleFromForm(selectedForm)}
            </h1>
            <p className="text-sm text-slate-400">
              Agregados + deduplicación · filtros por fecha (no identifica personas)
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:items-end gap-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Encuesta</label>
                <select
                  value={formId}
                  onChange={(e) => setFormId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow-500/60"
                >
                  <option value="">Selecciona…</option>
                  {forms.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.canton} · {f.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Desde</label>
                <input
                  type="datetime-local"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow-500/60"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Hasta</label>
                <input
                  type="datetime-local"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow-500/60"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={load}
                  disabled={loading}
                  className="w-full bg-yellow-500 text-black font-semibold rounded-lg px-4 py-2 text-sm hover:bg-yellow-400 disabled:opacity-60"
                >
                  {loading ? "Cargando..." : "Actualizar"}
                </button>
                <button
                  onClick={exportCSV}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-200 font-semibold rounded-lg px-4 py-2 text-sm hover:border-slate-700"
                >
                  Export
                </button>
              </div>
            </div>
          </div>
        </header>

        {error && (
          <div className="bg-red-950/40 border border-red-900 text-red-200 rounded-xl p-4 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <div
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{
                background:
                  "radial-gradient(800px 220px at 20% 0%, rgba(99,102,241,0.18), transparent 60%)",
              }}
            />
            <div className="relative space-y-2">
              <p className="text-xs text-slate-400">Lectura rápida</p>
              <h2 className="text-lg font-bold">Líder actual (válidas)</h2>
              {!leader ? (
                <p className="text-slate-400 text-sm mt-3">Aún sin datos suficientes.</p>
              ) : (
                <div className="mt-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: CANDIDATE_META[leader.vote_choice]?.color || "#EAB308" }}
                    />
                    <div className="min-w-0">
                      <div className="font-extrabold text-xl">
                        {CANDIDATE_META[leader.vote_choice]?.label || leader.vote_choice}
                      </div>
                      <div className="text-sm text-slate-400">
                        {CANDIDATE_META[leader.vote_choice]?.sub || ""}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-slate-300">
                    <span className="font-semibold">{leader.n}</span> votos ·{" "}
                    <span className="font-semibold">
                      {validTotal ? formatPct(leader.n / validTotal) : "0%"}
                    </span>{" "}
                    del total válido
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <KPI title="Total respuestas" value={summary ? String(summary.total) : "-"} hint="Incluye duplicadas" />
            <KPI
              title="Respuestas válidas"
              value={summary ? String(summary.total_valid) : "-"}
              hint="Captcha + duración"
              accent="yellow"
            />
            <KPI
              title="Duplicadas (fp)"
              value={summary ? String(summary.total_duplicates) : "-"}
              hint="Posible repetición"
              accent="violet"
            />
            <KPI
              title="Duración prom."
              value={summary?.avg_duration ? `${summary.avg_duration.toFixed(1)} s` : "-"}
              hint={`p50 ${summary?.p50_duration ?? "-"}s · p90 ${summary?.p90_duration ?? "-"}s`}
              accent="emerald"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold">Intención de voto</h3>
                <p className="text-sm text-slate-400 mt-1">Primera opción</p>
              </div>
              <Badge text={loading ? "Cargando" : "Actualizado"} />
            </div>

            <div className="mt-5 space-y-4">
              {voteSorted.length === 0 ? (
                <EmptyState title="Sin datos" subtitle="Cuando existan respuestas válidas, aquí verás el ranking." />
              ) : (
                voteSorted.map((row) => {
                  const meta = CANDIDATE_META[row.vote_choice] || { label: row.vote_choice, color: "#EAB308" };
                  const pct = validTotal ? row.n / validTotal : 0;
                  const w = clamp(pct * 100, 0, 100);
                  return (
                    <div key={row.vote_choice} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="h-2.5 w-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: meta.color, boxShadow: `0 0 14px ${meta.color}` }}
                          />
                          <span className="font-semibold truncate">{meta.label}</span>
                          {meta.sub && (
                            <span className="text-xs text-slate-500 truncate hidden sm:inline">· {meta.sub}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400">{formatPct(pct)}</span>
                          <span className="font-bold">{row.n}</span>
                        </div>
                      </div>

                      <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-2.5 rounded-full"
                          style={{
                            width: `${w}%`,
                            background: `linear-gradient(90deg, ${meta.color}, rgba(234,179,8,0.85))`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold">Prioridades ciudadanas</h3>
                <p className="text-sm text-slate-400 mt-1">Conteo de selecciones (Top 3)</p>
              </div>
              <Badge text="Top 10" />
            </div>

            <div className="mt-5">
              {priorities.length === 0 ? (
                <EmptyState title="Sin datos" subtitle="Cuando existan respuestas válidas, aquí verás el ranking." />
              ) : (
                <div className="space-y-3">
                  {priorities.slice(0, 10).map((p, idx) => {
                    const denom = validTotal ? validTotal * 3 : 0;
                    const pct = denom ? p.n / denom : 0;
                    const w = clamp(pct * 100 * 1.6, 0, 100);
                    return (
                      <div key={`${p.priority}-${idx}`} className="flex items-center gap-3">
                        <div className="w-7 text-slate-500 text-sm font-semibold">{idx + 1}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between text-sm">
                            <span className="font-semibold truncate">{p.priority}</span>
                            <span className="text-slate-400">
                              {p.n} · {formatPct(pct)}
                            </span>
                          </div>
                          <div className="mt-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-2 rounded-full bg-yellow-500" style={{ width: `${w}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {priorities.length > 0 && (
              <div className="mt-6 border-t border-slate-800 pt-4 text-sm text-slate-300">
                <span className="text-slate-400">Insight:</span>{" "}
                La prioridad más marcada es{" "}
                <span className="font-semibold text-yellow-300">{priorities[0]?.priority}</span>.
              </div>
            )}
          </section>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold">Distribución por edad</h3>
                <p className="text-sm text-slate-400 mt-1">Solo respuestas válidas</p>
              </div>
              <Badge text={demo ? `${demo.total_valid} válidas` : "—"} />
            </div>

            {!demo || agePie.length === 0 ? (
              <div className="mt-5">
                <EmptyState title="Sin datos" subtitle="Aún no hay datos de edad." />
              </div>
            ) : (
              <div className="h-80 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={agePie} dataKey="value" nameKey="name" outerRadius={105} label>
                      {agePie.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>

          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold">Distribución por género</h3>
                <p className="text-sm text-slate-400 mt-1">Respuestas que reportan género</p>
              </div>
              <Badge text="Pastel" />
            </div>

            {!demo || genderPie.length === 0 ? (
              <div className="mt-5">
                <EmptyState title="Sin datos" subtitle="Aún no hay datos de género." />
              </div>
            ) : (
              <div className="h-80 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={genderPie} dataKey="value" nameKey="name" outerRadius={105} label>
                      {/* ✅ BUG FIX: antes estabas usando agePie.map */}
                      {genderPie.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>

          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold">Top parroquias</h3>
                <p className="text-sm text-slate-400 mt-1">Dónde hay más participación</p>
              </div>
              <Badge text="Barras" />
            </div>

            {!demo || parishBars.length === 0 ? (
              <div className="mt-5">
                <EmptyState title="Sin datos" subtitle="Aún no hay parroquias registradas." />
              </div>
            ) : (
              <div className="h-[360px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={parishBars}>
                                       <defs>
  <linearGradient id="barGold" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stopColor="#FDE68A" stopOpacity={0.95} />
    <stop offset="100%" stopColor="#EAB308" stopOpacity={0.9} />
  </linearGradient>
</defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" interval={0} angle={-20} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip />
 

                    <Bar dataKey="n" fill="#EAB308" />

                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>

          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold">Calidad de muestra</h3>
            <p className="text-sm text-slate-400 mt-1">
              Indicadores de consistencia y cobertura (no identifica personas).
            </p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Metric
                title="Cobertura parroquia"
                value={summary ? formatPct((summary.with_parish || 0) / Math.max(1, summary.total)) : "-"}
                desc="Respuestas con parroquia"
              />
              <Metric
                title="Cobertura género"
                value={summary ? formatPct((summary.with_gender || 0) / Math.max(1, summary.total)) : "-"}
                desc="Respuestas con género"
              />
              <Metric
                title="% válidas"
                value={summary ? formatPct((summary.total_valid || 0) / Math.max(1, summary.total)) : "-"}
                desc="Captcha + duración"
              />
              <Metric
                title="% duplicadas"
                value={summary ? formatPct((summary.total_duplicates || 0) / Math.max(1, summary.total)) : "-"}
                desc="Posible repetición"
              />
            </div>
          </section>
        </div>

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold">Intención de voto por edad</h3>
              <p className="text-sm text-slate-400 mt-1">Barras apiladas (primera opción)</p>
            </div>
            <Badge text="Cruce" />
          </div>

          {!voteByAge || !voteByAge.series?.length ? (
            <div className="mt-5">
              <EmptyState title="Sin datos" subtitle="Aún no hay suficientes respuestas para el cruce." />
            </div>
          ) : (
            <div className="h-[460px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={voteByAge.series}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age_range" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {voteByAgeKeys.map((k) => (
                    <Bar
                      key={k}
                      dataKey={k}
                      stackId="a"
                      name={CANDIDATE_META[k]?.label || k}
                      fill={CANDIDATE_META[k]?.color || "#94A3B8"}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

/* ---------- UI Components ---------- */

function KPI({
  title,
  value,
  hint,
  accent,
}: {
  title: string;
  value: string;
  hint?: string;
  accent?: "yellow" | "violet" | "emerald";
}) {
  const accentStyles =
    accent === "yellow"
      ? "ring-1 ring-yellow-500/20"
      : accent === "violet"
      ? "ring-1 ring-violet-500/20"
      : accent === "emerald"
      ? "ring-1 ring-emerald-500/20"
      : "";

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-2xl p-5 ${accentStyles}`}>
      <p className="text-xs text-slate-400">{title}</p>
      <p className="mt-2 text-3xl font-extrabold tracking-tight">{value}</p>
      {hint && <p className="mt-2 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
      <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
      {text}
    </span>
  );
}

function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="border border-dashed border-slate-700 rounded-xl p-6 text-center">
      <div className="text-sm font-semibold text-slate-200">{title}</div>
      <div className="text-sm text-slate-500 mt-1">{subtitle}</div>
    </div>
  );
}

function Metric({ title, value, desc }: { title: string; value: string; desc: string }) {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
      <div className="text-xs text-slate-400">{title}</div>
      <div className="mt-2 text-xl font-extrabold">{value}</div>
      <div className="mt-1 text-xs text-slate-500">{desc}</div>
    </div>
  );
}

function csv(v: string) {
  const s = String(v ?? "");
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replaceAll('"', '""')}"`;
  }
  return s;
}
