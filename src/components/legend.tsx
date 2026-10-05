import { LockKeyhole } from "lucide-react";

export function Legend() {
  return (
    <div aria-label="Leyenda del plano" className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-300">
      <span className="flex items-center gap-2"><span className="size-3 rounded-sm border border-cyan-300 bg-cyan-400/20" /> Planta baja</span>
      <span className="flex items-center gap-2"><span className="size-3 rounded-sm border border-violet-400 bg-violet-500/20" /> Planta alta</span>
      <span className="flex items-center gap-2"><LockKeyhole aria-hidden="true" className="size-3.5 text-slate-500" /> Ocupada</span>
      <span className="flex items-center gap-2"><span className="size-3 rounded-sm border-2 border-white" /> Seleccionada</span>
    </div>
  );
}

