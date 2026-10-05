"use client";

import { ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClubTable, floorLabel } from "@/lib/tables";

type Props = {
  selected?: ClubTable;
  onChange: () => void;
  onContinue: () => void;
};

export function SelectionBar({ selected, onChange, onContinue }: Props) {
  return (
    <div className="sticky bottom-3 z-40 mt-4 rounded-2xl border border-white/15 bg-[#0c0f17]/95 p-3 shadow-[0_18px_50px_rgba(0,0,0,.6)] backdrop-blur-xl supports-[padding:max(0px)]:pb-[max(.75rem,env(safe-area-inset-bottom))]">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Mesa seleccionada</p>
          {selected ? <p className="mt-0.5 truncate text-sm font-bold text-white">{selected.id} · {floorLabel(selected.floor)} · {selected.zone}</p> : <p className="mt-0.5 text-sm text-slate-400">Elige una mesa disponible</p>}
        </div>
        {selected && <Button type="button" size="sm" variant="ghost" onClick={onChange}><RotateCcw aria-hidden="true" className="size-3.5" /> Cambiar</Button>}
        <Button type="button" disabled={!selected} onClick={onContinue}>Continuar <ArrowRight aria-hidden="true" className="size-4" /></Button>
      </div>
      <p className="mt-2 text-[11px] text-slate-500">La selección se revisará antes de enviar. Aún no confirma una reservación.</p>
    </div>
  );
}

