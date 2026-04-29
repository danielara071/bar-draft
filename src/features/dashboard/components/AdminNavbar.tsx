import { Link, useLocation } from "react-router-dom";

const navItems = [{ name: "Reels", path: "/dashboard/reels" },
  { name: "Regresar a Inicio", path: "/" }
];

const AdminNavbar = () => {
  const { pathname } = useLocation();

  return (
    <aside className="flex min-h-screen w-72 flex-col border-r border-white/10 bg-brand-navy px-5 py-6 text-white shadow-2xl mr-3">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg">
          <img
            src="https://upload.wikimedia.org/wikipedia/sco/4/47/FC_Barcelona_%28crest%29.svg"
            className="w-8 h-8 hover:w-9 hover:h-9 transition-all duration-300"
          />
        </div>

        <div>
          <h1 className="font-sans text-lg font-extrabold uppercase tracking-[0.1em] text-brand-white">
            Barcelona
          </h1>
        </div>
      </div>

      <div className="mt-8">
        <p className="mb-3 text-[0.7rem] uppercase tracking-spaced text-white/40">
          Administrador
        </p>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive =
              item.path === "/"
                ? pathname === item.path
                : pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex min-h-11 items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "border-white/10 bg-white/10 text-brand-white"
                    : "border-transparent text-white/75 hover:border-white/10 hover:bg-white/10 hover:text-brand-white"
                }`}
              >
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default AdminNavbar;
