import { Link } from "react-router-dom";
import Icon from "./Icon";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useTheme } from "../contexts/ThemeContext.jsx";
import { useFavorites } from "../contexts/FavoriteContext.jsx";
import aksaraHubLogo from "../assets/AksaraHub Logo.png";

export default function Header({
  activePage = "home",
  drawerOpen = false,
  onToggleDrawer,
}) {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { favoriteCount } = useFavorites();
  const navLinks = [
    { to: "/", page: "home", label: "Beranda", icon: "home" },
    { to: "/books", page: "katalog", label: "Katalog API", icon: "cloud" },
    { to: "/favorites", page: "favorit", label: "Favorit", icon: "heart" },
    { to: "/about", page: "tentang", label: "Tentang", icon: "info" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-accent/30 bg-primary/95 backdrop-blur-sm shadow-book">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 overflow-hidden rounded-lg bg-white flex items-center justify-center shadow-book ring-1 ring-white/20 transition-transform duration-200 group-hover:scale-105">
              <img
                src={aksaraHubLogo}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="h-full w-full scale-[1.55] object-cover"
              />
            </div>
            <div>
              <span className="font-playfair font-extrabold text-xl tracking-tight text-white">
                AksaraHub
              </span>
              <span className="hidden sm:block text-[10px] tracking-[0.16em] uppercase text-white/55 -mt-0.5">
                Digital Library
              </span>
            </div>
          </Link>

          <nav
            aria-label="Navigasi utama"
            className="hidden md:flex items-center gap-1 bg-white/10 rounded-lg p-1"
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                aria-current={activePage === link.page ? "page" : undefined}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold font-crimson rounded-md text-white/75 hover:bg-white hover:text-primary hover:shadow-sm transition-all duration-200 ${
                  activePage === link.page
                    ? "nav-link-active bg-white text-primary shadow-sm"
                    : ""
                }`}
              >
                <Icon name={link.icon} className="w-4 h-4" />
                {link.label}
                {link.page === "favorit" && (
                  <span
                    className="ml-0.5 inline-flex min-w-5 items-center justify-center rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-white"
                    aria-label={`${favoriteCount} buku favorit`}
                  >
                    {favoriteCount}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white/80 shadow-sm transition-all duration-200 hover:border-accent hover:bg-white hover:text-primary"
              aria-label={
                isDarkMode ? "Aktifkan light mode" : "Aktifkan dark mode"
              }
              aria-pressed={isDarkMode}
              onClick={toggleTheme}
            >
              <Icon
                name={isDarkMode ? "sun" : "moon"}
                className="h-4 w-4"
                strokeWidth={2}
              />
            </button>

            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold text-white/80 shadow-sm">
                <Icon name="users" className="h-3.5 w-3.5" />
                <span className="max-w-24 truncate">{user?.name}</span>
                <button
                  type="button"
                  className="ml-1 text-xs text-white/60 transition-colors hover:text-accent"
                  onClick={logout}
                >
                  Keluar
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold text-white/80 shadow-sm transition-all duration-200 hover:border-accent hover:bg-white hover:text-primary"
              >
                <Icon name="users" className="h-3.5 w-3.5" />
                Masuk
              </Link>
            )}

            <button
              type="button"
              aria-label={
                drawerOpen ? "Tutup menu navigasi" : "Buka menu navigasi"
              }
              aria-expanded={drawerOpen}
              aria-controls="mobile-drawer"
              onClick={onToggleDrawer}
              className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              <div className="w-5 flex flex-col gap-1.5">
                <span
                  className={`block h-0.5 bg-white rounded transition-all duration-300 ${
                    drawerOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 bg-white rounded transition-all duration-300 ${
                    drawerOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 bg-white rounded transition-all duration-300 ${
                    drawerOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
