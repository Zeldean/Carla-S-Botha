import { loadContent } from "./scripts/content/load.js";

// Framework mode as a static site: no server at runtime, every destination is
// prerendered to its own index.html (correct titles and link previews per page).
export default {
  appDirectory: "src",
  buildDirectory: "dist",
  ssr: false,
  async prerender() {
    const { content } = loadContent(process.cwd());
    const slugs = [...Object.keys(content.rooms), ...Object.keys(content.pages)].filter((slug) => slug !== "home");
    return ["/", ...slugs.map((slug) => `/${slug}`)];
  },
};
