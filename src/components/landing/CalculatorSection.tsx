"use client";

import { useMemo, useState } from "react";

export default function CalculatorSection() {
  const [ventas, setVentas] = useState(8);
  const [pauta, setPauta] = useState(300);
  const [porcentaje, setPorcentaje] = useState(15);

  const result = useMemo(() => {
    const ventaUnica = ventas * 5;
    const publicidad = pauta * (porcentaje / 100);
    return { ventaUnica, publicidad, total: ventaUnica + publicidad };
  }, [ventas, pauta, porcentaje]);

  return (
    <section id="calculadora" className="bg-white px-5 py-20 text-slate-950 md:px-8">
      <div className="mx-auto max-w-6xl rounded-[32px] border border-slate-200 bg-slate-50 p-6 shadow-sm md:p-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <div className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-cyan-600">Calcula tu utilidad</div>
            <h2 className="text-3xl font-extrabold leading-tight md:text-5xl">
              Mira una estimación simple de tus ingresos.
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Esta calculadora es referencial. Las bonificaciones recurrentes se validan dentro del aplicativo privado según clientes aprobados y actividad real.
            </p>

            <div className="mt-8 space-y-6">
              <Range label="Ventas efectivas" value={ventas} min={1} max={50} suffix="ventas" onChange={setVentas} />
              <Range label="Publicidad pautada" value={pauta} min={0} max={3000} prefix="$" suffix="pauta" onChange={setPauta} />
              <Range label="Porcentaje publicidad" value={porcentaje} min={10} max={20} suffix="%" onChange={setPorcentaje} />
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">Estimación</p>
              <div className="mt-3 text-5xl font-extrabold text-slate-950 md:text-6xl">${result.total.toFixed(2)}</div>
              <p className="mt-2 text-sm text-slate-500">pago único + publicidad</p>
            </div>

            <div className="mt-8 space-y-4">
              <Row label="Ventas efectivas" detail="$5 por venta" value={`$${result.ventaUnica.toFixed(2)}`} color="text-cyan-600" />
              <Row label="Publicidad" detail={`${porcentaje}% de pauta`} value={`$${result.publicidad.toFixed(2)}`} color="text-amber-500" />
            </div>

            <div className="mt-6 rounded-2xl bg-emerald-50 p-5 text-sm leading-6 text-emerald-800">
              La bonificación mensual recurrente se calcula y aprueba dentro del sistema privado, después de la certificación.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Range({ label, value, min, max, prefix = "", suffix = "", onChange }: { label: string; value: number; min: number; max: number; prefix?: string; suffix?: string; onChange: (value: number) => void }) {
  return (
    <label className="block">
      <div className="mb-3 flex items-center justify-between gap-4">
        <span className="font-bold text-slate-800">{label}</span>
        <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-cyan-700 shadow-sm">{prefix}{value} {suffix}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} className="w-full accent-cyan-500" />
    </label>
  );
}

function Row({ label, detail, value, color }: { label: string; detail: string; value: string; color: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div>
        <div className="font-bold text-slate-900">{label}</div>
        <div className="text-sm text-slate-500">{detail}</div>
      </div>
      <div className={`text-xl font-extrabold ${color}`}>{value}</div>
    </div>
  );
}
