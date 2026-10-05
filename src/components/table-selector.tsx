"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, List, LoaderCircle, Map as MapIcon, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Legend } from "@/components/legend";
import { SelectionBar } from "@/components/selection-bar";
import { TableDetails } from "@/components/table-details";
import { TableList } from "@/components/table-list";
import { TableMap } from "@/components/table-map";
import { Availability, availabilityForDate, ClubTable, Floor, TABLE_CATALOG } from "@/lib/tables";

export type AvailabilityMode = "normal" | "error" | "empty" | "selection-lost";

export type TableSelectorProps = {
  date: string;
  time: string;
  people: number;
  previousSelection?: string;
  availabilityMode?: AvailabilityMode;
  onContinue: (table: ClubTable) => void;
};

export function TableSelector({ date, time, people, previousSelection, availabilityMode = "normal", onContinue }: TableSelectorProps) {
  const [query, setQuery] = useState<{ key: string; availability: Availability; error: boolean }>({ key: "", availability: {}, error: false });
  const [selectedId, setSelectedId] = useState(previousSelection);
  const [filter, setFilter] = useState<"all" | Floor>("all");
  const [view, setView] = useState<"map" | "list">("map");
  const [zoom, setZoom] = useState(0.85);
  const [announcement, setAnnouncement] = useState("");
  const [requestKey, setRequestKey] = useState(0);
  const selectedRef = useRef(selectedId);

  useEffect(() => {
    selectedRef.current = selectedId;
  }, [selectedId]);

  const queryKey = `${date}:${availabilityMode}:${requestKey}`;
  const loading = query.key !== queryKey;
  const error = !loading && query.error;
  const availability = loading ? {} : query.availability;

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      if (!active) return;
      if (availabilityMode === "error") {
        setQuery({ key: queryKey, availability: {}, error: true });
        return;
      }
      const next = availabilityForDate(date);
      if (availabilityMode === "empty") {
        for (const table of TABLE_CATALOG) next[table.id] = "occupied";
      }
      if (availabilityMode === "selection-lost" && selectedRef.current) {
        const lostId = selectedRef.current;
        next[lostId] = "occupied";
        setSelectedId(undefined);
        setAnnouncement(`La mesa ${lostId} dejó de estar disponible. Elige otra mesa.`);
      } else if (selectedRef.current && next[selectedRef.current] === "occupied") {
        const lostId = selectedRef.current;
        setSelectedId(undefined);
        setAnnouncement(`La mesa ${lostId} dejó de estar disponible. Elige otra mesa.`);
      }
      setQuery({ key: queryKey, availability: next, error: false });
    }, 450);
    return () => { active = false; window.clearTimeout(timer); };
  }, [date, availabilityMode, queryKey]);

  const selected = useMemo(() => TABLE_CATALOG.find((table) => table.id === selectedId), [selectedId]);
  const availableCount = Object.values(availability).filter((status) => status === "available").length;

  function selectTable(table: ClubTable) {
    if (availability[table.id] !== "available") return;
    setSelectedId(table.id);
    setAnnouncement(`Mesa ${table.id} seleccionada, ${table.zone}.`);
  }

  function clearSelection() {
    setSelectedId(undefined);
    setAnnouncement("Selección eliminada. Elige otra mesa.");
  }

  return (
    <section aria-labelledby="selector-title" className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap gap-2"><Badge>Visita · selección de mesa</Badge><Badge className="border-amber-400/25 text-amber-200">Disponibilidad simulada</Badge></div>
          <h2 id="selector-title" className="text-2xl font-black tracking-tight text-white sm:text-3xl">Elige dónde vivir la noche</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">Explora el plano por planta o cambia a lista. Los identificadores son provisionales para esta demo y pueden reemplazarse desde el catálogo de datos.</p>
        </div>
        <div className="grid grid-cols-3 gap-2 rounded-xl border border-white/10 bg-white/[.035] p-3 text-center text-xs">
          <div><span className="block text-slate-500">Fecha</span><strong className="mt-1 block text-white">{date || "—"}</strong></div>
          <div><span className="block text-slate-500">Hora</span><strong className="mt-1 block text-white">{time}</strong></div>
          <div><span className="block text-slate-500">Personas</span><strong className="mt-1 block text-white">{people}</strong></div>
        </div>
      </div>

      <Card>
        <CardContent className="space-y-4 p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar mesas por planta">
              {([['all', 'Todas'], ['planta-baja', 'Planta baja'], ['planta-alta', 'Planta alta']] as const).map(([value, label]) => (
                <Button key={value} type="button" size="sm" variant={filter === value ? "default" : "secondary"} aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</Button>
              ))}
            </div>
            <div className="flex items-center justify-between gap-3">
              {!loading && !error && <p className="text-xs text-slate-400"><strong className="text-white">{availableCount}</strong> de 96 disponibles</p>}
              <div className="flex rounded-xl border border-white/10 bg-black/20 p-1" role="group" aria-label="Cambiar vista">
                <Button type="button" size="sm" variant={view === "map" ? "default" : "ghost"} aria-pressed={view === "map"} onClick={() => setView("map")}><MapIcon aria-hidden="true" className="size-3.5" /> Plano</Button>
                <Button type="button" size="sm" variant={view === "list" ? "default" : "ghost"} aria-pressed={view === "list"} onClick={() => setView("list")}><List aria-hidden="true" className="size-3.5" /> Lista</Button>
              </div>
            </div>
          </div>

          <Legend />

          {loading && (
            <div className="flex min-h-80 flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-black/15 text-center"><LoaderCircle aria-hidden="true" className="size-7 animate-spin text-cyan-300 motion-reduce:animate-none" /><p className="font-semibold text-white">Consultando mesas para esta fecha…</p><p className="text-sm text-slate-500">Esto es una simulación local.</p></div>
          )}
          {error && (
            <div className="flex min-h-80 flex-col items-center justify-center gap-3 rounded-2xl border border-rose-400/20 bg-rose-400/5 p-6 text-center"><AlertTriangle aria-hidden="true" className="size-8 text-rose-300" /><p className="font-bold text-white">No pudimos cargar la disponibilidad</p><p className="max-w-sm text-sm text-slate-400">La selección anterior se conserva. Intenta consultar de nuevo.</p><Button type="button" onClick={() => setRequestKey((value) => value + 1)}><RefreshCw aria-hidden="true" className="size-4" /> Reintentar</Button></div>
          )}
          {!loading && !error && availableCount === 0 && (
            <div className="flex min-h-72 flex-col items-center justify-center gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-6 text-center"><AlertTriangle aria-hidden="true" className="size-8 text-amber-300" /><p className="font-bold text-white">No hay mesas disponibles para esta fecha</p><p className="max-w-sm text-sm text-slate-400">Cambia la fecha en la demo para consultar otra noche.</p></div>
          )}
          {!loading && !error && availableCount > 0 && view === "map" && <TableMap availability={availability} selectedId={selectedId} filter={filter} zoom={zoom} onZoom={setZoom} onSelect={selectTable} />}
          {!loading && !error && availableCount > 0 && view === "list" && <TableList availability={availability} selectedId={selectedId} filter={filter} onSelect={selectTable} />}
        </CardContent>
      </Card>

      {selected && <TableDetails table={selected} />}
      <SelectionBar selected={selected} onChange={clearSelection} onContinue={() => selected && onContinue(selected)} />
      <p className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</p>
    </section>
  );
}
