"use client";

import * as React from "react";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { IconCheck } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

export function Checkbox({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-full border border-neutral-300 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500 data-[state=checked]:text-white dark:border-neutral-600",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
        <IconCheck size={11} stroke={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
