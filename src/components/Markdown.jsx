import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link } from "react-router";
import { rehypeSections, rehypeTableCaptions } from "../lib/rehype";

// "/art" is a page: navigate inside the app. "/downloads/x.pdf" or https:// is a real link.
const isInternalPage = (href) => href?.startsWith("/") && !/\.[a-z0-9]+$/i.test(href);

const components = {
  a: ({ href, children }) =>
    isInternalPage(href) ? (
      <Link to={href}>{children}</Link>
    ) : (
      <a href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
        {children}
      </a>
    ),
};

/**
 * Page body Markdown: GFM tables for price lists, one <section> per `##` heading,
 * captions on tables. Raw HTML, e.g. TODO comments, is dropped.
 */
export default function Markdown({ children }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSections, rehypeTableCaptions]}
      components={components}
      skipHtml
    >
      {children}
    </ReactMarkdown>
  );
}
