import * as React from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  placeholder?: string;
}

function Select({
  className,
  children,
  placeholder,
  ...props
}: SelectProps) {
  return (
    <div data-slot="select" className="relative">
      <select
        data-slot="select-native"
        className={cn(
          "border-input data-[placeholder]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex h-9 w-full appearance-none items-center justify-between gap-2 rounded-md border bg-transparent py-2 pr-8 pl-3 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
      <ChevronDownIcon className="text-muted-foreground pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2 opacity-50" />
    </div>
  );
}

interface SelectGroupProps
  extends React.OptgroupHTMLAttributes<HTMLOptGroupElement> {}

function SelectGroup({ className, ...props }: SelectGroupProps) {
  return <optgroup data-slot="select-group" className={className} {...props} />;
}

interface SelectItemProps
  extends React.OptionHTMLAttributes<HTMLOptionElement> {}

function SelectItem({ className, ...props }: SelectItemProps) {
  return <option data-slot="select-item" className={className} {...props} />;
}

interface SelectLabelProps
  extends React.OptgroupHTMLAttributes<HTMLOptGroupElement> {}

function SelectLabel({ className, label, children, ...props }: SelectLabelProps) {
  return (
    <optgroup
      data-slot="select-label"
      label={label}
      className={cn("text-muted-foreground", className)}
      {...props}
    >
      {children}
    </optgroup>
  );
}

interface SelectSeparatorProps extends React.HTMLAttributes<HTMLHRElement> {}

function SelectSeparator({ className, ...props }: SelectSeparatorProps) {
  return (
    <hr
      data-slot="select-separator"
      className={cn("bg-border my-1 h-px", className)}
      {...props}
    />
  );
}

// Custom select using popover for more control over styling
interface CustomSelectContextValue {
  selectId: string;
  value: string;
  onValueChange: (value: string) => void;
}

const CustomSelectContext = React.createContext<CustomSelectContextValue | null>(null);

function useCustomSelectContext() {
  const context = React.useContext(CustomSelectContext);
  if (!context) {
    throw new Error("CustomSelect components must be used within a CustomSelect");
  }
  return context;
}

interface CustomSelectProps {
  children: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

function CustomSelect({
  children,
  value: controlledValue,
  defaultValue = "",
  onValueChange,
}: CustomSelectProps) {
  const id = React.useId();
  const selectId = `select${id.replace(/:/g, "")}`;
  const [internalValue, setInternalValue] = React.useState(defaultValue);

  const value = controlledValue ?? internalValue;
  const handleValueChange = (newValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <CustomSelectContext.Provider value={{ selectId, value, onValueChange: handleValueChange }}>
      {children}
    </CustomSelectContext.Provider>
  );
}

interface CustomSelectTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "default";
  placeholder?: string;
}

function CustomSelectTrigger({
  className,
  children,
  size = "default",
  placeholder,
  ...props
}: CustomSelectTriggerProps) {
  const { selectId, value } = useCustomSelectContext();

  return (
    <button
      type="button"
      data-slot="select-trigger"
      data-size={size}
      data-placeholder={!value ? "" : undefined}
      popoverTarget={selectId}
      className={cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span data-slot="select-value" className="line-clamp-1 flex items-center gap-2">
        {value || placeholder || "Select..."}
      </span>
      <ChevronDownIcon className="size-4 opacity-50" />
    </button>
  );
}

interface CustomSelectContentProps extends React.HTMLAttributes<HTMLDivElement> {}

function CustomSelectContent({
  className,
  children,
  ...props
}: CustomSelectContentProps) {
  const { selectId } = useCustomSelectContext();

  return (
    <div
      id={selectId}
      popover="auto"
      data-slot="select-content"
      className={cn(
        "bg-popover text-popover-foreground z-50 m-0 hidden min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-md",
        "[&:popover-open]:block",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CustomSelectItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

function CustomSelectItem({
  className,
  children,
  value: itemValue,
  ...props
}: CustomSelectItemProps) {
  const { selectId, value, onValueChange } = useCustomSelectContext();
  const isSelected = value === itemValue;

  return (
    <button
      type="button"
      data-slot="select-item"
      data-selected={isSelected ? "" : undefined}
      popoverTarget={selectId}
      popoverTargetAction="hide"
      onClick={() => onValueChange(itemValue)}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span
        data-slot="select-item-indicator"
        className="absolute right-2 flex size-3.5 items-center justify-center"
      >
        {isSelected && <CheckIcon className="size-4" />}
      </span>
      {children}
    </button>
  );
}

interface CustomSelectLabelProps extends React.HTMLAttributes<HTMLDivElement> {}

function CustomSelectLabel({ className, ...props }: CustomSelectLabelProps) {
  return (
    <div
      data-slot="select-label"
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
      {...props}
    />
  );
}

interface CustomSelectSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

function CustomSelectSeparator({ className, ...props }: CustomSelectSeparatorProps) {
  return (
    <div
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

export {
  // Native select (simplest approach)
  Select,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  // Custom select with popover (more styling control)
  CustomSelect,
  CustomSelectTrigger,
  CustomSelectContent,
  CustomSelectItem,
  CustomSelectLabel,
  CustomSelectSeparator,
};
export type {
  SelectProps,
  SelectGroupProps,
  SelectItemProps,
  SelectLabelProps,
  SelectSeparatorProps,
  CustomSelectProps,
  CustomSelectTriggerProps,
  CustomSelectContentProps,
  CustomSelectItemProps,
  CustomSelectLabelProps,
  CustomSelectSeparatorProps,
};
