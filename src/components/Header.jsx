import { useState } from "react";
import Icon from "./Icon";
import aksaraHubLogo from "../assets/AksaraHub Logo.png";

export default function Header({
  favoriteCount = 0,
  isDarkMode = false,
  onToggleTheme,
  activePage = "home",
  currentUser,
  onLogout,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "#/", page: "home", label: "Beranda", icon: "home" },
    { href: "#/katalog", page: "katalog", label: "Katalog API", icon: "cloud" },
    { href: "#/favorit", page: "favorit", label: "Favorit", icon: "heart" },
    { href: "#/tentang", page: "tentang", label: "Tentang", icon: "info" },
  ];

  const handleNavClick = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-accent/30 bg-primary/95 backdrop-blur-sm shadow-book">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <a href="#/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 overflow-hidden rounded-lg bg-white flex items-center justify-center shadow-book ring-1 ring-white/20 transition-transform duration-200 group-hover:scale-105">
              <img
                src={aksaraHubLogo}
                alt=""
                aria-hidden="true"
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
          </a>

          <nav
            aria-label="Navigasi utama"
            className="hidden md:flex items-center gap-1 bg-white/10 rounded-lg p-1"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
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
              </a>
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
              onClick={onToggleTheme}
            >
              <Icon
                name={isDarkMode ? "sun" : "moon"}
                className="h-4 w-4"
                strokeWidth={2}
              />
            </button>

            {currentUser ? (
              <div className="hidden sm:flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold text-white/80 shadow-sm">
                <Icon name="users" className="h-3.5 w-3.5" />
                <span className="max-w-24 truncate">{currentUser.name}</span>
                <button
                  type="button"
                  className="ml-1 text-xs text-white/60 transition-colors hover:text-accent"
                  onClick={onLogout}
                >
                  Keluar
                </button>
              </div>
            ) : (
              <a
                href="#/login"
                className="hidden sm:flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold text-white/80 shadow-sm transition-all duration-200 hover:border-accent hover:bg-white hover:text-primary"
              >
                <Icon name="users" className="h-3.5 w-3.5" />
                Masuk
              </a>
            )}

            <button
              type="button"
              aria-label={menuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              <div className="w-5 flex flex-col gap-1.5">
                <span
                  className={`block h-0.5 bg-white rounded transition-all duration-300 ${
                    menuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 bg-white rounded transition-all duration-300 ${
                    menuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 bg-white rounded transition-all duration-300 ${
                    menuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Navigasi mobile"
        className={`md:hidden border-t border-white/10 bg-primary transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-56 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-2 grid grid-cols-5 gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleNavClick}
              aria-current={activePage === link.page ? "page" : undefined}
              className={`flex flex-col items-center gap-1 py-2 text-xs font-semibold font-crimson text-white/70 rounded-lg hover:bg-white/10 hover:text-accent transition-colors duration-200 ${
                activePage === link.page ? "bg-white/10 text-accent" : ""
              }`}
            >
              <Icon name={link.icon} className="w-4 h-4" />
              <span className="inline-flex items-center gap-1">
                {link.label}
                {link.page === "favorit" && (
                  <span className="inline-flex min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                    {favoriteCount}
                  </span>
                )}
              </span>
            </a>
          ))}

          {currentUser ? (
            <button
              type="button"
              onClick={() => {
                onLogout?.();
                handleNavClick();
              }}
              className="flex flex-col items-center gap-1 py-2 text-xs font-semibold font-crimson text-white/70 rounded-lg hover:bg-white/10 hover:text-accent transition-colors duration-200"
            >
              <Icon name="users" className="w-4 h-4" />
              <span>Keluar</span>
            </button>
          ) : (
            <a
              href="#/login"
              onClick={handleNavClick}
              aria-current={activePage === "login" ? "page" : undefined}
              className={`flex flex-col items-center gap-1 py-2 text-xs font-semibold font-crimson text-white/70 rounded-lg hover:bg-white/10 hover:text-accent transition-colors duration-200 ${
                activePage === "login" ? "bg-white/10 text-accent" : ""
              }`}
            >
              <Icon name="users" className="w-4 h-4" />
              <span>Masuk</span>
            </a>
          )}
        </div>
      </nav>
    </header>
  );
}
