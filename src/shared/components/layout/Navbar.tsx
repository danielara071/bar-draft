// Navbar.tsx - Single rounded container pill
import { Link } from "react-router-dom";

const Navbar = () => {
  const navItems = [
    { name: "Inicio", path: "/" },
    { name: "Home", path: "/home"},
    { name: "Sports API", path: "/sportsapi" },
    { name: "ChatBot", path: "/chat" },
    { name: "Watch Party", path: "/WatchParty" },
    { name: "Wordle", path: "/wordle" },
    { name: "RA", path: "/ra" },
    { name: "Reels", path: "/reels" },
  ];

  return (
    <nav className="fixed top-3 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur-xl shadow-2xs px-8 py-2 rounded-4xl border border-white/50  w-fit max-w-[90vw]  whitespace-nowrap flex items-center">
      <div className="flex flex-row items-center space-x-4 overflow-x-auto">
        <img
          src="https://upload.wikimedia.org/wikipedia/sco/4/47/FC_Barcelona_%28crest%29.svg"
          className="w-8 h-8 shrink-0"
        />
        {navItems.map((item, index) => (
          <Link
            to={item.path}
            key={index}
            className="text-slate-800 hover:text-blue-600 font-semibold text-sm md:text-base px-3 py-2 transition-colors duration-200 hover:bg-slate-100/50 rounded-xl"
          >
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
