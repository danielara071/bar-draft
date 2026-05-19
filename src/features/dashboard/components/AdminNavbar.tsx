import { Link, useLocation } from "react-router-dom";
import { Newspaper, LetterText, UserRound, Video, Home } from "lucide-react";

const navItems = [
  { name: "Reels", path: "/dashboard/reels", icon: Video },
  { name: "Gestión de Noticias", path: "/dashboard/noticias", icon: Newspaper },
  { name: "Palabras Wordle", path: "/dashboard/wordle", icon: LetterText },
];

const AdminNavbar = () => {
  const { pathname } = useLocation();

  return (
    <aside className="sticky top-0 h-screen flex min-h-screen w-64 flex-col border-r border-white/10 bg-brand-navy px-5 py-6 text-white shadow-2xl mr-3">
      <div className="flex items-center gap-3 mb-8">
        <img
          src="https://upload.wikimedia.org/wikipedia/sco/4/47/FC_Barcelona_%28crest%29.svg"
          className="w-8 h-8 shrink-0"
        />
        <h1 className="font-sans text-base font-extrabold uppercase tracking-widest text-white whitespace-nowrap">
          Més Que Un Club
        </h1>
      </div>

      <div className="flex-1">
        <p className="mb-3 text-[0.7rem] uppercase tracking-widest text-white/40">
          Administrador
        </p>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex min-h-11 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-brand-crimson text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={17} className="shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom button */}
      <div className="border-t border-white/10 pt-4">
        <Link
          to="/"
          className="flex min-h-11 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200"
        >
          <UserRound size={17} className="shrink-0" />
          <span>Regresar a Vista Usuario</span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminNavbar;