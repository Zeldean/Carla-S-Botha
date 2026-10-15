// Small rehype plugins for page bodies. They work on the HTML tree (hast) that
// react-markdown builds from the Markdown, before React renders it.

const textOf = (node) =>
  node.type === "text" ? node.value : (node.children ?? []).map(textOf).join("");

const isHeading = (node, tags) => node.type === "element" && tags.includes(node.tagName);

/** Wraps each `## heading` and everything up to the next one in a <section>. Text before the first h2 becomes the intro section. */
export function rehypeSections() {
  return (tree) => {
    const sections = [];
    let current = null;
    for (const node of tree.children) {
      if (isHeading(node, ["h2"]) || !current) {
        current = { type: "element", tagName: "section", properties: {}, children: [] };
        sections.push(current);
      }
      current.children.push(node);
    }
    tree.children = sections.filter((section) => section.children.some((n) => n.type === "element"));
  };
}

/** Gives each table a (visually hidden) <caption> from the nearest heading before it, so screen readers announce what the prices are for. */
export function rehypeTableCaptions() {
  return (tree) => {
    const visit = (parent) => {
      let lastHeading = null;
      for (const node of parent.children ?? []) {
        if (isHeading(node, ["h2", "h3", "h4"])) lastHeading = textOf(node);
        if (node.type === "element" && node.tagName === "table" && lastHeading) {
          node.children.unshift({
            type: "element",
            tagName: "caption",
            properties: { className: ["visually-hidden"] },
            children: [{ type: "text", value: lastHeading }],
          });
        }
        visit(node);
      }
    };
    visit(tree);
  };
}
