// `npm run check:content`: validates all content and images without building the site.
// Exits with code 1 on errors (CI stops before deploying); warnings never fail.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadContent } from "./content/load.js";
import { renderSchemas, SCHEMA_DIR } from "./build-schemas.js";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const { errors, warnings, content } = loadContent(root);

for (const [file, text] of Object.entries(renderSchemas())) {
  const current = path.join(SCHEMA_DIR, file);
  if (!fs.existsSync(current) || fs.readFileSync(current, "utf8") !== text) {
    errors.push(`schemas/${file} → is out of date. Run "npm run schemas".`);
  }
}

const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;

for (const warning of warnings) console.log(yellow(`warning  ${warning}`));
for (const error of errors) console.log(red(`error    ${error}`));

const count = (obj) => Object.keys(obj ?? {}).length;
console.log(
  `\n${count(content.rooms)} rooms, ${count(content.pages)} pages, ${count(content.products)} products, ` +
    `${count(content.works)} works, ${count(content.freebies)} freebies · ` +
    `${errors.length} error(s), ${warnings.length} warning(s)`,
);

process.exit(errors.length ? 1 : 0);
