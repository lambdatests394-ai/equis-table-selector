"use client";

import { Check, LockKeyhole } from "lucide-react";
import { Availability, ClubTable, Floor, floorLabel, TABLE_CATALOG } from "@/lib/tables";
import { cn } from "@/lib/utils";

type Props = {
  availability: Availability;
  selectedId?: string;
  filter: "all" | Floor;
  onSelect: (table: ClubTable) => void;
};

export function TableList({ availability, selectedId, filter, onSelect }: Props) {
  const tables = TABLE_CATALOG.filter((table) => filter === "all" || table.floor === filter);
  return (
    <div className="grid max-h-[62vh] gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
      {tables.map((table) => {
        const occupied = availability[table.id] === "occupied";
        const selected = selectedId === table.id;
        return (
          <button
            key={table.id}
            type="button"
            disabled={occupied}
            aria-pressed={selected}
            onClick={() => onSelect(table)}
            className={cn(
              "flex min-h-16 items-center gap-3 rounded-xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
              table.floor === "planta-baja" ? "border-cyan-400/30 bg-cyan-400/7" : "border-violet-400/30 bg-violet-500/8",
              selected && "border-white bg-white/10",
              occupied && "cursor-not-allowed border-slate-800 bg-slate-900/60 opacity-55",
            )}
          >
            <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg border text-xs font-black", table.floor === "planta-baja" ? "border-cyan-300 text-cyan-100" : "border-violet-400 text-violet-100")}>
              {occupied ? <LockKeyhole aria-hidden="true" className="size-4" /> : selected ? <Check aria-hidden="true" className="size-5" /> : table.id}
            </span>
            <span className="min-w-0"><strong className="block text-sm text-white">Mesa {table.id}</strong><span className="block truncate text-xs text-slate-400">{floorLabel(table.floor)} · {table.zone}</span></span>
            <span className="ml-auto text-[10px] font-bold uppercase tracking-wide text-slate-500">{occupied ? "Ocupada" : selected ? "Elegida" : "Disponible"}</span>
          </button>
        );
      })}
    </div>
  );
}

