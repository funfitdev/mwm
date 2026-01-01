function getTabValueFromUrl(paramName: string): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get(paramName);
}

function updateUrlWithTab(paramName: string, value: string) {
  const url = new URL(window.location.href);
  url.searchParams.set(paramName, value);
  window.location.href = url.toString();
}

function setActiveTab(tabs: HTMLElement, value: string) {
  // Update hidden input
  const input = tabs.querySelector<HTMLInputElement>('input[type="hidden"]');
  if (input) {
    input.value = value;
  }

  // Update trigger states
  const triggers = tabs.querySelectorAll<HTMLElement>(
    '[data-slot="tabs-trigger"]'
  );
  triggers.forEach((trigger) => {
    const isActive = trigger.dataset.value === value;
    trigger.dataset.state = isActive ? "active" : "inactive";
    trigger.setAttribute("aria-selected", String(isActive));
  });
}

function initTabs(tabs: HTMLElement) {
  if (tabs.dataset.tabsInit) return;
  tabs.dataset.tabsInit = "true";

  const paramName = tabs.dataset.name || "tab";
  const defaultValue = tabs.dataset.defaultValue;

  // Get value from URL or use default
  const urlValue = getTabValueFromUrl(paramName);
  const currentValue = urlValue || defaultValue;

  // Set initial active state based on URL or default
  if (currentValue) {
    setActiveTab(tabs, currentValue);
  }

  // Handle trigger clicks - navigate with page refresh
  const triggers = tabs.querySelectorAll<HTMLElement>(
    '[data-slot="tabs-trigger"]'
  );
  triggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      const value = trigger.dataset.value;
      if (value && value !== getTabValueFromUrl(paramName)) {
        updateUrlWithTab(paramName, value);
      }
    });
  });
}

function initAllTabs() {
  const tabsElements = document.querySelectorAll<HTMLElement>(
    '[data-slot="tabs"]'
  );
  console.log("[MWM] Found", tabsElements.length, "tabs");
  tabsElements.forEach(initTabs);
}

// Expose API globally
declare global {
  interface Window {
    MWMTabs: typeof MWMTabs;
  }
}

const MWMTabs = {
  init: initTabs,
  initAll: initAllTabs,
  setActive: setActiveTab,
  getValueFromUrl: getTabValueFromUrl,
};

window.MWMTabs = MWMTabs;

export function initTabsComponent() {
  initAllTabs();
}

export { MWMTabs };
