// Writes /schemas/<name>.schema.json from the zod schemas, so editors (VSCodium) give
// autocomplete and inline errors in content files via their "$schema" line.
// `npm run check:content` fails if these files are out of date.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { EDITOR_SCHEMAS } from "./content/schemas.js";

export const SCHEMA_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "schemas");

/** { "room.schema.json": "<json text>", … } */
export function renderSchemas() {
  return Object.fromEntries(
    Object.entries(EDITOR_SCHEMAS).map(([name, schema]) => [
      `${name}.schema.json`,
      // draft-7 has the widest editor support; "input" makes fields with defaults optional.
      JSON.stringify(z.toJSONSchema(schema, { target: "draft-7", io: "input" }), null, 2) + "\n",
    ]),
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  fs.mkdirSync(SCHEMA_DIR, { recursive: true });
  for (const [file, text] of Object.entries(renderSchemas())) {
    fs.writeFileSync(path.join(SCHEMA_DIR, file), text);
    console.log(`wrote schemas/${file}`);
  }
}
