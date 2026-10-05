"use client";

import { Check, LockKeyhole } from "lucide-react";
import { ClubTable, floorLabel } from "@/lib/tables";
import { cn } from "@/lib/utils";

type TableButtonProps = {
  table: ClubTable;
  occupied: boolean;
  selected: boolean;
  dimmed: boolean;
  onSelect: (table: ClubTable) => void;
};

export function TableButton({ table, occupied, selected, dimmed, onSelect }: TableButtonProps) {
  const isGround = table.floor === "planta-baja";
  const state = occupied ? "Ocupada" : selected ? "Seleccionada" : "Disponible";

  return (
    <div
      className={cn("group absolute", dimmed && "opacity-20")}
      style={{ left: table.position.x, top: table.position.y }}
    >
      <button
        type="button"
        disabled={occupied}
        aria-pressed={selected}
        aria-label={`${table.id}, ${floorLabel(table.floor)}, ${table.zone}, ${state}`}
        onClick={() => onSelect(table)}
        className={cn(
          "relative flex size-14 items-center justify-center rounded-xl border-2 text-[11px] font-black tracking-tight transition-[transform,box-shadow,opacity] focus-visible:z-30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/90 motion-safe:hover:-translate-y-0.5",
          isGround
            ? "border-cyan-300/80 bg-cyan-400/12 text-cyan-100 shadow-[0_0_16px_rgba(34,211,238,.2)]"
            : "border-violet-400/80 bg-violet-500/14 text-violet-100 shadow-[0_0_16px_rgba(139,92,246,.22)]",
          selected &&
            (isGround
              ? "border-white bg-cyan-400/35 shadow-[0_0_0_3px_rgba(34,211,238,.45),0_0_28px_rgba(34,211,238,.55)]"
              : "border-white bg-violet-500/40 shadow-[0_0_0_3px_rgba(139,92,246,.45),0_0_28px_rgba(139,92,246,.6)]"),
          occupied && "cursor-not-allowed border-slate-700 bg-slate-900/90 text-slate-500 shadow-none",
        )}
      >
        <span>{table.id}</span>
        {occupied && (
          <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-slate-700 text-slate-200">
            <LockKeyhole aria-hidden="true" className="size-3" />
          </span>
        )}
        {selected && !occupied && (
          <span className={cn("absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full text-slate-950", isGround ? "bg-cyan-200" : "bg-violet-200")}>
            <Check aria-hidden="true" className="size-3.5 stroke-[3]" />
          </span>
        )}
      </button>

      <div
        role="tooltip"
        className="pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 z-40 hidden w-52 -translate-x-1/2 rounded-xl border border-white/15 bg-[#090b12]/95 p-3 text-left shadow-2xl backdrop-blur-md group-hover:block group-focus-within:block max-md:hidden"
      >
        <p className="font-bold text-white">Mesa {table.id}</p>
        <p className="mt-1 text-xs text-slate-300">{floorLabel(table.floor)} · {table.zone}</p>
        <dl className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
          <div><dt className="text-slate-500">Capacidad</dt><dd className="text-slate-100">Por confirmar</dd></div>
          <div><dt className="text-slate-500">Consumo mínimo</dt><dd className="text-slate-100">Por confirmar</dd></div>
        </dl>
      </div>
    </div>
  );
}

