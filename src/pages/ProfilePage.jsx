import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useFavorites } from "../contexts/FavoriteContext.jsx";

export default function ProfilePage() {
  const { user } = useAuth();
  const { favoriteBooks } = useFavorites();
  return (
    <section className="mx-auto min-h-[70vh] max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border border-borderSoft bg-white p-8 shadow-book">
          <p className="section-label mb-3">Profil Pengguna</p>
          {user ? (
            <>
              <h1 className="font-playfair text-3xl font-bold text-textMain mb-4">
                {user.name}
              </h1>
              <div className="space-y-3 text-sm text-textSecondary">
                <p>
                  <span className="font-semibold text-textMain">Email:</span>{" "}
                  {user.email}
                </p>
                <p>
                  <span className="font-semibold text-textMain">
                    Login sejak:
                  </span>{" "}
                  {new Date(user.loggedInAt).toLocaleString()}
                </p>
                <p>
                  <span className="font-semibold text-textMain">
                    Buku favorit:
                  </span>{" "}
                  {favoriteBooks.length}
                </p>
              </div>
            </>
          ) : (
            <div className="text-center">
              <p className="font-playfair text-2xl font-semibold text-textMain mb-3">
                Tidak ada profil aktif
              </p>
              <p className="text-textSecondary mb-6">
                Silakan masuk untuk melihat informasi akun dan koleksi favorit.
              </p>
              <Link to="/login" className="btn-primary">
                <Icon name="users" className="h-4 w-4" /> Masuk
              </Link>
            </div>
          )}
        </div>

        <div className="rounded-lg border border-borderSoft bg-white p-8 shadow-book">
          <p className="section-label mb-3">Ringkasan</p>
          <div className="space-y-4 text-sm text-textSecondary">
            <div className="rounded-lg bg-cream p-4">
              <p className="font-semibold text-textMain">Akses Cepat</p>
              <p className="mt-2">
                Kelola buku favorit dan pengaturan akun secara mudah.
              </p>
            </div>
            <div className="rounded-lg bg-cream p-4">
              <p className="font-semibold text-textMain">Alamat Navigasi</p>
              <ul className="space-y-2">
                <li>
                  <Link to="/favorites" className="text-accentHover underline">
                    Rak Favorit
                  </Link>
                </li>
                <li>
                  <Link to="/settings" className="text-accentHover underline">
                    Pengaturan
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
