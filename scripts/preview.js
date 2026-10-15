// `npm run preview`: serves dist/client the way GitHub Pages does, so local results match
// production: exact file → "<path>.html" → "<path>/index.html" → 404.html (status 404).
// (`vite preview` answers every path with the home page's HTML, which breaks prerendered pages.)
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "dist", "client");
const port = Number(process.env.PORT) || 4173;
const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp",
  ".woff2": "font/woff2", ".woff": "font/woff", ".json": "application/json", ".pdf": "application/pdf",
};

const isFile = (file) => file.startsWith(root) && fs.existsSync(file) && fs.statSync(file).isFile();

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    const base = path.join(root, urlPath);
    const file = [base, `${base.replace(/\/$/, "")}.html`, path.join(base, "index.html")].find(isFile);
    const status = file ? 200 : 404;
    const served = file ?? path.join(root, "404.html");
    res.writeHead(status, { "Content-Type": TYPES[path.extname(served)] ?? "application/octet-stream" });
    fs.createReadStream(served).pipe(res);
  })
  .listen(port, () => console.log(`Preview (GitHub Pages rules): http://localhost:${port}`));
