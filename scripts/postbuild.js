// Runs after `react-router build` to fit GitHub Pages' static hosting:
// 1. "<slug>/index.html" → "<slug>.html": Pages serves /speeches from speeches.html directly,
//    so shared links don't take a 301 detour to /speeches/.
// 2. 404.html = the SPA fallback: unknown URLs boot the app, which renders its own
//    "not found" page (Pages still sends a real 404 status).
// 3. AVIF/WebP size variants for every painting (scripts/optimize-images.js).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { optimizeImages } from "./optimize-images.js";

const client = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "dist", "client");

let moved = 0;
for (const entry of fs.readdirSync(client, { withFileTypes: true })) {
  const dir = path.join(client, entry.name);
  const index = path.join(dir, "index.html");
  if (!entry.isDirectory() || !fs.existsSync(index) || fs.readdirSync(dir).length !== 1) continue;
  fs.renameSync(index, `${dir}.html`);
  fs.rmdirSync(dir);
  moved++;
}

fs.copyFileSync(path.join(client, "__spa-fallback.html"), path.join(client, "404.html"));
console.log(`postbuild: ${moved} pages → <slug>.html, wrote 404.html`);

await optimizeImages(client);
