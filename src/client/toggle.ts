function getOrCreateHiddenInput(toggle: HTMLElement): HTMLInputElement {
  const name = toggle.dataset.name;
  if (!name) return null as unknown as HTMLInputElement;

  let input = toggle.querySelector<HTMLInputElement>('input[type="hidden"]');
  if (!input) {
    input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    toggle.appendChild(input);
  }
  return input;
}

function updateToggleState(toggle: HTMLElement, pressed: boolean) {
  toggle.dataset.state = pressed ? "on" : "off";
  toggle.setAttribute("aria-pressed", String(pressed));

  const input = getOrCreateHiddenInput(toggle);
  if (input) {
    input.value = pressed ? "true" : "false";
  }

  // Dispatch custom event
  toggle.dispatchEvent(
    new CustomEvent("toggle:change", {
      bubbles: true,
      detail: { pressed },
    })
  );
}

function togglePressed(toggle: HTMLElement) {
  const currentState = toggle.dataset.state === "on";
  updateToggleState(toggle, !currentState);
}

function initToggle(toggle: HTMLElement) {
  if (toggle.dataset.toggleInit) return;
  toggle.dataset.toggleInit = "true";

  // Initialize hidden input with current state
  const input = getOrCreateHiddenInput(toggle);
  if (input) {
    const pressed = toggle.dataset.state === "on";
    input.value = pressed ? "true" : "false";
  }

  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    if (toggle.hasAttribute("disabled")) return;
    togglePressed(toggle);
  });
}

function initAllToggles() {
  const toggles = document.querySelectorAll<HTMLElement>('[data-slot="toggle"]');
  console.log("[MWM] Found", toggles.length, "toggles");
  toggles.forEach(initToggle);
}

// Expose API globally
declare global {
  interface Window {
    MWMToggle: typeof MWMToggle;
  }
}

const MWMToggle = {
  init: initToggle,
  initAll: initAllToggles,
  setPressed: updateToggleState,
  toggle: togglePressed,
};

window.MWMToggle = MWMToggle;

export function initToggleComponent() {
  initAllToggles();
}

export { MWMToggle };
