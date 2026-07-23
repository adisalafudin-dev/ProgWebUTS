import { Link, Outlet } from "react-router-dom";
import Icon from "../components/Icon";

export default function AuthLayout({ isDarkMode, onToggleTheme }) {
  return (
    <div className="grid min-h-screen bg-slate-50 dark:bg-slate-950 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-blue-600 p-12 text-white lg:block">
        <Link to="/" className="flex items-center gap-3 font-bold">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-blue-600">
            <Icon name="bookOpen" className="h-5 w-5" />
          </span>
          AksaraHub
        </Link>
        <div className="mt-36 max-w-md">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-200">
            Your reading space
          </p>
          <h1 className="mt-5 text-5xl font-bold leading-tight">
            Satu tempat untuk cerita yang tak habis dibaca.
          </h1>
          <p className="mt-6 leading-7 text-blue-100">
            Kelola bacaan, simpan favorit, dan temukan rekomendasi baru dari
            koleksi kami.
          </p>
        </div>
      </div>
      <div className="relative flex items-center justify-center p-6">
        <button
          type="button"
          onClick={onToggleTheme}
          className="absolute right-6 top-6 text-sm text-slate-500"
        >
          Ubah tema
        </button>
        <Outlet />
      </div>
    </div>
  );
}
