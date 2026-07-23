import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import aksaraHubLogo from "../assets/AksaraHub Logo.png";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function LoginPage({ onToast, redirectTo = "/" }) {
  const { user, isAuthenticated, login, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const nextRedirect = location.state?.redirectTo || redirectTo;
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (key, value) => {
    setValues((currentValues) => ({ ...currentValues, [key]: value }));
    setMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const email = values.email.trim();
    const password = values.password.trim();

    if (!email || !password) {
      setMessage("Email dan password wajib diisi.");
      return;
    }

    try {
      const session = login({ email, password });
      const displayName =
        session?.user?.name || email.split("@")[0] || "Pembaca";
      onToast?.("Login berhasil", `Selamat datang, ${displayName}.`, "success");
      navigate(nextRedirect, { replace: true });
    } catch (err) {
      setMessage(err.message || "Email atau password salah.");
    }
  };

  const handleLogout = () => {
    logout();
    onToast?.("Logout berhasil", "Sesi akun sudah keluar.", "info");
  };

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-6xl items-center px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid w-full items-center gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,0.75fr)]">
        <div className="max-w-2xl">
          <div className="mb-5 flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg bg-white shadow-book">
            <img
              src={aksaraHubLogo}
              alt=""
              aria-hidden="true"
              className="h-full w-full scale-[1.55] object-cover"
            />
          </div>
          <p className="section-label mb-3">Akun AksaraHub</p>
          <h1 className="font-playfair text-4xl font-extrabold leading-tight text-textMain lg:text-5xl">
            Masuk untuk menyimpan dan mengelola rak favorit.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-textSecondary">
            Login ini berjalan lokal di browser, cocok untuk demo aplikasi tanpa
            backend. Data akun tidak dikirim ke server.
          </p>
        </div>

        <div className="rounded-lg border border-borderSoft bg-white p-6 shadow-book">
          {isAuthenticated ? (
            <div>
              <p className="section-label mb-2">Sudah Login</p>
              <h2 className="font-playfair text-2xl font-bold text-textMain">
                {user.name}
              </h2>
              <p className="mt-1 text-sm text-textSecondary">{user.email}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/" className="btn-primary">
                  <Icon name="home" className="h-4 w-4" />
                  Ke Beranda
                </Link>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleLogout}
                >
                  Keluar
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-5">
                <p className="section-label mb-1">Login</p>
                <h2 className="font-playfair text-2xl font-bold text-textMain">
                  Masuk ke AksaraHub
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="login-email"
                    className="section-label mb-1.5 block"
                  >
                    Email
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    className="input-field"
                    placeholder="nama@email.com"
                    value={values.email}
                    onChange={(event) =>
                      handleChange("email", event.target.value)
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="login-password"
                    className="section-label mb-1.5 block"
                  >
                    Password
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    className="input-field"
                    placeholder="Minimal isi untuk demo"
                    value={values.password}
                    onChange={(event) =>
                      handleChange("password", event.target.value)
                    }
                  />
                </div>
              </div>

              {message && (
                <p className="mt-3 text-sm font-semibold text-accentHover">
                  {message}
                </p>
              )}

              <button type="submit" className="btn-primary mt-6 w-full">
                <Icon name="users" className="h-4 w-4" />
                Masuk
              </button>

              <p className="mt-4 text-sm text-textSecondary">
                Demo:{" "}
                <span className="font-semibold">demo@aksarahub.local</span> /{" "}
                <span className="font-semibold">demo123</span>
              </p>

              <p className="mt-2 text-sm text-textSecondary">
                Belum punya akun?{" "}
                <Link to="/register" className="font-semibold text-accentHover">
                  Daftar
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
