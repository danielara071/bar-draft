// Navbar.tsx - Single rounded container pill
import { Link } from "react-router-dom";

interface NavItem {
  name: string;
  path: string;
}

const Navbar = () => {
  const navItems = [
    { name: "Inicio", path: "/" },
    { name: "Sports API", path: "/sportsapi" },
    { name: "ChatBot", path: "/chat" },
    { name: "Watch Party", path: "/WatchParty" },
    { name: "Wordle", path: "/wordle" },
    { name: "RA", path: "/ra" },
    { name: "Perfil", path: "/perfil" },
  ];

  return (
    <nav className="fixed top-3 left-1/2 transform -translate-x-1/2 z-20 bg-white/95 backdrop-blur-xl shadow-2xs px-6 py-2 rounded-4xl border border-white/50 w-[90vw] md:w-auto max-w-4xl flex items-center space-x-6">
      <img src="https://upload.wikimedia.org/wikipedia/sco/4/47/FC_Barcelona_%28crest%29.svg" className="w-8 h-8"/>      
      {navItems.map((item, index) => (
        <Link
          to={item.path}
          key={index}
          className="text-slate-800 hover:text-blue-600 font-semibold text-sm md:text-base px-3 py-2 transition-colors duration-200 hover:bg-slate-100/50 rounded-xl"
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
};

export default Navbar;
