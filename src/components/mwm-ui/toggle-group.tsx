import * as React from "react";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { toggleVariants } from "@/components/mwm-ui/toggle";

interface ToggleGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toggleVariants> {
  type?: "single" | "multiple";
  value?: string | string[];
  defaultValue?: string | string[];
  spacing?: number;
  /** Name for hidden input to store state */
  name?: string;
}

function ToggleGroup({
  className,
  variant,
  size,
  spacing = 0,
  type = "single",
  value,
  defaultValue,
  name,
  children,
  ...props
}: ToggleGroupProps) {
  // Calculate initial value for hidden input
  const initialValue = value ?? defaultValue;
  const hiddenValue =
    type === "multiple" && Array.isArray(initialValue)
      ? JSON.stringify(initialValue)
      : typeof initialValue === "string"
        ? initialValue
        : "";

  return (
    <div
      role="group"
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      data-spacing={spacing}
      data-type={type}
      data-name={name}
      style={{ "--gap": spacing } as React.CSSProperties}
      className={cn(
        "group/toggle-group flex w-fit items-center gap-[--spacing(var(--gap))] rounded-md data-[spacing=0]:data-[variant=outline]:shadow-xs",
        className
      )}
      {...props}
    >
      {name && <input type="hidden" name={name} defaultValue={hiddenValue} />}
      {React.Children.map(children, (child) => {
        if (React.isValidElement<ToggleGroupItemProps>(child)) {
          return React.cloneElement(child, {
            variant: child.props.variant ?? variant,
            size: child.props.size ?? size,
            "data-spacing": spacing,
          } as Partial<ToggleGroupItemProps>);
        }
        return child;
      })}
    </div>
  );
}

interface ToggleGroupItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof toggleVariants> {
  value?: string;
  pressed?: boolean;
  "data-spacing"?: number;
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  value,
  pressed,
  "data-spacing": spacing,
  ...props
}: ToggleGroupItemProps) {
  return (
    <button
      type="button"
      data-slot="toggle-group-item"
      data-variant={variant}
      data-size={size}
      data-spacing={spacing}
      data-state={pressed ? "on" : "off"}
      data-value={value}
      aria-pressed={pressed}
      className={cn(
        toggleVariants({
          variant,
          size,
        }),
        "w-auto min-w-0 shrink-0 px-3 focus:z-10 focus-visible:z-10",
        "data-[spacing=0]:rounded-none data-[spacing=0]:shadow-none data-[spacing=0]:first:rounded-l-md data-[spacing=0]:last:rounded-r-md data-[spacing=0]:data-[variant=outline]:border-l-0 data-[spacing=0]:data-[variant=outline]:first:border-l",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export { ToggleGroup, ToggleGroupItem };
export type { ToggleGroupProps, ToggleGroupItemProps };
