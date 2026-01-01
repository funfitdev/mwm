import * as React from "react";

import { cn } from "@/lib/utils";

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Default tab value to show when no URL param exists */
  defaultValue?: string;
  /** Name for hidden input and URL query param (defaults to "tab") */
  name?: string;
}

function Tabs({
  className,
  defaultValue,
  name = "tab",
  children,
  ...props
}: TabsProps) {
  return (
    <div
      data-slot="tabs"
      data-name={name}
      data-default-value={defaultValue}
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      <input type="hidden" name={name} defaultValue={defaultValue} />
      {React.Children.map(children, (child) => {
        if (React.isValidElement<TabsListProps>(child)) {
          return React.cloneElement(child, {
            _tabsName: name,
            _defaultValue: defaultValue,
          } as Partial<TabsListProps>);
        }
        return child;
      })}
    </div>
  );
}

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Internal: passed from Tabs */
  _tabsName?: string;
  /** Internal: passed from Tabs */
  _defaultValue?: string;
}

function TabsList({
  className,
  children,
  _tabsName,
  _defaultValue,
  ...props
}: TabsListProps) {
  return (
    <div
      data-slot="tabs-list"
      role="tablist"
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      )}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement<TabsTriggerProps>(child)) {
          return React.cloneElement(child, {
            _tabsName,
            _defaultValue,
          } as Partial<TabsTriggerProps>);
        }
        return child;
      })}
    </div>
  );
}

interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  /** Internal: passed from TabsList */
  _tabsName?: string;
  /** Internal: passed from TabsList */
  _defaultValue?: string;
}

function TabsTrigger({
  className,
  children,
  value,
  _tabsName,
  _defaultValue,
  ...props
}: TabsTriggerProps) {
  return (
    <button
      type="button"
      role="tab"
      data-slot="tabs-trigger"
      data-value={value}
      data-state={_defaultValue === value ? "active" : "inactive"}
      aria-selected={_defaultValue === value}
      className={cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export { Tabs, TabsList, TabsTrigger };
export type { TabsProps, TabsListProps, TabsTriggerProps };
