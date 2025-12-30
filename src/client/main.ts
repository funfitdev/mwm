import "htmx.org";
import { initDropdownMenu } from "./dropdown-menu";
import { initSidebarMenu } from "./sidebar";

// Initialize all components on DOM ready
function initAllComponents() {
  console.log("[MWM] Initializing components, readyState:", document.readyState);
  initDropdownMenu();
  initSidebarMenu();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAllComponents);
} else {
  initAllComponents();
}

// Re-initialize after HTMX swaps
document.addEventListener("htmx:afterSettle", () => initAllComponents());
document.addEventListener("htmx:afterSwap", () => initAllComponents());
