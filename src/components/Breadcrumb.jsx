import { Link, useLocation } from "react-router-dom";

const labelMap = {
  "": "Jelajah",
  books: "Katalog",
  favorites: "Favorit",
  about: "Tentang",
  login: "Masuk",
  register: "Daftar",
  profile: "Profil",
  settings: "Pengaturan",
};

function formatSegment(segment, index, segments) {
  if (segment === "books" && segments.length === 2) {
    return "Katalog";
  }
  if (index === 1 && segments[0] === "books") {
    return "Detail Buku";
  }
  return (
    labelMap[segment] ||
    segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
  );
}

export default function Breadcrumb() {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);

  if (pathname === "/") {
    return (
      <div className="rounded-2xl border border-borderSoft bg-white/90 p-3 text-sm text-textSecondary shadow-sm">
        <span className="font-semibold text-textMain">Jelajah</span>
      </div>
    );
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="rounded-2xl border border-borderSoft bg-white/90 px-4 py-3 text-sm text-textSecondary shadow-sm"
    >
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link
            to="/"
            className="text-textSecondary hover:text-accentHover transition-colors"
          >
            Jelajah
          </Link>
        </li>
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const path = `/${segments.slice(0, index + 1).join("/")}`;
          const label = formatSegment(segment, index, segments);

          return (
            <li key={path} className="flex items-center gap-2">
              <span aria-hidden="true" className="text-textSecondary/75">
                /
              </span>
              {isLast ? (
                <span className="font-semibold text-textMain">{label}</span>
              ) : (
                <Link
                  to={path}
                  className="text-textSecondary hover:text-accentHover transition-colors"
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
