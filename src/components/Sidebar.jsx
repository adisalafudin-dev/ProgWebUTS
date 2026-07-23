import { Link } from "react-router-dom";
import Icon from "./Icon";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useFavorites } from "../contexts/FavoriteContext.jsx";

const sidebarLinks = [
  { to: "/", page: "home", label: "Beranda", icon: "home" },
  { to: "/dashboard", page: "dashboard", label: "Dashboard", icon: "grid" },
  { to: "/books", page: "katalog", label: "Katalog API", icon: "cloud" },
  { to: "/favorites", page: "favorit", label: "Favorit", icon: "heart" },
  { to: "/about", page: "tentang", label: "Tentang", icon: "info" },
  { to: "/profile", page: "profile", label: "Profil", icon: "users" },
  { to: "/settings", page: "settings", label: "Pengaturan", icon: "monitor" },
];

export default function Sidebar({ activePage = "home", onClose }) {
  const { user, isAuthenticated, logout } = useAuth();
  const { favoriteCount } = useFavorites();

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-borderSoft bg-white p-5 shadow-book">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="section-label">Ringkasan</p>
            <p className="text-sm text-textSecondary">Statistik singkat</p>
          </div>
          <span className="inline-flex h-10 min-w-[2.5rem] items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
            {favoriteCount}
          </span>
        </div>
        <div className="rounded-2xl bg-cream p-4 text-sm text-textSecondary">
          <p className="font-semibold text-textMain">
            {isAuthenticated ? `Halo, ${user?.name}` : "Belum masuk"}
          </p>
          <p className="mt-2 leading-relaxed">
            {isAuthenticated
              ? "Kelola akun dan favorit dengan lebih cepat."
              : "Masuk untuk menyimpan buku dan melihat profil."}
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-borderSoft bg-white p-5 shadow-book">
        <p className="section-label mb-4">Navigasi Cepat</p>
        <div className="space-y-2">
          {sidebarLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => onClose?.()}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors duration-200 ${
                activePage === link.page
                  ? "bg-accent text-white"
                  : "text-textSecondary hover:bg-cream hover:text-textMain"
              }`}
            >
              <Icon name={link.icon} className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {isAuthenticated ? (
        <div className="rounded-3xl border border-borderSoft bg-white p-5 shadow-book">
          <p className="section-label mb-4">Akun</p>
          <button
            type="button"
            onClick={logout}
            className="w-full rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-accentHover"
          >
            Keluar dari Akun
          </button>
        </div>
      ) : null}
    </div>
  );
}
