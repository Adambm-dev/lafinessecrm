import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-pink-600 text-white p-4 flex justify-between">
      <Link to="/" className="text-xl font-bold">La Finesse</Link>

      <nav className="flex gap-4">
        <Link to="/">Accueil</Link>
        <Link to="/login">Admin</Link>
      </nav>
    </header>
  );
}
