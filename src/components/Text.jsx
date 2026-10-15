// Two ways of showing bilingual text (spec §8.1):
//   <Title>     short labels: both languages always visible, equal weight.
//   <Localized> full content: both rendered, CSS shows only the toggled language.

/** "Oor my / About Me"; shown once when both languages are the same. */
export function Title({ title }) {
  if (title.af === title.en) return <span>{title.af}</span>;
  return (
    <>
      <span lang="af">{title.af}</span>
      <span aria-hidden="true"> / </span>
      <span lang="en">{title.en}</span>
    </>
  );
}

/** A plain string renders as-is; { af, en } renders both, tagged for the toggle. */
export function Localized({ value, as: Tag = "span", ...rest }) {
  if (value == null) return null;
  if (typeof value === "string" || value.af === value.en) {
    return <Tag {...rest}>{typeof value === "string" ? value : value.af}</Tag>;
  }
  return (
    <>
      <Tag {...rest} lang="af" data-l="af">{value.af}</Tag>
      <Tag {...rest} lang="en" data-l="en">{value.en}</Tag>
    </>
  );
}
