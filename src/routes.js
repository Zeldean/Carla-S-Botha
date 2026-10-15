import { index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.jsx"),
  route(":slug", "routes/destination.jsx"),
  route("*", "routes/not-found.jsx"),
];
