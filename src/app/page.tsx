"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, CheckCircle2, Send, Sparkles } from "lucide-react";
import { TableSelector, type AvailabilityMode } from "@/components/table-selector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ClubTable, floorLabel } from "@/lib/tables";

type Screen = "selector" | "review" | "sent";

const MONTERREY_TIME_ZONE = "America/Monterrey";

const dateLabel = new Intl.DateTimeFormat("es-MX", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: MONTERREY_TIME_ZONE,
});

function monterreyDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: MONTERREY_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function nextFridayFrom(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const cursor = new Date(Date.UTC(year, month - 1, day));
  const daysUntilFriday = (5 - cursor.getUTCDay() + 7) % 7;
  cursor.setUTCDate(cursor.getUTCDate() + daysUntilFriday);
  return cursor.toISOString().slice(0, 10);
}

export default function Home() {
  const [minDate] = useState(monterreyDateKey);
  const [date, setDate] = useState(() => nextFridayFrom(monterreyDateKey()));
  const [time, setTime] = useState("22:30");
  const [people, setPeople] = useState(4);
  const [mode, setMode] = useState<AvailabilityMode>("normal");
  const [selected, setSelected] = useState<ClubTable>();
  const [screen, setScreen] = useState<Screen>("selector");

  useEffect(() => {
    try {
      window.sessionStorage.setItem("equis-table-demo", JSON.stringify({ date, time, people }));
    } catch {}
  }, [date, time, people]);

  function continueToReview(table: ClubTable) {
    setSelected(table);
    setScreen("review");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="min-h-screen bg-[#07090e] pb-8 text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(34,211,238,.09),transparent_25%),radial-gradient(circle_at_88%_16%,rgba(139,92,246,.1),transparent_28%)]" />
      <div className="relative mx-auto w-full max-w-7xl px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-400/10 font-black italic text-cyan-200 shadow-[0_0_24px_rgba(34,211,238,.2)]">X</div>
            <div><p className="font-black uppercase tracking-[0.22em] text-white">Equis</p><p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">Discoteca</p></div>
          </div>
          <Badge className="border-cyan-400/20 text-cyan-100"><Sparkles aria-hidden="true" className="mr-1.5 size-3" /> Prototipo funcional</Badge>
        </header>

        {screen === "selector" && (
          <>
            <Card className="mb-5 overflow-hidden border-white/12 bg-[#10131b]">
              <CardHeader className="border-b border-white/8 pb-4">
                <div className="flex items-center gap-2 text-sm font-bold text-white"><CalendarDays aria-hidden="true" className="size-4 text-cyan-300" /> Datos para probar la disponibilidad</div>
              </CardHeader>
              <CardContent className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
                <label className="grid gap-1.5 text-xs font-semibold text-slate-400">Fecha<input type="date" value={date} min={minDate} onChange={(event) => setDate(event.target.value)} className="min-h-11 rounded-xl border border-white/12 bg-[#080a10] px-3 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300" /></label>
                <label className="grid gap-1.5 text-xs font-semibold text-slate-400">Hora<select value={time} onChange={(event) => setTime(event.target.value)} className="min-h-11 rounded-xl border border-white/12 bg-[#080a10] px-3 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">{["21:30","22:00","22:30","23:00","23:30","00:00","00:30","01:00","01:30","02:00","02:30","03:00","03:30"].map((value) => <option key={value}>{value}</option>)}</select></label>
                <label className="grid gap-1.5 text-xs font-semibold text-slate-400">Personas<select value={people} onChange={(event) => setPeople(Number(event.target.value))} className="min-h-11 rounded-xl border border-white/12 bg-[#080a10] px-3 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">{Array.from({ length: 8 }, (_, index) => index + 1).map((value) => <option key={value} value={value}>{value} {value === 1 ? "persona" : "personas"}</option>)}</select></label>
                <label className="grid gap-1.5 text-xs font-semibold text-slate-400">Estado de prueba<select value={mode} onChange={(event) => setMode(event.target.value as AvailabilityMode)} className="min-h-11 rounded-xl border border-white/12 bg-[#080a10] px-3 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"><option value="normal">Normal</option><option value="error">Error de carga</option><option value="empty">Sin disponibilidad</option><option value="selection-lost">Mesa deja de estar disponible</option></select></label>
              </CardContent>
            </Card>

            <TableSelector date={date} time={time} people={people} previousSelection={selected?.id} availabilityMode={mode} onContinue={continueToReview} />
          </>
        )}

        {screen === "review" && selected && (
          <section aria-labelledby="review-title" className="mx-auto max-w-2xl pt-8">
            <Badge>Revisar · antes de enviar</Badge>
            <h1 id="review-title" className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">Revisa tu selección</h1>
            <p className="mt-2 text-sm leading-6 text-slate-400">Esta pantalla mantiene el flujo Revisar → Enviar. La mesa todavía no está confirmada.</p>
            <Card className="mt-6 border-white/15">
              <CardContent className="space-y-5 p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Mesa</p><p className="mt-1 text-2xl font-black text-white">{selected.id}</p><p className="mt-1 text-sm text-slate-400">{floorLabel(selected.floor)} · {selected.zone}</p></div><span className={selected.floor === "planta-baja" ? "size-12 rounded-xl border-2 border-cyan-300 bg-cyan-400/15 shadow-[0_0_20px_rgba(34,211,238,.25)]" : "size-12 rounded-xl border-2 border-violet-400 bg-violet-500/15 shadow-[0_0_20px_rgba(139,92,246,.3)]"} /></div>
                <dl className="grid grid-cols-2 gap-3 rounded-2xl border border-white/8 bg-black/20 p-4 sm:grid-cols-4"><div><dt className="text-xs text-slate-500">Fecha</dt><dd className="mt-1 font-bold text-white">{dateLabel.format(new Date(`${date}T12:00:00-06:00`))}</dd></div><div><dt className="text-xs text-slate-500">Hora</dt><dd className="mt-1 font-bold text-white">{time}</dd></div><div><dt className="text-xs text-slate-500">Personas</dt><dd className="mt-1 font-bold text-white">{people}</dd></div><div><dt className="text-xs text-slate-500">Disponibilidad</dt><dd className="mt-1 font-bold text-amber-200">Simulada</dd></div></dl>
                <div className="grid grid-cols-2 gap-3"><div className="rounded-xl border border-white/8 p-3"><p className="text-xs text-slate-500">Capacidad</p><p className="mt-1 text-sm font-semibold text-white">Por confirmar</p></div><div className="rounded-xl border border-white/8 p-3"><p className="text-xs text-slate-500">Consumo mínimo</p><p className="mt-1 text-sm font-semibold text-white">Por confirmar</p></div></div>
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between"><Button type="button" variant="secondary" onClick={() => setScreen("selector")}><ArrowLeft aria-hidden="true" className="size-4" /> Volver y cambiar mesa</Button><Button type="button" onClick={() => setScreen("sent")}><Send aria-hidden="true" className="size-4" /> Enviar solicitud de prueba</Button></div>
              </CardContent>
            </Card>
          </section>
        )}

        {screen === "sent" && selected && (
          <section className="mx-auto max-w-xl pt-12 text-center" aria-labelledby="sent-title"><div className="mx-auto flex size-16 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-400/10"><CheckCircle2 aria-hidden="true" className="size-8 text-emerald-300" /></div><h1 id="sent-title" className="mt-5 text-3xl font-black text-white">Solicitud de prueba completada</h1><p className="mt-3 leading-7 text-slate-400">Mesa {selected.id} conservada en el resumen. No se enviaron datos ni se creó una reservación real.</p><Button type="button" className="mt-6" variant="secondary" onClick={() => setScreen("review")}><ArrowLeft aria-hidden="true" className="size-4" /> Volver al resumen</Button></section>
        )}
      </div>
    </main>
  );
}
