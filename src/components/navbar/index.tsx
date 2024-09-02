import { Link } from "react-router-dom";
import logo from "/logo.png";

export default function Navbar() {
  return (
    <nav className="py-2 px-2 md:px-8 w-full shadow-sm border-b">
      <Link to="/" className="flex items-center">
        <img
          src={logo}
          alt="crocosoft-logo"
          className="h-10 md:h-16 w-10 md:w-16"
        />
        <p className="text-lg md:text-2xl text-primary font-bold">CROCOSOFT</p>
      </Link>
    </nav>
  );
}
