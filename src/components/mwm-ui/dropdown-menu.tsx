import * as React from "react";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface DropdownMenuContextValue {
  menuId: string;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null);

function useDropdownMenuContext() {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error("DropdownMenu components must be used within a DropdownMenu");
  }
  return context;
}

interface DropdownMenuProps {
  children: React.ReactNode;
}

function DropdownMenu({ children }: DropdownMenuProps) {
  const id = React.useId();
  const menuId = `dropdown${id.replace(/:/g, "")}`;

  return (
    <DropdownMenuContext.Provider value={{ menuId }}>
      {children}
    </DropdownMenuContext.Provider>
  );
}

interface DropdownMenuTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

function DropdownMenuTrigger({
  className,
  children,
  asChild = false,
  ...props
}: DropdownMenuTriggerProps) {
  const { menuId } = useDropdownMenuContext();

  const Comp = asChild ? "span" : "button";

  return (
    <Comp
      type={asChild ? undefined : "button"}
      data-slot="dropdown-menu-trigger"
      popoverTarget={menuId}
      className={className}
      {...props}
    >
      {children}
    </Comp>
  );
}

interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  sideOffset?: number;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

function DropdownMenuContent({
  className,
  children,
  sideOffset: _sideOffset,
  side: _side,
  align: _align,
  ...props
}: DropdownMenuContentProps) {
  const { menuId } = useDropdownMenuContext();

  return (
    <div
      id={menuId}
      popover="auto"
      data-slot="dropdown-menu-content"
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

interface DropdownMenuGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

function DropdownMenuGroup({ className, ...props }: DropdownMenuGroupProps) {
  return (
    <div
      data-slot="dropdown-menu-group"
      role="group"
      className={className}
      {...props}
    />
  );
}

interface DropdownMenuItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  inset?: boolean;
  variant?: "default" | "destructive";
  closeOnClick?: boolean;
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  closeOnClick = true,
  ...props
}: DropdownMenuItemProps) {
  const { menuId } = useDropdownMenuContext();

  return (
    <button
      type="button"
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      popoverTarget={closeOnClick ? menuId : undefined}
      popoverTargetAction={closeOnClick ? "hide" : undefined}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

interface DropdownMenuCheckboxItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  onCheckedChange,
  ...props
}: DropdownMenuCheckboxItemProps) {
  return (
    <button
      type="button"
      data-slot="dropdown-menu-checkbox-item"
      data-checked={checked ? "" : undefined}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        {checked && <CheckIcon className="size-4" />}
      </span>
      {children}
    </button>
  );
}

interface DropdownMenuRadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
}

const DropdownMenuRadioGroupContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
} | null>(null);

function DropdownMenuRadioGroup({
  value,
  onValueChange,
  className,
  ...props
}: DropdownMenuRadioGroupProps) {
  return (
    <DropdownMenuRadioGroupContext.Provider value={{ value, onValueChange }}>
      <div
        data-slot="dropdown-menu-radio-group"
        role="radiogroup"
        className={className}
        {...props}
      />
    </DropdownMenuRadioGroupContext.Provider>
  );
}

interface DropdownMenuRadioItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

function DropdownMenuRadioItem({
  className,
  children,
  value: itemValue,
  ...props
}: DropdownMenuRadioItemProps) {
  const context = React.useContext(DropdownMenuRadioGroupContext);
  const isSelected = context?.value === itemValue;

  return (
    <button
      type="button"
      data-slot="dropdown-menu-radio-item"
      data-checked={isSelected ? "" : undefined}
      role="menuitemradio"
      aria-checked={isSelected}
      onClick={() => context?.onValueChange?.(itemValue)}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        {isSelected && <CircleIcon className="size-2 fill-current" />}
      </span>
      {children}
    </button>
  );
}

interface DropdownMenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean;
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: DropdownMenuLabelProps) {
  return (
    <div
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className
      )}
      {...props}
    />
  );
}

interface DropdownMenuSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

function DropdownMenuSeparator({
  className,
  ...props
}: DropdownMenuSeparatorProps) {
  return (
    <div
      data-slot="dropdown-menu-separator"
      role="separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

interface DropdownMenuShortcutProps extends React.HTMLAttributes<HTMLSpanElement> {}

function DropdownMenuShortcut({
  className,
  ...props
}: DropdownMenuShortcutProps) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className
      )}
      {...props}
    />
  );
}

// Sub-menu using details/summary for nested menus
interface DropdownMenuSubProps extends React.HTMLAttributes<HTMLDetailsElement> {}

function DropdownMenuSub({ className, ...props }: DropdownMenuSubProps) {
  return (
    <details
      data-slot="dropdown-menu-sub"
      className={cn("group/sub relative", className)}
      {...props}
    />
  );
}

interface DropdownMenuSubTriggerProps extends React.HTMLAttributes<HTMLElement> {
  inset?: boolean;
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: DropdownMenuSubTriggerProps) {
  return (
    <summary
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground group-open/sub:bg-accent group-open/sub:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground flex cursor-default list-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&::-webkit-details-marker]:hidden",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </summary>
  );
}

interface DropdownMenuSubContentProps extends React.HTMLAttributes<HTMLDivElement> {}

function DropdownMenuSubContent({
  className,
  ...props
}: DropdownMenuSubContentProps) {
  return (
    <div
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "bg-popover text-popover-foreground absolute top-0 left-full z-50 ml-1 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-lg",
        className
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
export type {
  DropdownMenuProps,
  DropdownMenuTriggerProps,
  DropdownMenuContentProps,
  DropdownMenuGroupProps,
  DropdownMenuItemProps,
  DropdownMenuCheckboxItemProps,
  DropdownMenuRadioGroupProps,
  DropdownMenuRadioItemProps,
  DropdownMenuLabelProps,
  DropdownMenuSeparatorProps,
  DropdownMenuShortcutProps,
  DropdownMenuSubProps,
  DropdownMenuSubTriggerProps,
  DropdownMenuSubContentProps,
};
