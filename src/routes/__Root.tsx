const isDev = process.env.NODE_ENV !== "production";

const liveReloadScript = `
  (function() {
    const ws = new WebSocket("ws://" + location.host + "/__reload");
    ws.onmessage = (e) => { if (e.data === "reload") location.reload(); };
    ws.onclose = () => setTimeout(() => location.reload(), 1000);
  })();
`;

const dropdownScript = `
(function() {
  const { computePosition, flip, shift, offset } = FloatingUIDOM;

  function getPlacement(content) {
    const side = content.dataset.side || 'bottom';
    const align = content.dataset.align || 'start';
    if (align === 'center') return side;
    return side + '-' + align;
  }

  function positionDropdown(trigger, content) {
    const placement = getPlacement(content);
    const offsetValue = parseInt(content.dataset.sideOffset) || 4;

    computePosition(trigger, content, {
      placement: placement,
      middleware: [
        offset(offsetValue),
        flip({ fallbackAxisSideDirection: 'end' }),
        shift({ padding: 8 })
      ]
    }).then(({ x, y }) => {
      Object.assign(content.style, {
        left: x + 'px',
        top: y + 'px',
      });
    });
  }

  function openDropdown(container) {
    const trigger = container.querySelector('[data-slot="dropdown-menu-trigger"]');
    const content = container.querySelector('[data-slot="dropdown-menu-content"]');
    if (!trigger || !content) return;

    content.style.display = 'block';
    content.dataset.state = 'open';
    trigger.setAttribute('aria-expanded', 'true');
    positionDropdown(trigger, content);
  }

  function closeDropdown(container) {
    const trigger = container.querySelector('[data-slot="dropdown-menu-trigger"]');
    const content = container.querySelector('[data-slot="dropdown-menu-content"]');
    if (!trigger || !content) return;

    content.style.display = 'none';
    content.dataset.state = 'closed';
    trigger.setAttribute('aria-expanded', 'false');
  }

  function toggleDropdown(container) {
    const content = container.querySelector('[data-slot="dropdown-menu-content"]');
    if (!content) return;

    if (content.dataset.state === 'open') {
      closeDropdown(container);
    } else {
      // Close all other dropdowns first
      document.querySelectorAll('[data-slot="dropdown-menu"]').forEach(d => {
        if (d !== container) closeDropdown(d);
      });
      openDropdown(container);
    }
  }

  function initDropdown(container) {
    if (container.dataset.dropdownInit) return;
    container.dataset.dropdownInit = 'true';

    const trigger = container.querySelector('[data-slot="dropdown-menu-trigger"]');
    const content = container.querySelector('[data-slot="dropdown-menu-content"]');
    if (!trigger || !content) return;

    // Toggle on trigger click
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDropdown(container);
    });

    // Close on item click if data-close-on-click is not "false"
    content.addEventListener('click', (e) => {
      const item = e.target.closest('[data-slot="dropdown-menu-item"]');
      if (item && item.dataset.closeOnClick !== 'false') {
        closeDropdown(container);
      }
    });

    // Close on escape
    container.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeDropdown(container);
        trigger.focus();
      }
    });
  }

  function initAllDropdowns() {
    document.querySelectorAll('[data-slot="dropdown-menu"]').forEach(initDropdown);
  }

  // Click outside to close
  document.addEventListener('click', (e) => {
    if (!e.target.closest('[data-slot="dropdown-menu"]')) {
      document.querySelectorAll('[data-slot="dropdown-menu"]').forEach(closeDropdown);
    }
  });

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllDropdowns);
  } else {
    initAllDropdowns();
  }

  // HTMX extension
  document.addEventListener('htmx:afterSettle', (e) => {
    const target = e.detail.target;
    if (target) {
      const dropdown = target.closest('[data-slot="dropdown-menu"]');
      if (dropdown) initDropdown(dropdown);
      target.querySelectorAll('[data-slot="dropdown-menu"]').forEach(initDropdown);
    }
  });

  document.addEventListener('htmx:afterSwap', (e) => {
    const target = e.detail.target;
    if (target) {
      const dropdown = target.closest('[data-slot="dropdown-menu"]');
      if (dropdown) initDropdown(dropdown);
      target.querySelectorAll('[data-slot="dropdown-menu"]').forEach(initDropdown);
    }
  });

  // Expose API
  window.MWMDropdown = {
    init: initDropdown,
    initAll: initAllDropdowns,
    open: openDropdown,
    close: closeDropdown,
    toggle: toggleDropdown,
    position: positionDropdown
  };
})();
`;

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>mwm App</title>
        <link rel="stylesheet" href="/styles.css" />
        <script src="https://cdn.jsdelivr.net/npm/@floating-ui/core@1.6.8/dist/floating-ui.core.umd.min.js" />
        <script src="https://cdn.jsdelivr.net/npm/@floating-ui/dom@1.6.12/dist/floating-ui.dom.umd.min.js" />
        <script dangerouslySetInnerHTML={{ __html: dropdownScript }} />
        {isDev && (
          <script dangerouslySetInnerHTML={{ __html: liveReloadScript }} />
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
