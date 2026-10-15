import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link } from "react-router";

// "/art" is a page: navigate inside the app. "/downloads/x.pdf" or https:// is a real link.
const isInternalPage = (href) => href?.startsWith("/") && !/\.[a-z0-9]+$/i.test(href);

const components = {
  a: ({ href, children }) =>
    isInternalPage(href) ? <Link to={href}>{children}</Link> : <a href={href}>{children}</a>,
};

/** Page body Markdown with GFM tables (price lists). Raw HTML, e.g. TODO comments, is dropped. */
export default function Markdown({ children }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components} skipHtml>
      {children}
    </ReactMarkdown>
  );
}
