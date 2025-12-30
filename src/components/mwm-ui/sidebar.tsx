import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { PanelLeftIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";

interface SidebarContextValue {
  sidebarId: string;
  state: "expanded" | "collapsed";
  isMobile: boolean;
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}

interface SidebarProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean;
}

function SidebarProvider({
  defaultOpen = true,
  className,
  style,
  children,
  ...props
}: SidebarProviderProps) {
  const id = React.useId();
  const sidebarId = `sidebar${id.replace(/:/g, "")}`;

  // For SSR/no-JS, we use CSS media queries to determine mobile
  // The state is controlled via CSS :has() and checkbox/popover state
  const contextValue: SidebarContextValue = {
    sidebarId,
    state: defaultOpen ? "expanded" : "collapsed",
    isMobile: false, // Determined by CSS
  };

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        data-slot="sidebar-wrapper"
        style={
          {
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
            "--sidebar-width-mobile": SIDEBAR_WIDTH_MOBILE,
            ...style,
          } as React.CSSProperties
        }
        className={cn(
          "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
}

function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}: SidebarProps) {
  const { sidebarId } = useSidebar();

  if (collapsible === "none") {
    return (
      <div
        data-slot="sidebar"
        className={cn(
          "bg-sidebar text-sidebar-foreground flex h-full w-[var(--sidebar-width)] flex-col",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <>
      {/* Mobile sidebar using popover */}
      <div
        id={sidebarId}
        popover="auto"
        data-slot="sidebar-mobile"
        data-sidebar="sidebar"
        data-side={side}
        className={cn(
          "bg-sidebar text-sidebar-foreground fixed inset-0 z-50 m-0 h-dvh w-[var(--sidebar-width-mobile)] max-h-none max-w-none flex-col p-0",
          "hidden [&:popover-open]:flex md:[&:popover-open]:hidden",
          side === "left" ? "left-0 border-r" : "right-0 left-auto border-l"
        )}
      >
        <div className="flex h-full w-full flex-col">{children}</div>
      </div>

      {/* Desktop sidebar wrapper - contains spacer and fixed content */}
      <div
        data-slot="sidebar"
        data-state="expanded"
        data-collapsible={collapsible}
        data-variant={variant}
        data-side={side}
        className="group peer hidden md:block"
      >
        {/* Spacer to reserve space in flex layout */}
        <div
          data-slot="sidebar-spacer"
          className={cn(
            "relative h-svh w-[var(--sidebar-width)] bg-transparent transition-[width] duration-200 ease-linear",
            "group-data-[collapsible=offcanvas]:group-data-[state=collapsed]:w-0",
            "group-data-[collapsible=icon]:group-data-[state=collapsed]:w-[var(--sidebar-width-icon)]",
            side === "right" && "rotate-180",
            variant === "floating" || variant === "inset"
              ? "group-data-[collapsible=icon]:group-data-[state=collapsed]:w-[calc(var(--sidebar-width-icon)+theme(spacing.4))]"
              : ""
          )}
        />

        {/* Fixed positioned content */}
        <div
          data-slot="sidebar-container"
          className={cn(
            "bg-sidebar text-sidebar-foreground fixed inset-y-0 z-10 hidden h-svh w-[var(--sidebar-width)] flex-col transition-[left,right,width] duration-200 ease-linear md:flex",
            side === "left" ? "left-0" : "right-0",
            "group-data-[collapsible=offcanvas]:group-data-[state=collapsed]:left-[calc(var(--sidebar-width)*-1)]",
            "group-data-[collapsible=icon]:group-data-[state=collapsed]:w-[var(--sidebar-width-icon)]",
            variant === "floating" || variant === "inset"
              ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+theme(spacing.4)+2px)]"
              : side === "left"
                ? "border-r"
                : "border-l",
            className
          )}
          {...props}
        >
          <div
            data-sidebar="sidebar"
            data-slot="sidebar-inner"
            className={cn(
              "flex h-full w-full flex-col",
              variant === "floating" || variant === "inset"
                ? "bg-sidebar border-sidebar-border overflow-hidden rounded-lg border shadow-sm"
                : ""
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

interface SidebarTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

function SidebarTrigger({ className, onClick, ...props }: SidebarTriggerProps) {
  const { sidebarId } = useSidebar();

  return (
    <>
      {/* Mobile trigger - opens popover */}
      <button
        type="button"
        data-sidebar="trigger"
        data-slot="sidebar-trigger-mobile"
        popoverTarget={sidebarId}
        className={cn(
          "inline-flex size-7 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground md:hidden",
          className
        )}
        {...props}
      >
        <PanelLeftIcon className="size-4" />
        <span className="sr-only">Toggle Sidebar</span>
      </button>
      {/* Desktop trigger - toggles checkbox */}
      <label
        htmlFor={`${sidebarId}-toggle`}
        data-sidebar="trigger"
        data-slot="sidebar-trigger-desktop"
        className={cn(
          "hidden size-7 cursor-pointer items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground md:inline-flex",
          className
        )}
      >
        <PanelLeftIcon className="size-4" />
        <span className="sr-only">Toggle Sidebar</span>
      </label>
    </>
  );
}

interface SidebarRailProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

function SidebarRail({ className, ...props }: SidebarRailProps) {
  const { sidebarId } = useSidebar();

  return (
    <label
      htmlFor={`${sidebarId}-toggle`}
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      title="Toggle Sidebar"
      className={cn(
        "hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 cursor-pointer transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex",
        "group-data-[side=left]:-right-4 group-data-[side=right]:left-0",
        className
      )}
      {...props}
    />
  );
}

interface SidebarInsetProps extends React.HTMLAttributes<HTMLElement> {}

function SidebarInset({ className, ...props }: SidebarInsetProps) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        "bg-background relative flex min-h-svh flex-1 flex-col",
        "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))]",
        "md:peer-data-[variant=inset]:m-2",
        "md:peer-data-[variant=inset]:ml-0",
        "md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2",
        "md:peer-data-[variant=inset]:rounded-xl",
        "md:peer-data-[variant=inset]:shadow",
        className
      )}
      {...props}
    />
  );
}

interface SidebarInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

function SidebarInput({ className, ...props }: SidebarInputProps) {
  return (
    <input
      data-slot="sidebar-input"
      data-sidebar="input"
      className={cn(
        "bg-background h-8 w-full rounded-md border px-3 shadow-none text-sm",
        "focus:outline-none focus:ring-2 focus:ring-ring",
        className
      )}
      {...props}
    />
  );
}

interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

function SidebarHeader({ className, ...props }: SidebarHeaderProps) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  );
}

interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

function SidebarFooter({ className, ...props }: SidebarFooterProps) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  );
}

interface SidebarSeparatorProps extends React.HTMLAttributes<HTMLHRElement> {}

function SidebarSeparator({ className, ...props }: SidebarSeparatorProps) {
  return (
    <hr
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className={cn("bg-sidebar-border mx-2 h-px border-0", className)}
      {...props}
    />
  );
}

interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {}

function SidebarContent({ className, ...props }: SidebarContentProps) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto",
        className
      )}
      {...props}
    />
  );
}

interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

function SidebarGroup({ className, ...props }: SidebarGroupProps) {
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props}
    />
  );
}

interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLDivElement> {}

function SidebarGroupLabel({ className, ...props }: SidebarGroupLabelProps) {
  return (
    <div
      data-slot="sidebar-group-label"
      data-sidebar="group-label"
      className={cn(
        "text-sidebar-foreground/70 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium",
        className
      )}
      {...props}
    />
  );
}

interface SidebarGroupActionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

function SidebarGroupAction({ className, ...props }: SidebarGroupActionProps) {
  return (
    <button
      type="button"
      data-slot="sidebar-group-action"
      data-sidebar="group-action"
      className={cn(
        "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0",
        "after:absolute after:-inset-2 md:after:hidden",
        "[&>svg]:size-4 [&>svg]:shrink-0",
        className
      )}
      {...props}
    />
  );
}

interface SidebarGroupContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

function SidebarGroupContent({ className, ...props }: SidebarGroupContentProps) {
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className={cn("w-full text-sm", className)}
      {...props}
    />
  );
}

interface SidebarMenuProps extends React.HTMLAttributes<HTMLUListElement> {}

function SidebarMenu({ className, ...props }: SidebarMenuProps) {
  return (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
    />
  );
}

interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLLIElement> {}

function SidebarMenuItem({ className, ...props }: SidebarMenuItemProps) {
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  );
}

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof sidebarMenuButtonVariants> {
  isActive?: boolean;
  asChild?: boolean;
  tooltip?: string;
}

function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  children,
  ...props
}: SidebarMenuButtonProps) {
  const Comp = asChild ? "span" : "button";

  return (
    <Comp
      type={asChild ? undefined : "button"}
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      title={tooltip}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </Comp>
  );
}

interface SidebarMenuActionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  showOnHover?: boolean;
}

function SidebarMenuAction({
  className,
  showOnHover = false,
  ...props
}: SidebarMenuActionProps) {
  return (
    <button
      type="button"
      data-slot="sidebar-menu-action"
      data-sidebar="menu-action"
      className={cn(
        "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0",
        "after:absolute after:-inset-2 md:after:hidden",
        "[&>svg]:size-4 [&>svg]:shrink-0",
        showOnHover &&
          "peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0",
        className
      )}
      {...props}
    />
  );
}

interface SidebarMenuBadgeProps extends React.HTMLAttributes<HTMLDivElement> {}

function SidebarMenuBadge({ className, ...props }: SidebarMenuBadgeProps) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      className={cn(
        "text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none",
        "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
        className
      )}
      {...props}
    />
  );
}

interface SidebarMenuSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  showIcon?: boolean;
}

function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: SidebarMenuSkeletonProps) {
  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
      {...props}
    >
      {showIcon && (
        <div
          className="bg-sidebar-accent size-4 animate-pulse rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <div
        className="bg-sidebar-accent h-4 flex-1 animate-pulse rounded-md"
        data-sidebar="menu-skeleton-text"
        style={{ maxWidth: `${Math.floor(Math.random() * 40) + 50}%` }}
      />
    </div>
  );
}

interface SidebarMenuSubProps extends React.HTMLAttributes<HTMLUListElement> {}

function SidebarMenuSub({ className, ...props }: SidebarMenuSubProps) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn(
        "border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5",
        className
      )}
      {...props}
    />
  );
}

interface SidebarMenuSubItemProps extends React.HTMLAttributes<HTMLLIElement> {}

function SidebarMenuSubItem({ className, ...props }: SidebarMenuSubItemProps) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cn("group/menu-sub-item relative", className)}
      {...props}
    />
  );
}

interface SidebarMenuSubButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  size?: "sm" | "md";
  isActive?: boolean;
}

function SidebarMenuSubButton({
  size = "md",
  isActive = false,
  className,
  ...props
}: SidebarMenuSubButtonProps) {
  return (
    <a
      data-slot="sidebar-menu-sub-button"
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 focus-visible:ring-2 focus-visible:ring-sidebar-ring disabled:pointer-events-none disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        className
      )}
      {...props}
    />
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};
export type {
  SidebarProps,
  SidebarProviderProps,
  SidebarTriggerProps,
  SidebarRailProps,
  SidebarInsetProps,
  SidebarInputProps,
  SidebarHeaderProps,
  SidebarFooterProps,
  SidebarSeparatorProps,
  SidebarContentProps,
  SidebarGroupProps,
  SidebarGroupLabelProps,
  SidebarGroupActionProps,
  SidebarGroupContentProps,
  SidebarMenuProps,
  SidebarMenuItemProps,
  SidebarMenuButtonProps,
  SidebarMenuActionProps,
  SidebarMenuBadgeProps,
  SidebarMenuSkeletonProps,
  SidebarMenuSubProps,
  SidebarMenuSubItemProps,
  SidebarMenuSubButtonProps,
};
