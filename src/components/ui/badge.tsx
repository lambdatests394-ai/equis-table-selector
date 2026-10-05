import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("inline-flex min-h-7 items-center rounded-full border border-white/12 bg-white/7 px-2.5 text-xs font-medium text-slate-200", className)}
      {...props}
    />
  );
}
