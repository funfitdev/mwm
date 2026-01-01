function getOrCreateHiddenInput(group: HTMLElement): HTMLInputElement {
  const name = group.dataset.name;
  if (!name) return null as unknown as HTMLInputElement;

  let input = group.querySelector<HTMLInputElement>('input[type="hidden"]');
  if (!input) {
    input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    group.appendChild(input);
  }
  return input;
}

function getSelectedValues(group: HTMLElement): string[] {
  const items = group.querySelectorAll<HTMLElement>(
    '[data-slot="toggle-group-item"][data-state="on"]'
  );
  return Array.from(items)
    .map((item) => item.dataset.value)
    .filter((v): v is string => !!v);
}

function updateGroupValue(group: HTMLElement) {
  const type = group.dataset.type || "single";
  const values = getSelectedValues(group);
  const input = getOrCreateHiddenInput(group);

  if (input) {
    input.value = type === "multiple" ? JSON.stringify(values) : values[0] || "";
  }

  // Dispatch custom event
  group.dispatchEvent(
    new CustomEvent("toggle-group:change", {
      bubbles: true,
      detail: { value: type === "multiple" ? values : values[0] || null },
    })
  );
}

function setItemState(item: HTMLElement, pressed: boolean) {
  item.dataset.state = pressed ? "on" : "off";
  item.setAttribute("aria-pressed", String(pressed));
}

function handleItemClick(group: HTMLElement, clickedItem: HTMLElement) {
  const type = group.dataset.type || "single";
  const currentState = clickedItem.dataset.state === "on";

  if (type === "single") {
    // For single selection, deselect all others and toggle clicked
    const items = group.querySelectorAll<HTMLElement>(
      '[data-slot="toggle-group-item"]'
    );
    items.forEach((item) => {
      if (item === clickedItem) {
        // Toggle the clicked item (allow deselection)
        setItemState(item, !currentState);
      } else {
        setItemState(item, false);
      }
    });
  } else {
    // For multiple selection, just toggle the clicked item
    setItemState(clickedItem, !currentState);
  }

  updateGroupValue(group);
}

function initToggleGroup(group: HTMLElement) {
  if (group.dataset.toggleGroupInit) return;
  group.dataset.toggleGroupInit = "true";

  // Initialize hidden input with current state
  updateGroupValue(group);

  // Add click handlers to items
  const items = group.querySelectorAll<HTMLElement>(
    '[data-slot="toggle-group-item"]'
  );

  items.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      if (item.hasAttribute("disabled")) return;
      handleItemClick(group, item);
    });
  });
}

function initAllToggleGroups() {
  const groups = document.querySelectorAll<HTMLElement>(
    '[data-slot="toggle-group"]'
  );
  console.log("[MWM] Found", groups.length, "toggle groups");
  groups.forEach(initToggleGroup);
}

// Expose API globally
declare global {
  interface Window {
    MWMToggleGroup: typeof MWMToggleGroup;
  }
}

const MWMToggleGroup = {
  init: initToggleGroup,
  initAll: initAllToggleGroups,
  getValue: getSelectedValues,
  updateValue: updateGroupValue,
};

window.MWMToggleGroup = MWMToggleGroup;

export function initToggleGroupComponent() {
  initAllToggleGroups();
}

export { MWMToggleGroup };
