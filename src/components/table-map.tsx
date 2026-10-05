"use client";

import { Minus, Plus, Scan } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Availability, CANVAS, CLOSED_SPACE, ClubTable, Floor, TABLE_CATALOG } from "@/lib/tables";
import { TableButton } from "@/components/table-button";

type TableMapProps = {
  availability: Availability;
  selectedId?: string;
  filter: "all" | Floor;
  zoom: number;
  onZoom: (zoom: number) => void;
  onSelect: (table: ClubTable) => void;
};

export function TableMap({ availability, selectedId, filter, zoom, onZoom, onSelect }: TableMapProps) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs leading-5 text-slate-400">Desliza el plano para recorrerlo. Usa los controles para ampliar.</p>
        <div className="flex shrink-0 gap-1" aria-label="Controles de zoom">
          <Button type="button" size="icon" variant="secondary" aria-label="Alejar" onClick={() => onZoom(Math.max(0.55, zoom - 0.15))}><Minus aria-hidden="true" className="size-4" /></Button>
          <Button type="button" size="icon" variant="secondary" aria-label="Ver todo" onClick={() => onZoom(0.55)}><Scan aria-hidden="true" className="size-4" /></Button>
          <Button type="button" size="icon" variant="secondary" aria-label="Acercar" onClick={() => onZoom(Math.min(1.35, zoom + 0.15))}><Plus aria-hidden="true" className="size-4" /></Button>
        </div>
      </div>

      <div className="map-scroll max-h-[66vh] overflow-auto rounded-2xl border border-white/10 bg-[#05070c] shadow-inner" tabIndex={0} aria-label="Plano desplazable de Equis Discoteca">
        <div style={{ width: CANVAS.width * zoom, height: CANVAS.height * zoom }}>
          <div
            className="relative overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_50%_28%,rgba(34,211,238,.09),transparent_35%),linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] bg-[size:auto,40px_40px,40px_40px]"
            style={{ width: CANVAS.width, height: CANVAS.height, transform: `scale(${zoom})`, transformOrigin: "top left" }}
          >
            <div className="absolute left-[224px] top-[38px] flex h-[82px] w-[632px] items-center justify-center rounded-2xl border-2 border-cyan-300/70 bg-cyan-400/12 text-sm font-black uppercase tracking-[0.25em] text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,.18)]">Cabina del DJ</div>
            <div className="absolute left-[224px] top-[1132px] flex h-[78px] w-[632px] items-center justify-center rounded-2xl border-2 border-cyan-300/70 bg-cyan-400/12 text-sm font-black uppercase tracking-[0.25em] text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,.18)]">Barra</div>
            <div className="absolute left-[270px] top-[146px] rounded-full border border-cyan-300/20 bg-cyan-950/55 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200">Pista · 35 mesas</div>
            <div className="absolute left-[220px] top-[1308px] text-[10px] font-bold uppercase tracking-[0.2em] text-violet-200">Planta alta · detrás de barra</div>

            <div
              aria-label="Espacio cerrado no seleccionable"
              className="absolute flex items-center justify-center rounded-lg border border-dashed border-slate-600 bg-slate-900/85 px-1 text-center text-[8px] font-bold uppercase tracking-wide text-slate-500"
              style={{ left: CLOSED_SPACE.x, top: CLOSED_SPACE.y, width: CLOSED_SPACE.width, height: CLOSED_SPACE.height }}
            >
              Cerrado
            </div>

            {TABLE_CATALOG.map((table) => (
              <TableButton
                key={table.id}
                table={table}
                occupied={availability[table.id] === "occupied"}
                selected={selectedId === table.id}
                dimmed={filter !== "all" && table.floor !== filter}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

