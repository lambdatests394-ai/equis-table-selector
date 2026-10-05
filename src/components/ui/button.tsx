import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080a10] disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      variant: {
        default: "bg-white text-slate-950 hover:bg-cyan-100",
        secondary: "border border-white/15 bg-white/6 text-white hover:bg-white/12",
        ghost: "text-slate-300 hover:bg-white/8 hover:text-white",
        violet: "bg-violet-500 text-white hover:bg-violet-400",
      },
      size: {
        default: "px-4 py-2.5",
        icon: "size-11 p-0",
        sm: "min-h-9 rounded-lg px-3 py-1.5 text-xs",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({ className, variant, size, asChild, ...props }: ButtonProps) {
  const Component = asChild ? Slot : "button";
  return <Component className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

