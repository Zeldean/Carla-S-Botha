import { hasVariants, VARIANT_FORMATS, variantPath, variantWidths } from "../lib/images";

/**
 * <picture> with AVIF/WebP size variants (generated at build time) and the original as fallback.
 * In dev the variants don't exist yet, so it renders a plain <img>.
 * `image` is a resolved content image: { src, width, height }.
 */
export default function ResponsiveImage({ image, sizes, alt, ...imgProps }) {
  const img = <img src={image.src} width={image.width} height={image.height} alt={alt} {...imgProps} />;
  if (!import.meta.env.PROD || !hasVariants(image.src)) return img;

  const widths = variantWidths(image.width);
  return (
    <picture>
      {VARIANT_FORMATS.map((format) => (
        <source
          key={format}
          type={`image/${format}`}
          sizes={sizes}
          srcSet={widths.map((w) => `${variantPath(image.src, w, format)} ${w}w`).join(", ")}
        />
      ))}
      {img}
    </picture>
  );
}
