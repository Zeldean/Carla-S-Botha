// Writes AVIF + WebP variants next to every image in dist/client/paintings (spec §10.2).
// The originals in public/ stay untouched; they remain the <img> fallback.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { VARIANT_FORMATS, variantPath, variantWidths } from "../src/lib/images.js";

const QUALITY = { avif: { quality: 55, effort: 4 }, webp: { quality: 78 } };

export async function optimizeImages(clientDir) {
  const paintings = path.join(clientDir, "paintings");
  const files = fs.readdirSync(paintings, { recursive: true })
    .filter((f) => /\.(png|jpe?g|webp)$/i.test(f) && !/-\d+w\.(avif|webp)$/.test(f))
    .map((f) => path.join(paintings, f));

  let before = 0;
  let after = 0;
  await Promise.all(
    files.map(async (file) => {
      const { width } = await sharp(file).metadata();
      before += fs.statSync(file).size;
      for (const w of variantWidths(width)) {
        for (const format of VARIANT_FORMATS) {
          const out = variantPath(file, w, format);
          await sharp(file).resize({ width: w }).toFormat(format, QUALITY[format]).toFile(out);
          if (w === 800 && format === "webp") after += fs.statSync(out).size;
        }
      }
    }),
  );

  const mb = (n) => (n / 1024 / 1024).toFixed(1);
  console.log(`images: ${files.length} sources (${mb(before)} MB) → variants; 800w WebP total ${mb(after)} MB`);
}
