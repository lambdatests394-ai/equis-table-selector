import { Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ClubTable, floorLabel } from "@/lib/tables";

export function TableDetails({ table }: { table: ClubTable }) {
  return (
    <Card className="border-white/15 bg-[#151925] md:hidden">
      <CardContent className="grid gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Selección actual</p><h3 className="mt-1 text-lg font-black text-white">Mesa {table.id}</h3></div>
          <Badge className={table.floor === "planta-baja" ? "border-cyan-400/30 text-cyan-100" : "border-violet-400/30 text-violet-100"}>{floorLabel(table.floor)}</Badge>
        </div>
        <p className="text-sm text-slate-300">{table.zone}</p>
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-black/20 p-3 text-xs"><div><p className="text-slate-500">Capacidad</p><p className="mt-1 font-semibold text-slate-100">Por confirmar</p></div><div><p className="text-slate-500">Consumo mínimo</p><p className="mt-1 font-semibold text-slate-100">Por confirmar</p></div></div>
        <p className="flex gap-2 text-xs leading-5 text-slate-400"><Info aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" /> Datos pendientes de confirmar por Equis Discoteca.</p>
      </CardContent>
    </Card>
  );
}

