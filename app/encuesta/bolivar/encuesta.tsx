"use client";

import { useMemo, useState } from "react";
import Gracias from "./gracias";

const FORM_SLUG = "bolivar-alcaldia-2026";

const PRIORIDADES = [
  "Seguridad",
  "Empleo / economía local",
  "Vías / obra pública",
  "Agua potable / servicios básicos",
  "Salud",
  "Educación",
  "Transparencia / anticorrupción",
  "Agricultura / producción",
  "Turismo",
  "Otro",
] as const;

type VoteChoice = "A" | "B" | "C" | "D" | "E" | "F" | "blanco" | "nulo" | "no_decidido" | "";

type CandidateOption = {
  code: Exclude<VoteChoice, "" | "blanco" | "nulo" | "no_decidido">;
  name: string;
  movement: string;
  list: string;
  color: string; // hex
};

const CANDIDATES: CandidateOption[] = [
  {
    code: "A",
    name: "Marcela Estrada",
    movement: "Movimiento Social Conservador",
    list: "Lista 63",
    color: "#2563EB", // azul
  },
  {
    code: "B",
    name: "Jorge Angulo",
    movement: "Unidad Popular",
    list: "Lista 17",
    color: "#DC2626", // rojo
  },
  {
    code: "C",
    name: "Pilar Noriega",
    movement: "Revolución Ciudadana",
    list: "Lista 5",
    color: "#38BDF8", // celeste
  },
  {
    code: "D",
    name: "Fernando Erazo",
    movement: "Centro Democrático",
    list: "Lista 1",
    color: "#F97316", // tomate (orange)
  },
  {
    code: "E",
    name: "Darío Paspuel",
    movement: "ADN",
    list: "Lista 7",
    color: "#7C3AED", // morado
  },
  {
    code: "F",
    name: "Klever Andrade",
    movement: "Lista 63",
    list: "Lista 63",
    color: "#2563EB", // azul igual que A
  },
];

const EXTRA_CHOICES: { code: Exclude<VoteChoice, "A" | "B" | "C" | "D" | "E" | "F">; label: string }[] = [
  { code: "blanco", label: "Voto en blanco" },
  { code: "nulo", label: "Voto nulo" },
  { code: "no_decidido", label: "Aún no decido" },
];

function CandidateCard({
  selected,
  onClick,
  name,
  movement,
  list,
  color,
}: {
  selected: boolean;
  onClick: () => void;
  name: string;
  movement: string;
  list: string;
  color: string; // hex
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group relative w-full text-left rounded-xl border transition",
        "bg-gradient-to-b from-[#0b1220] to-[#070b13]",
        selected
          ? "border-yellow-400 ring-2 ring-yellow-500/25"
          : "border-gray-800 hover:border-gray-700",
        "p-4 sm:p-5",
        "hover:-translate-y-0.5 active:translate-y-0",
      ].join(" ")}
    >
      {/* brillo suave arriba */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition"
        style={{
          background:
            "radial-gradient(800px 200px at 20% 0%, rgba(255,255,255,0.10), transparent 60%)",
        }}
      />

      {/* neón inferior */}
      <div
        className={[
          "pointer-events-none absolute left-3 right-3 bottom-2 h-[3px] rounded-full",
          "opacity-70 group-hover:opacity-100 transition",
        ].join(" ")}
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          boxShadow: `0 0 12px ${color}`,
        }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {/* punto color */}
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
              aria-hidden="true"
            />

            <h4 className="text-base sm:text-lg font-semibold text-white truncate">
              {name}
            </h4>
          </div>

          <p className="text-sm text-gray-300 mt-1 leading-snug">
            {movement}
          </p>
        </div>

        {/* chip lista */}
        <span
          className="shrink-0 text-xs font-semibold px-3 py-1 rounded-full border"
          style={{
            borderColor: color,
            color,
            backgroundColor: "rgba(0,0,0,0.2)",
          }}
        >
          {list}
        </span>
      </div>

      {/* “selected” label */}
      {selected && (
        <div className="relative mt-3 text-xs text-yellow-300 font-semibold">
          Seleccionado
        </div>
      )}
    </button>
  );
}

function SimpleChoiceCard({
  selected,
  onClick,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
}) {
  const neutral = "#9CA3AF"; // gris

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group relative w-full text-left rounded-xl border transition",
        "bg-gradient-to-b from-[#0b1220] to-[#070b13]",
        selected
          ? "border-yellow-400 ring-2 ring-yellow-500/25"
          : "border-gray-800 hover:border-gray-700",
        "p-4 sm:p-5",
        "hover:-translate-y-0.5 active:translate-y-0",
      ].join(" ")}
    >
      <div
        className="pointer-events-none absolute left-3 right-3 bottom-2 h-[3px] rounded-full opacity-70 group-hover:opacity-100 transition"
        style={{
          background: `linear-gradient(90deg, transparent, ${neutral}, transparent)`,
          boxShadow: `0 0 10px ${neutral}`,
        }}
      />

      <div className="relative">
        <div className="text-base sm:text-lg font-semibold text-white">
          {label}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Opción general
        </div>

        {selected && (
          <div className="mt-3 text-xs text-yellow-300 font-semibold">
            Seleccionado
          </div>
        )}
      </div>
    </button>
  );
}


export default function EncuestaBolivar() {
  const [step, setStep] = useState(0); // 0..4
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [startedAt] = useState<number>(() => Date.now());

  // Paso 0: Consentimiento
  const [consent, setConsent] = useState<"si" | "no" | "">("");

  // Paso 1: Contexto
  const [parish, setParish] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [gender, setGender] = useState("");

  // Paso 2: Intención
  const [choice, setChoice] = useState<VoteChoice>("");
  const [secondChoice, setSecondChoice] = useState<VoteChoice>("");

  // Paso 3: Prioridades
  const [prioridades, setPrioridades] = useState<string[]>([]);
  const [otroPrioridad, setOtroPrioridad] = useState("");
  const [problema, setProblema] = useState("");

  // Paso 4: Captcha simple
  const [captchaText, setCaptchaText] = useState("");

  const totalSteps = 5; // 0..4
  const progress = useMemo(() => Math.min(100, Math.round(((step + 1) / totalSteps) * 100)), [step]);

  function togglePrioridad(p: string) {
    setErrorMsg("");
    setPrioridades((prev) => {
      const exists = prev.includes(p);
      if (exists) return prev.filter((x) => x !== p);
      if (prev.length >= 3) return prev;
      return [...prev, p];
    });
  }

  function next() {
    setErrorMsg("");

    if (step === 0) {
      if (consent !== "si") return setErrorMsg("Para continuar debes aceptar participar.");
    }

    if (step === 1) {
      if (!ageRange) return setErrorMsg("Selecciona tu rango de edad.");
    }

    if (step === 2) {
      if (!choice) return setErrorMsg("Selecciona una opción.");
      if (secondChoice && secondChoice === choice)
        return setErrorMsg("La segunda opción no puede ser igual a la primera.");
    }

    if (step === 3) {
      if (prioridades.length !== 3) return setErrorMsg("Selecciona exactamente 3 prioridades.");
      if (prioridades.includes("Otro") && !otroPrioridad.trim())
        return setErrorMsg("Especifica tu prioridad en 'Otro'.");
      if (!problema.trim()) return setErrorMsg("Cuéntanos el principal problema (texto corto).");
    }

    setStep((s) => Math.min(s + 1, 4));
  }

  function back() {
    setErrorMsg("");
    setStep((s) => Math.max(s - 1, 0));
  }

  async function submit() {
    setErrorMsg("");

    const normalized = captchaText.trim().toLowerCase();
    if (normalized !== "bolivar" && normalized !== "bolívar") {
      return setErrorMsg("Captcha incorrecto. Escribe la palabra BOLIVAR para enviar.");
    }

    const durationSeconds = Math.round((Date.now() - startedAt) / 1000);
    if (durationSeconds < 12) {
      return setErrorMsg("Muy rápido. Revisa tus respuestas y vuelve a intentar.");
    }

    setLoading(true);
    try {
      const payload = {
        form_slug: FORM_SLUG,
        parish: parish || null,
        age_range: ageRange,
        gender: gender || null,

        // no se usan en esta versión
        vote_intent: null,
        certainty: null,

        answers: {
          consent: true,
          vote_choice: choice,
          second_choice: secondChoice || "ninguna",

          priorities_top3: prioridades,
          priority_other: prioridades.includes("Otro") ? otroPrioridad : null,
          main_problem: problema,

          captcha_passed: true,
          duration_seconds: durationSeconds,
        },
      };

      const r = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await r.json();
      if (!data?.ok) {
        setErrorMsg(data?.error || "No se pudo guardar");
        setLoading(false);
        return;
      }

      setDone(true);
    } catch {
      setErrorMsg("Error de red");
    } finally {
      setLoading(false);
    }
  }

  if (done) return <Gracias />;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-300">Progreso</div>
        <div className="text-sm text-gray-400">{progress}%</div>
      </div>

      <div className="w-full bg-gray-800 rounded-full h-2">
        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${progress}%` }} />
      </div>

      {errorMsg && (
        <div className="bg-red-950 border border-red-800 text-red-200 rounded-lg p-3 text-sm">
          {errorMsg}
        </div>
      )}

      {/* STEP 0 */}
      {step === 0 && (
       <section className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">

          <h3 className="text-lg font-semibold">Consentimiento</h3>

          <p className="text-gray-300 text-sm">
            Encuesta anónima, sin datos personales. Uso estadístico.
          </p>

         <div className="flex gap-6 mb-4">

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="consent"
                value="si"
                checked={consent === "si"}
                onChange={() => setConsent("si")}
              />
              <span>Sí, acepto</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="consent"
                value="no"
                checked={consent === "no"}
                onChange={() => setConsent("no")}
              />
              <span>No</span>
            </label>
          </div>
        </section>
      )}

      {/* STEP 1 */}
      {step === 1 && (
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
          <h3 className="text-lg font-semibold">Contexto</h3>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Parroquia (opcional)</label>
            <input
              value={parish}
              onChange={(e) => setParish(e.target.value)}
              className="w-full bg-gray-950 border border-gray-700 rounded p-2"
              placeholder="Ej: Bolívar (cabecera), etc."
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Rango de edad</label>
            <select
              value={ageRange}
              onChange={(e) => setAgeRange(e.target.value)}
              className="w-full bg-gray-950 border border-gray-700 rounded p-2"
            >
              <option value="">Selecciona</option>
              <option value="16-17">16–17</option>
              <option value="18-24">18–24</option>
              <option value="25-34">25–34</option>
              <option value="35-44">35–44</option>
              <option value="45-54">45–54</option>
              <option value="55-64">55–64</option>
              <option value="65+">65+</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Género (opcional)</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full bg-gray-950 border border-gray-700 rounded p-2"
            >
              <option value="">Prefiero no decir</option>
              <option value="mujer">Mujer</option>
              <option value="hombre">Hombre</option>
              <option value="otro">Otro</option>
            </select>
          </div>
        </section>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-5">
          <div>
            <h3 className="text-lg font-semibold">Intención de voto</h3>
            <p className="text-sm text-gray-300 mt-1">
              Si las elecciones fueran este domingo, ¿por quién votarías?
            </p>
          </div>

          <div className="space-y-2">
            {CANDIDATES.map((c) => (
              <CandidateCard
                key={c.code}
                selected={choice === c.code}
                onClick={() => {
                  setChoice(c.code);
                  setErrorMsg("");
                  if (secondChoice === c.code) setSecondChoice("");
                }}
                name={`${c.code}. ${c.name}`}
                movement={c.movement}
                list={c.list}
                color={c.color}
              />
            ))}

            {EXTRA_CHOICES.map((x) => (
              <SimpleChoiceCard
                key={x.code}
                selected={choice === x.code}
                onClick={() => {
                  setChoice(x.code);
                  setErrorMsg("");
                  if (secondChoice === x.code) setSecondChoice("");
                }}
                label={x.label}
              />
            ))}
          </div>

          <div className="pt-2 border-t border-gray-800">
            <p className="text-sm text-gray-300 mb-2">
              Tu segunda opción , tu <b>segunda opción</b> sería (opcional):
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setSecondChoice("")}
                className={[
                  "w-full text-left rounded-xl border p-4 transition bg-gray-950",
                  secondChoice === "" ? "border-yellow-400 ring-2 ring-yellow-500/30" : "border-gray-800 hover:border-gray-700",
                ].join(" ")}
              >
                <div className="text-sm font-semibold text-white">Ninguna / no aplica</div>
                <div className="text-xs text-gray-400 mt-1">Dejar en blanco</div>
              </button>

              {CANDIDATES.map((c) => (
                <CandidateCard
                  key={`second-${c.code}`}
                  selected={secondChoice === c.code}
                  onClick={() => {
                    if (choice === c.code) {
                      setErrorMsg("La segunda opción no puede ser igual a la primera.");
                      return;
                    }
                    setSecondChoice(c.code);
                    setErrorMsg("");
                  }}
                  name={`${c.code}. ${c.name}`}
                  movement={c.movement}
                  list={c.list}
                  color={c.color}
                />
              ))}

              {EXTRA_CHOICES.map((x) => (
                <SimpleChoiceCard
                  key={`second-${x.code}`}
                  selected={secondChoice === x.code}
                  onClick={() => {
                    if (choice === x.code) {
                      setErrorMsg("La segunda opción no puede ser igual a la primera.");
                      return;
                    }
                    setSecondChoice(x.code);
                    setErrorMsg("");
                  }}
                  label={x.label}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
          <h3 className="text-lg font-semibold">Prioridades para Bolívar</h3>
          <p className="text-sm text-gray-300">Elige exactamente 3 prioridades:</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRIORIDADES.map((p) => {
              const active = prioridades.includes(p);
              const disabled = !active && prioridades.length >= 3;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => !disabled && togglePrioridad(p)}
                  className={[
                    "text-left px-3 py-2 rounded border",
                    active ? "bg-yellow-500 text-gray-900 border-yellow-400" : "bg-gray-950 border-gray-700 text-gray-200",
                    disabled ? "opacity-50 cursor-not-allowed" : "hover:border-gray-500",
                  ].join(" ")}
                >
                  {p}
                </button>
              );
            })}
          </div>

          {prioridades.includes("Otro") && (
            <div>
              <label className="block text-sm text-gray-300 mb-1">¿Cuál?</label>
              <input
                value={otroPrioridad}
                onChange={(e) => setOtroPrioridad(e.target.value)}
                className="w-full bg-gray-950 border border-gray-700 rounded p-2"
                placeholder="Especifica"
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-300 mb-1">¿Qué problema te afecta más?</label>
            <input
              value={problema}
              onChange={(e) => setProblema(e.target.value)}
              className="w-full bg-gray-950 border border-gray-700 rounded p-2"
              placeholder="Texto corto"
            />
          </div>
        </section>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
          <h3 className="text-lg font-semibold">Confirmación final</h3>

          <div className="bg-gray-950 border border-gray-800 rounded-lg p-3">
            <p className="text-sm text-gray-300">Para evitar respuestas automáticas, escribe la palabra:</p>
            <p className="text-sm text-yellow-300 font-semibold mt-1">BOLIVAR</p>
          </div>

          <input
            value={captchaText}
            onChange={(e) => {
              setCaptchaText(e.target.value);
              setErrorMsg("");
            }}
            className="w-full bg-gray-950 border border-gray-700 rounded p-2"
            placeholder="Escribe BOLIVAR"
          />

          <button
            type="button"
            onClick={submit}
            disabled={loading}
            className="w-full bg-yellow-500 text-gray-900 font-bold py-2 rounded hover:bg-yellow-400 disabled:opacity-60"
          >
            {loading ? "Guardando..." : "Enviar encuesta"}
          </button>

          <p className="text-xs text-gray-500">No se solicitan datos personales. Resultados solo estadísticos.</p>
        </section>
      )}

      {/* Navegación */}
      {/* Botones navegación */}
<div className="flex gap-3 mt-8 pt-6 border-t border-gray-800">

        {step > 0 && (
          <button
            type="button"
            onClick={back}
            className="flex-1 bg-gray-800 border border-gray-700 text-gray-200 py-2 rounded hover:border-gray-500"
          >
            Atrás
          </button>
        )}

        {step < 4 && (
          <button
            type="button"
            onClick={next}
            className="flex-1 bg-yellow-500 text-gray-900 font-bold py-2 rounded hover:bg-yellow-400"
          >
            Continuar
          </button>
        )}
      </div>
    </div>
  );
}
