import * as React from "react";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface DropdownMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function DropdownMenu({ children, className, ...props }: DropdownMenuProps) {
  return (
    <div
      data-slot="dropdown-menu"
      className={cn("relative", className)}
      {...props}
    >
      {children}
    </div>
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
  const triggerProps = {
    "data-slot": "dropdown-menu-trigger",
    "aria-expanded": false as boolean,
    "aria-haspopup": "menu" as const,
    className,
    ...props,
  };

  if (asChild) {
    const child = React.Children.only(children);
    if (React.isValidElement(child)) {
      const childProps = child.props as any;
      return React.cloneElement(child as React.ReactElement<any>, {
        ...triggerProps,
        className: cn(childProps.className, className),
      });
    }
    return children;
  }

  return (
    <button type="button" {...triggerProps}>
      {children}
    </button>
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
  sideOffset = 4,
  side = "bottom",
  align = "start",
  ...props
}: DropdownMenuContentProps) {
  return (
    <div
      data-slot="dropdown-menu-content"
      data-side={side}
      data-align={align}
      data-side-offset={sideOffset}
      data-state="closed"
      role="menu"
      className={cn(
        "bg-popover text-popover-foreground absolute z-50 min-w-32 overflow-hidden rounded-md border p-1 shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        className
      )}
      style={{ display: 'none' }}
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
  return (
    <button
      type="button"
      data-slot="dropdown-menu-item"
      data-inset={inset ? "" : undefined}
      data-variant={variant}
      data-close-on-click={closeOnClick ? undefined : "false"}
      role="menuitem"
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
  closeOnClick?: boolean;
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  closeOnClick = true,
  ...props
}: DropdownMenuCheckboxItemProps) {
  return (
    <button
      type="button"
      data-slot="dropdown-menu-checkbox-item"
      data-checked={checked ? "" : undefined}
      data-close-on-click={closeOnClick ? undefined : "false"}
      role="menuitemcheckbox"
      aria-checked={checked}
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
}

function DropdownMenuRadioGroup({
  className,
  ...props
}: DropdownMenuRadioGroupProps) {
  return (
    <div
      data-slot="dropdown-menu-radio-group"
      role="radiogroup"
      className={className}
      {...props}
    />
  );
}

interface DropdownMenuRadioItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  checked?: boolean;
  closeOnClick?: boolean;
}

function DropdownMenuRadioItem({
  className,
  children,
  value,
  checked,
  closeOnClick = true,
  ...props
}: DropdownMenuRadioItemProps) {
  return (
    <button
      type="button"
      data-slot="dropdown-menu-radio-item"
      data-value={value}
      data-checked={checked ? "" : undefined}
      data-close-on-click={closeOnClick ? undefined : "false"}
      role="menuitemradio"
      aria-checked={checked}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        {checked && <CircleIcon className="size-2 fill-current" />}
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
      data-inset={inset ? "" : undefined}
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

interface DropdownMenuSubProps extends React.HTMLAttributes<HTMLDivElement> {}

function DropdownMenuSub({ className, ...props }: DropdownMenuSubProps) {
  return (
    <div
      data-slot="dropdown-menu-sub"
      className={cn("relative", className)}
      {...props}
    />
  );
}

interface DropdownMenuSubTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  inset?: boolean;
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: DropdownMenuSubTriggerProps) {
  return (
    <button
      type="button"
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset ? "" : undefined}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </button>
  );
}

interface DropdownMenuSubContentProps extends React.HTMLAttributes<HTMLDivElement> {
  sideOffset?: number;
}

function DropdownMenuSubContent({
  className,
  sideOffset = 4,
  ...props
}: DropdownMenuSubContentProps) {
  return (
    <div
      data-slot="dropdown-menu-sub-content"
      data-side="right"
      data-align="start"
      data-side-offset={sideOffset}
      data-state="closed"
      role="menu"
      className={cn(
        "bg-popover text-popover-foreground absolute z-50 min-w-32 overflow-hidden rounded-md border p-1 shadow-lg",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        className
      )}
      style={{ display: 'none' }}
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
