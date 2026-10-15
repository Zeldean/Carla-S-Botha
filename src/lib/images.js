// Responsive image variants (spec §10.2). Shared by ResponsiveImage (browser) and
// scripts/optimize-images.js (build), so the file names can't drift apart.
// Kept free of browser/Node APIs on purpose.

export const VARIANT_WIDTHS = [400, 800, 1200];
export const VARIANT_FORMATS = ["avif", "webp"];

/** Widths to generate for a source image: never upscale; always at least one. */
export const variantWidths = (sourceWidth) => {
  const widths = VARIANT_WIDTHS.filter((w) => w < sourceWidth);
  return widths.length ? widths : [sourceWidth];
};

/** "/paintings/art/gallery.png", 800, "webp" → "/paintings/art/gallery-800w.webp" */
export const variantPath = (src, width, format) => src.replace(/\.[a-z0-9]+$/i, `-${width}w.${format}`);

/** Only raster artwork under /paintings gets variants (not the SVG placeholder). */
export const hasVariants = (src) => src.startsWith("/paintings/") && !src.endsWith(".svg");
