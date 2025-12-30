// Sidebar functionality - replaces Alpine.js directives

function initSidebar(wrapper: HTMLElement) {
  if (wrapper.dataset.sidebarInit) return;
  wrapper.dataset.sidebarInit = "true";

  // Parse initial state from data-default-open attribute
  let isOpen = wrapper.dataset.defaultOpen !== "false";

  // Find the desktop sidebar element
  const sidebar = wrapper.querySelector<HTMLElement>('[data-slot="sidebar"]');

  // Update sidebar state
  function setState(open: boolean) {
    isOpen = open;
    if (sidebar) {
      sidebar.dataset.state = open ? "expanded" : "collapsed";
    }
  }

  // Initialize state
  setState(isOpen);

  // Find all toggle triggers (desktop trigger and rail)
  const triggers = wrapper.querySelectorAll<HTMLElement>(
    '[data-slot="sidebar-trigger-desktop"], [data-slot="sidebar-rail"]'
  );

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      setState(!isOpen);
    });
  });
}

function initAllSidebars() {
  const wrappers = document.querySelectorAll<HTMLElement>('[data-slot="sidebar-wrapper"]');
  console.log("[MWM] Found", wrappers.length, "sidebar wrappers");
  wrappers.forEach(initSidebar);
}

// Expose API globally
declare global {
  interface Window {
    MWMSidebar: typeof MWMSidebar;
  }
}

const MWMSidebar = {
  init: initSidebar,
  initAll: initAllSidebars,
};

window.MWMSidebar = MWMSidebar;

export function initSidebarMenu() {
  initAllSidebars();
}

export { MWMSidebar };
