import * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-primary/90 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:opacity-100 disabled:shadow-none dark:disabled:bg-neutral-800 dark:disabled:text-neutral-500",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-destructive/90",
        outline:
          "border border-neutral-200 bg-white text-neutral-700 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:hover:text-neutral-100",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "min-h-10 h-10 px-4 py-2 text-sm sm:min-h-9 sm:h-9 sm:px-3.5 sm:text-xs",
        sm: "min-h-9 h-9 rounded-lg px-3 text-xs sm:min-h-8 sm:h-8",
        lg: "min-h-11 h-11 rounded-lg px-5 text-sm sm:min-h-10 sm:h-10",
        icon: "h-10 w-10 sm:h-9 sm:w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
