import * as React from "react";

import { cn } from "@/lib/utils";

interface PopoverContextValue {
  popoverId: string;
  anchorName: string;
}

const PopoverContext = React.createContext<PopoverContextValue | null>(null);

function usePopoverContext() {
  const context = React.useContext(PopoverContext);
  if (!context) {
    throw new Error("Popover components must be used within a Popover");
  }
  return context;
}

interface PopoverProps {
  children: React.ReactNode;
}

function Popover({ children }: PopoverProps) {
  const id = React.useId();
  const popoverId = `popover${id.replace(/:/g, "")}`;
  const anchorName = `--anchor${id.replace(/:/g, "")}`;

  return (
    <PopoverContext.Provider value={{ popoverId, anchorName }}>
      <div data-slot="popover" className="relative">
        {children}
      </div>
    </PopoverContext.Provider>
  );
}

interface PopoverTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

function PopoverTrigger({
  className,
  children,
  asChild,
  style,
  ...props
}: PopoverTriggerProps) {
  const { popoverId, anchorName } = usePopoverContext();

  const anchorStyle = {
    ...style,
    anchorName,
  } as React.CSSProperties;

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      popoverTarget: popoverId,
      style: anchorStyle,
    });
  }

  return (
    <button
      type="button"
      data-slot="popover-trigger"
      popoverTarget={popoverId}
      className={className}
      style={anchorStyle}
      {...props}
    >
      {children}
    </button>
  );
}

interface PopoverContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** The preferred side of the anchor to render against */
  side?: "top" | "right" | "bottom" | "left";
  /** The distance in pixels from the anchor */
  sideOffset?: number;
  /** The preferred alignment against the anchor */
  align?: "start" | "center" | "end";
  /** An offset in pixels from the align option */
  alignOffset?: number;
}

function PopoverContent({
  className,
  side = "bottom",
  sideOffset = 0,
  align = "center",
  alignOffset = 0,
  children,
  style,
  ...props
}: PopoverContentProps) {
  return (
    <div
      data-slot="popover-content"
      data-side={side}
      data-align={align}
      data-side-offset={sideOffset}
      data-align-offset={alignOffset}
      data-state="closed"
      className={cn(
        "bg-popover text-popover-foreground absolute z-50 w-72 rounded-md border p-4 shadow-md outline-none",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        className
      )}
      style={{ display: "none", ...style }}
      {...props}
    >
      {children}
    </div>
  );
}

interface PopoverCloseProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

function PopoverClose({ className, children, ...props }: PopoverCloseProps) {
  const { popoverId } = usePopoverContext();

  return (
    <button
      type="button"
      data-slot="popover-close"
      popoverTarget={popoverId}
      popoverTargetAction="hide"
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}

interface PopoverAnchorProps extends React.HTMLAttributes<HTMLDivElement> {}

function PopoverAnchor({ className, style, ...props }: PopoverAnchorProps) {
  const { anchorName } = usePopoverContext();

  return (
    <div
      data-slot="popover-anchor"
      className={className}
      style={{
        ...style,
        anchorName,
      } as React.CSSProperties}
      {...props}
    />
  );
}

export { Popover, PopoverTrigger, PopoverContent, PopoverClose, PopoverAnchor };
export type {
  PopoverProps,
  PopoverTriggerProps,
  PopoverContentProps,
  PopoverCloseProps,
  PopoverAnchorProps,
};
