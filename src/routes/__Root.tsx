const isDev = process.env.NODE_ENV !== "production";

const liveReloadScript = `
  (function() {
    const ws = new WebSocket("ws://" + location.host + "/__reload");
    ws.onmessage = (e) => { if (e.data === "reload") location.reload(); };
    ws.onclose = () => setTimeout(() => location.reload(), 1000);
  })();
`;

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="apple-touch-icon" href="/apple-icon-180.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <title>mwm</title>
        <link rel="stylesheet" href="/styles.css" />
        <script src="/bundle.js" defer></script>
        {isDev && (
          <script dangerouslySetInnerHTML={{ __html: liveReloadScript }} />
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
