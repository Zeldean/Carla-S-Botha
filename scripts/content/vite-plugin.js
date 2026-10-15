// Exposes the validated content index as `import content from "virtual:content"`.
// - build: content errors fail the build; warnings are printed.
// - dev:   errors show in the browser overlay; editing content or images reloads the page.
import path from "node:path";
import { loadContent } from "./load.js";

const VIRTUAL_ID = "virtual:content";
const RESOLVED_ID = "\0" + VIRTUAL_ID;

const formatErrors = (errors) => `Content has ${errors.length} error(s):\n  - ${errors.join("\n  - ")}`;

export default function contentPlugin() {
  let root;
  let isBuild;

  return {
    name: "carla-content",

    configResolved(config) {
      root = config.root;
      isBuild = config.command === "build";
    },

    buildStart() {
      // Validate up front, so a build fails even before any page imports the content.
      if (!isBuild) return;
      const { errors, warnings } = loadContent(root);
      for (const warning of warnings) this.warn(warning);
      if (errors.length) this.error(formatErrors(errors));
    },

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
    },

    load(id) {
      if (id !== RESOLVED_ID) return;
      const { errors, content, watchFiles } = loadContent(root);
      for (const file of watchFiles) this.addWatchFile(file);
      if (errors.length) this.error(formatErrors(errors));
      return `export default ${JSON.stringify(content)};`;
    },

    configureServer(server) {
      const { watchDirs } = loadContent(root);
      server.watcher.add(watchDirs);

      const onChange = (file) => {
        if (!watchDirs.some((dir) => file.startsWith(dir + path.sep))) return;
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (mod) server.moduleGraph.invalidateModule(mod);

        const { errors, warnings } = loadContent(root);
        for (const warning of warnings) server.config.logger.warn(`[content] ${warning}`);
        if (errors.length) server.config.logger.error(`[content] ${formatErrors(errors)}`);
        server.ws.send({ type: "full-reload" });
      };

      server.watcher.on("add", onChange);
      server.watcher.on("change", onChange);
      server.watcher.on("unlink", onChange);
    },
  };
}
