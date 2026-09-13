import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
      <div className="module">
        <Link to="/Products">
            <h3>SHOP</h3>
        </Link>
      </div>
    </nav>
  );
}
