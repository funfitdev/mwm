const isDev = process.env.NODE_ENV !== "production";

const liveReloadScript = `
  (function() {
    const ws = new WebSocket("ws://" + location.host + "/__reload");
    ws.onmessage = (e) => { if (e.data === "reload") location.reload(); };
    ws.onclose = () => setTimeout(() => location.reload(), 1000);
  })();
`;

const alpineTransformScript = `
  // Transform data-x-* attributes to x-* before Alpine initializes
  (function() {
    function transformAlpineAttrs() {
      document.querySelectorAll('[data-x-data]').forEach(el => {
        el.setAttribute('x-data', el.getAttribute('data-x-data'));
      });
      document.querySelectorAll('[data-x-bind]').forEach(el => {
        const value = el.getAttribute('data-x-bind');
        const colonIdx = value.indexOf(':');
        if (colonIdx > -1) {
          const attr = value.substring(0, colonIdx);
          const expr = value.substring(colonIdx + 1);
          el.setAttribute('x-bind:' + attr, expr);
        }
      });
      document.querySelectorAll('[data-x-on]').forEach(el => {
        const value = el.getAttribute('data-x-on');
        const colonIdx = value.indexOf(':');
        if (colonIdx > -1) {
          const event = value.substring(0, colonIdx);
          const expr = value.substring(colonIdx + 1);
          el.setAttribute('x-on:' + event, expr);
        }
      });
    }
    // Run immediately as DOM is already loaded (SSR)
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', transformAlpineAttrs);
    } else {
      transformAlpineAttrs();
    }
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
        <script dangerouslySetInnerHTML={{ __html: alpineTransformScript }} />
        <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js" />
        {isDev && (
          <script dangerouslySetInnerHTML={{ __html: liveReloadScript }} />
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
