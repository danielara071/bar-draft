import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSession } from "../../hooks/useSession";
import { LoginButton } from "../Buttons";

const navItems = [
  { name: "Inicio",      path: "/" },
  { name: "Joc!",        path: "/wordle" },
  { name: "RA",          path: "/ra" },
  { name: "Reels",       path: "/reels" },
  { name: "Watch Party", path: "/WatchParty" },
  { name: "Tienda",      path: "/tienda" },
  { name: "Perfil",      path: "/perfil" },
];

const Navbar = () => {
  const navItems = [
    { name: "Inicio", path: "/" },
    { name: "Sports API", path: "/sportsapi" },
    { name: "ChatBot", path: "/chat" },
    { name: "Tienda", path: "/tienda" },
    { name: "Watch Party", path: "/WatchParty" },
    { name: "Wordle", path: "/wordle" },
    { name: "RA", path: "/ra" },
    { name: "Reels", path: "/reels" },
  ];

  return (
    <>
      {/* navbar */}
      <nav
        className={`fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[95vw] max-w-3xl lg:max-w-5xl bg-white rounded-full border border-slate-200 shadow-md px-4 h-14 flex items-center justify-between  transition-all duration-300
          ${isVisible ? "opacity-100" : "opacity-0"}`}
      >
        {/* logo + links */}
        <div className="flex items-center gap-4 px-2">
          <img src="https://upload.wikimedia.org/wikipedia/sco/4/47/FC_Barcelona_%28crest%29.svg" className="w-8 h-8 hover:w-9 hover:h-9 transition-all duration-300" onClick={() => navigate("/")} />
          
          {/* links en normal */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="hover:text-brand-crimson text-sm font-bold px-3 py-1.5 rounded-lg"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* monedas o login + menu hamburguesa  */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <div className="flex items-center gap-1.5 rounded-full px-3 py-1">
              <span>🪙</span>
              <span className="text-sm font-semibold">{coins} Monedas</span>
            </div>
          ) : (
            <LoginButton onClick={() => navigate("/")} size="sm">Iniciar Sesión</LoginButton>
          )}

          {/* boton menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-8 h-8 flex flex-col justify-center items-center gap-1.5 rounded-lg hover:bg-slate-200"
          >
            <span className={`block h-0.5 w-5 bg-slate-700 transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-0.5 w-5 bg-slate-700 transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-slate-700 transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </nav>

      {/* menu */}
      {menuOpen && isVisible && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[90vw] max-w-sm bg-white rounded-2xl border border-slate-200 shadow-md p-3 flex flex-col gap-1 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className="hover:text-brand-crimson text-sm font-medium px-3 py-1.5 rounded-lg"
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default Navbar;