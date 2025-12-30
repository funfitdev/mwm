import * as React from "react";

import { cn } from "@/lib/utils";

interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function Tooltip({ className, children, ...props }: TooltipProps) {
  return (
    <div
      data-slot="tooltip"
      className={cn("group/tooltip relative inline-block", className)}
      {...props}
    >
      {children}
    </div>
  );
}

interface TooltipTriggerProps extends React.HTMLAttributes<HTMLSpanElement> {}

function TooltipTrigger({ className, children, ...props }: TooltipTriggerProps) {
  return (
    <span
      data-slot="tooltip-trigger"
      className={cn("inline-flex", className)}
      {...props}
    >
      {children}
    </span>
  );
}

interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
}

function TooltipContent({
  className,
  children,
  side = "top",
  sideOffset = 4,
  ...props
}: TooltipContentProps) {
  const offsetStyle = {
    "--tooltip-offset": `${sideOffset}px`,
  } as React.CSSProperties;

  return (
    <div
      data-slot="tooltip-content"
      data-side={side}
      role="tooltip"
      style={offsetStyle}
      className={cn(
        "bg-foreground text-background pointer-events-none absolute z-50 w-max max-w-xs scale-95 rounded-md px-3 py-1.5 text-xs text-balance opacity-0 transition-all duration-150",
        "group-hover/tooltip:scale-100 group-hover/tooltip:opacity-100",
        "group-focus-within/tooltip:scale-100 group-focus-within/tooltip:opacity-100",
        side === "top" &&
          "bottom-full left-1/2 mb-[var(--tooltip-offset)] -translate-x-1/2",
        side === "bottom" &&
          "top-full left-1/2 mt-[var(--tooltip-offset)] -translate-x-1/2",
        side === "left" &&
          "right-full top-1/2 mr-[var(--tooltip-offset)] -translate-y-1/2",
        side === "right" &&
          "left-full top-1/2 ml-[var(--tooltip-offset)] -translate-y-1/2",
        className
      )}
      {...props}
    >
      {children}
      <TooltipArrow side={side} />
    </div>
  );
}

interface TooltipArrowProps {
  side?: "top" | "right" | "bottom" | "left";
}

function TooltipArrow({ side = "top" }: TooltipArrowProps) {
  return (
    <div
      data-slot="tooltip-arrow"
      className={cn(
        "bg-foreground absolute size-2 rotate-45 rounded-[2px]",
        side === "top" && "top-full left-1/2 -translate-x-1/2 -translate-y-1/2",
        side === "bottom" &&
          "bottom-full left-1/2 -translate-x-1/2 translate-y-1/2",
        side === "left" &&
          "left-full top-1/2 -translate-x-1/2 -translate-y-1/2",
        side === "right" &&
          "right-full top-1/2 translate-x-1/2 -translate-y-1/2"
      )}
    />
  );
}

// Simple tooltip using native title attribute (no styling control but works everywhere)
interface SimpleTooltipProps extends React.HTMLAttributes<HTMLSpanElement> {
  content: string;
}

function SimpleTooltip({
  content,
  children,
  className,
  ...props
}: SimpleTooltipProps) {
  return (
    <span
      data-slot="simple-tooltip"
      title={content}
      className={cn("inline-flex", className)}
      {...props}
    >
      {children}
    </span>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, SimpleTooltip };
export type {
  TooltipProps,
  TooltipTriggerProps,
  TooltipContentProps,
  SimpleTooltipProps,
};
