import * as React from "react";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {}

function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <span data-slot="checkbox" className="relative inline-flex">
      <input
        type="checkbox"
        className={cn(
          "peer border-input dark:bg-input/30 checked:bg-primary checked:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 cursor-pointer appearance-none rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
      <CheckIcon
        data-slot="checkbox-indicator"
        className="text-primary-foreground pointer-events-none absolute top-0 left-0 size-4 opacity-0 peer-checked:opacity-100"
      />
    </span>
  );
}

export { Checkbox };
export type { CheckboxProps };
