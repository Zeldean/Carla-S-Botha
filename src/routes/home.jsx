import Room from "../components/Room";
import { rooms } from "../lib/content";
import { buildMeta } from "../lib/meta";

export const meta = () => buildMeta({ description: rooms.home.intro, image: rooms.home.artworks[0]?.image, path: "/" });

export default function Home() {
  return <Room room={rooms.home} />;
}
