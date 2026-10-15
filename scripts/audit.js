// `npm run audit` (after `npm run build`): accessibility + page-weight check of every route.
//
// Runs axe-core (the rule engine behind Lighthouse's accessibility score) in headless
// Firefox via WebDriver BiDi, for every page × both languages × desktop and phone.
// Exits with code 1 if any WCAG 2.1 A/AA or best-practice rule fails.
// Needs Firefox installed; Chrome/Lighthouse isn't required.
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadContent } from "./content/load.js";
import { startPreview } from "./preview.js";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = 4174;
const BIDI_PORT = 9334;
const VIEWPORTS = { desktop: [1366, 768], phone: [390, 844] };
const AXE_SOURCE = fs.readFileSync(path.join(root, "node_modules/axe-core/axe.min.js"), "utf8");
const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Minimal WebDriver BiDi session against a headless Firefox with its own throwaway profile. */
async function openBrowser([width, height]) {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "audit-ff-"));
  const firefox = spawn(
    "firefox",
    ["--headless", "--no-remote", "-profile", profile, `--window-size=${width},${height}`, "--remote-debugging-port", String(BIDI_PORT)],
    { stdio: "ignore" },
  );
  firefox.on("error", () => {
    console.error("Firefox isn't installed or couldn't start; it's needed for the audit.");
    process.exit(2);
  });

  let ws;
  for (let attempt = 0; attempt < 60 && !ws; attempt++) {
    try {
      const socket = new WebSocket(`ws://127.0.0.1:${BIDI_PORT}/session`);
      await new Promise((ok, fail) => ((socket.onopen = ok), (socket.onerror = fail)));
      ws = socket;
    } catch {
      await sleep(250);
    }
  }

  let id = 0;
  const pending = new Map();
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    pending.get(message.id)?.(message);
    pending.delete(message.id);
  };
  const send = (method, params = {}) =>
    new Promise((resolve) => {
      pending.set(++id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });

  await send("session.new", { capabilities: {} });
  // A fresh tab: the startup tab is about:home, which is privileged and refuses setViewport.
  // --window-size alone isn't honoured by headless Firefox, so the viewport is set explicitly.
  const context = (await send("browsingContext.create", { type: "tab" })).result.context;
  const viewport = await send("browsingContext.setViewport", { context, viewport: { width, height } });
  if (viewport.error) throw new Error(`Couldn't set the ${width}×${height} viewport: ${viewport.message}`);

  return {
    goto: (url) => send("browsingContext.navigate", { context, url, wait: "complete" }),
    evaluate: async (expression) => {
      const reply = await send("script.evaluate", { expression, target: { context }, awaitPromise: true });
      if (reply.result?.type === "exception") throw new Error(reply.result.exceptionDetails.text);
      return reply.result.result.value;
    },
    close: () => {
      ws.close();
      firefox.kill();
      fs.rmSync(profile, { recursive: true, force: true });
    },
  };
}

const AUDIT_PAGE = `(async () => {
  ${AXE_SOURCE}
  const result = await axe.run(document, { runOnly: { type: "tag", values: ${JSON.stringify(AXE_TAGS)} } });
  const bytes = performance.getEntriesByType("navigation").concat(performance.getEntriesByType("resource"))
    .reduce((sum, entry) => sum + (entry.encodedBodySize || 0), 0);
  return JSON.stringify({
    bytes,
    violations: result.violations.map((v) => ({
      id: v.id, impact: v.impact, help: v.help,
      targets: v.nodes.slice(0, 3).map((n) => n.target.join(" ")),
      count: v.nodes.length,
    })),
  });
})()`;

const { content } = loadContent(root);
const routes = ["/", ...[...Object.keys(content.rooms), ...Object.keys(content.pages)].filter((s) => s !== "home").map((s) => `/${s}`), "/this-page-does-not-exist"];

const server = await startPreview(PORT);
const failures = [];
const weights = {};

for (const [viewport, size] of Object.entries(VIEWPORTS)) {
  const browser = await openBrowser(size);
  for (const lang of ["af", "en"]) {
    for (const route of routes) {
      const url = `http://localhost:${PORT}${route}`;
      await browser.goto(url);
      if (lang === "en") {
        await browser.evaluate(`localStorage.setItem("lang", "en"), true`);
        await browser.goto(url);
      }
      await sleep(300);
      const { bytes, violations } = JSON.parse(await browser.evaluate(AUDIT_PAGE));
      if (lang === "af") weights[`${route} ${viewport}`] = bytes;
      for (const v of violations) failures.push({ route, viewport, lang, ...v });
      process.stdout.write(violations.length ? "✗" : "·");
    }
    await browser.evaluate(`localStorage.removeItem("lang"), true`);
  }
  browser.close();
}
server.close();

const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;
console.log(`\n\n${routes.length} routes × 2 languages × ${Object.keys(VIEWPORTS).length} viewports\n`);
console.log("Initial page weight (Afrikaans; uncompressed bytes from the local preview. GitHub Pages gzips JS/CSS to about a third):");
for (const route of routes) {
  console.log(`  ${route.padEnd(28)} desktop ${kb(weights[`${route} desktop`]).padStart(8)}   phone ${kb(weights[`${route} phone`]).padStart(8)}`);
}

if (failures.length === 0) {
  console.log("\nAccessibility: no axe violations (WCAG 2.1 A/AA + best practice).");
} else {
  console.log(`\nAccessibility: ${failures.length} violation(s)`);
  const byRule = Object.groupBy(failures, (f) => f.id);
  for (const [rule, items] of Object.entries(byRule)) {
    console.log(`\n  [${items[0].impact}] ${rule}: ${items[0].help}`);
    for (const f of items.slice(0, 8)) console.log(`    ${f.route} (${f.viewport}, ${f.lang}) ×${f.count}: ${f.targets.join(" | ")}`);
    if (items.length > 8) console.log(`    … and ${items.length - 8} more`);
  }
}
process.exit(failures.length ? 1 : 0);
