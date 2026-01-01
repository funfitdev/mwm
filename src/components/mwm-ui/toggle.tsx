import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium hover:bg-muted hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-9 px-2 min-w-9",
        sm: "h-8 px-1.5 min-w-8",
        lg: "h-10 px-2.5 min-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ToggleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof toggleVariants> {
  pressed?: boolean;
  defaultPressed?: boolean;
  /** Name for hidden input to store state */
  name?: string;
}

function Toggle({
  className,
  variant,
  size,
  pressed,
  defaultPressed,
  name,
  children,
  ...props
}: ToggleProps) {
  const isPressed = pressed ?? defaultPressed ?? false;
  return (
    <button
      type="button"
      data-slot="toggle"
      data-state={isPressed ? "on" : "off"}
      data-variant={variant}
      data-size={size}
      data-name={name}
      aria-pressed={isPressed}
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    >
      {name && <input type="hidden" name={name} value={isPressed ? "true" : "false"} />}
      {children}
    </button>
  );
}

export { Toggle, toggleVariants };
export type { ToggleProps };
