import { Link } from "react-router-dom";

const Navbar = () => {
  const navItems = [
    { name: "Inicio", path: "/" },
    { name: "Sports API", path: "/sportsapi" },
    { name: "ChatBot", path: "/chat"},
    { name: "Watch Party", path: "/WatchParty" },
    { name: "Wordle", path: "/wordle" },
    { name: "RA", path: "/ra" },
  ];
  return (
    <div className="bg-brand-white h-12 w-full px-6 flex items-center space-x-2 ">
      {navItems.map((item, index) => (
        <Link to={item.path} key={index} className="bg-black rounded-md">
          <p className="text-white p-1">{item.name}</p>
        </Link>
      ))}
    </div>
  );
};

export default Navbar;
