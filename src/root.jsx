import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import "@fontsource/bungee/latin-400.css";
import "@fontsource/caveat/latin-400.css";
import "@fontsource-variable/nunito";
import "./styles/global.css";
import MuseumLayout from "./components/MuseumLayout";
import NotFound from "./components/NotFound";
import { DEFAULT_LANG, LANG_BOOT_SCRIPT } from "./lib/lang";

export function Layout({ children }) {
  return (
    // The boot script may switch lang/data-lang before hydration, hence suppressHydrationWarning.
    <html lang={DEFAULT_LANG} data-lang={DEFAULT_LANG} suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <script dangerouslySetInnerHTML={{ __html: LANG_BOOT_SCRIPT }} />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <MuseumLayout>
      <Outlet />
    </MuseumLayout>
  );
}

// Every real page is prerendered, so the SPA fallback (served as 404.html) is only ever
// an unknown URL: bake the not-found page into it so it shows before JavaScript loads.
export function HydrateFallback() {
  return (
    <MuseumLayout>
      <NotFound />
    </MuseumLayout>
  );
}

export function ErrorBoundary() {
  return (
    <MuseumLayout>
      <NotFound />
    </MuseumLayout>
  );
}
