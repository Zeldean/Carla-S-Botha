import Catalogue from "../components/Catalogue";
import FreebieList from "../components/FreebieList";
import InfoPage from "../components/InfoPage";
import NotFound from "../components/NotFound";
import PageView from "../components/PageView";
import Room from "../components/Room";
import { getEntry, site, titleText } from "../lib/content";
import { buildMeta } from "../lib/meta";

// Every room and page lives at /<slug>; the content's `type` decides how it renders.
export const meta = ({ params }) => {
  const entry = getEntry(params.slug);
  if (!entry || entry.slug === "home") return [{ title: `404 — ${site.brand}` }];
  const image = entry.kind === "page" ? entry.image : entry.artworks[0]?.image;
  return buildMeta({ title: titleText(entry.title), description: entry.description ?? entry.intro, image, path: `/${entry.slug}` });
};

export default function Destination({ params }) {
  const entry = getEntry(params.slug);
  // "/home" isn't a URL: the home room lives at "/".
  if (!entry || entry.slug === "home") return <NotFound />;
  if (entry.kind === "room") return <Room key={entry.slug} room={entry} />;
  if (entry.type === "info") return <InfoPage key={entry.slug} page={entry} />;
  if (entry.type === "catalogue") return <Catalogue key={entry.slug} page={entry} />;
  if (entry.type === "freebies") return <FreebieList key={entry.slug} page={entry} />;
  return <PageView key={entry.slug} page={entry} />;
}
