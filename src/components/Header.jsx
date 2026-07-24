import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Icon from "./Icon";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useTheme } from "../contexts/ThemeContext.jsx";
import { useNotification } from "../contexts/NotificationContext.jsx";
import { ROLES } from "../constants/roles.js";

export default function Header({
  activePage = "home",
  drawerOpen = false,
  onToggleDrawer,
}) {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { unreadCount } = useNotification();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAvatarDropdown, setShowAvatarDropdown] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    logout();
    setShowAvatarDropdown(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-borderSoft bg-cream/90 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center gap-3 max-w-md">
          <button
            type="button"
            aria-label={
              drawerOpen ? "Tutup menu navigasi" : "Buka menu navigasi"
            }
            aria-expanded={drawerOpen}
            aria-controls="mobile-drawer"
            onClick={onToggleDrawer}
            className="rounded-lg p-2 text-textMain transition-colors hover:bg-white lg:hidden"
          >
            <div className="flex w-5 flex-col gap-1.5">
              <span
                className={`block h-0.5 rounded bg-textMain transition-all duration-300 ${
                  drawerOpen ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`block h-0.5 rounded bg-textMain transition-all duration-300 ${
                  drawerOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 rounded bg-textMain transition-all duration-300 ${
                  drawerOpen ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </div>
          </button>

          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative w-full">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              <input
                type="search"
                placeholder="Cari buku..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-borderSoft bg-white text-sm text-textMain placeholder-textSecondary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>
          </form>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-borderSoft bg-white text-textSecondary shadow-sm transition-all duration-200 hover:border-accent hover:text-accentHover"
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

          <button
            type="button"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-borderSoft bg-white text-textSecondary shadow-sm transition-all duration-200 hover:border-accent hover:text-accentHover"
            aria-label={`${unreadCount} notifikasi belum dibaca`}
          >
            <Icon name="bell" className="h-4 w-4" strokeWidth={2} />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-accentHover px-1 text-[9px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAvatarDropdown(!showAvatarDropdown)}
                className="flex items-center gap-2 rounded-full border border-borderSoft bg-white py-1.5 pl-1.5 pr-3 shadow-sm transition-all duration-200 hover:border-accent"
                aria-expanded={showAvatarDropdown}
                aria-haspopup="true"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {(user?.name || "?").charAt(0).toUpperCase()}
                </span>
                <span className="hidden max-w-24 truncate text-sm font-semibold text-textMain sm:inline">
                  {user?.name}
                </span>
                <Icon
                  name="chevronDown"
                  className="hidden h-3.5 w-3.5 text-textSecondary sm:inline"
                />
              </button>

              {showAvatarDropdown && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-borderSoft bg-white shadow-book py-1 z-50">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-textMain hover:bg-cream"
                    onClick={() => setShowAvatarDropdown(false)}
                  >
                    <Icon name="users" className="h-4 w-4" />
                    Profil
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-textMain hover:bg-cream"
                    onClick={() => setShowAvatarDropdown(false)}
                  >
                    <Icon name="monitor" className="h-4 w-4" />
                    Pengaturan
                  </Link>
                  {user?.role === ROLES.ADMIN && (
                    <Link
                      to="/admin/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary hover:bg-cream"
                      onClick={() => setShowAvatarDropdown(false)}
                    >
                      <Icon name="shield" className="h-4 w-4" />
                      Panel Admin
                    </Link>
                  )}
                  <hr className="border-borderSoft my-1" />
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-accentHover hover:bg-cream"
                  >
                    <Icon name="logOut" className="h-4 w-4" />
                    Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 rounded-full border border-borderSoft bg-white px-3 py-2 text-sm font-semibold text-textSecondary shadow-sm transition-all duration-200 hover:border-accent hover:text-accentHover"
            >
              <Icon name="users" className="h-3.5 w-3.5" />
              Masuk
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
