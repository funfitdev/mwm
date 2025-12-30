import * as React from "react";

import { cn } from "@/lib/utils";

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Default tab value to show */
  defaultValue?: string;
  /** Name for the radio group (auto-generated if not provided) */
  name?: string;
}

function Tabs({
  className,
  defaultValue,
  name,
  children,
  ...props
}: TabsProps) {
  const tabsName = name || React.useId().replace(/:/g, "");

  return (
    <div
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement<TabsListProps | TabsContentProps>(child)) {
          return React.cloneElement(child, {
            _tabsName: tabsName,
            _defaultValue: defaultValue,
          } as Partial<TabsListProps | TabsContentProps>);
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

interface TabsTriggerProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
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
  const inputId = `${_tabsName}-${value}`;

  return (
    <label
      data-slot="tabs-trigger"
      htmlFor={inputId}
      className={cn(
        "has-[:checked]:bg-background dark:has-[:checked]:text-foreground focus-within:border-ring focus-within:ring-ring/50 focus-within:outline-ring dark:has-[:checked]:border-input dark:has-[:checked]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-within:ring-[3px] focus-within:outline-1 has-[:disabled]:pointer-events-none has-[:disabled]:opacity-50 has-[:checked]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <input
        type="radio"
        name={_tabsName}
        value={value}
        id={inputId}
        defaultChecked={_defaultValue === value}
        className="sr-only"
      />
      {children}
    </label>
  );
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  /** Internal: passed from Tabs */
  _tabsName?: string;
  /** Internal: passed from Tabs */
  _defaultValue?: string;
}

function TabsContent({
  className,
  value,
  _tabsName,
  _defaultValue,
  ...props
}: TabsContentProps) {
  const inputId = `${_tabsName}-${value}`;

  return (
    <div
      data-slot="tabs-content"
      data-value={value}
      className={cn(
        "hidden flex-1 outline-none",
        `has-[input#${inputId}:checked]:block [&:has(input#${inputId}:checked)]:block`,
        className
      )}
      {...props}
    >
      {/* Hidden input to check state via CSS :has() - this is a fallback approach */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            [data-slot="tabs"]:has(input[name="${_tabsName}"][value="${value}"]:checked) [data-slot="tabs-content"][data-value="${value}"] {
              display: block;
            }
            [data-slot="tabs"]:has(input[name="${_tabsName}"][value="${value}"]:not(:checked)) [data-slot="tabs-content"][data-value="${value}"] {
              display: none;
            }
          `,
        }}
      />
      {props.children}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
export type { TabsProps, TabsListProps, TabsTriggerProps, TabsContentProps };
