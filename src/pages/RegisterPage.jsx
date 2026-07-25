import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Icon from "../components/Icon";
import aksaraHubLogo from "../assets/AksaraHub Logo.png";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useNotification } from "../contexts/NotificationContext.jsx";

export default function RegisterPage() {
  const { user, isAuthenticated, register } = useAuth();
  const { showToast } = useNotification();
  const location = useLocation();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const redirectTo = location.state?.redirectTo || "/";

  const handleChange = (key, value) => {
    setValues((currentValues) => ({ ...currentValues, [key]: value }));
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = values.email.trim();
    const password = values.password.trim();
    const name = values.name.trim() || email.split("@")[0] || "Pembaca";

    if (!email || !password) {
      setMessage("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      await register({ name, email, password });
      showToast("Pendaftaran berhasil", `Selamat datang, ${name}.`, "success");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setMessage(err.message || "Pendaftaran gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-borderSoft bg-white p-7 shadow-book sm:p-9 dark:bg-[#17211f]">
        {isAuthenticated ? (
          <div className="text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-cream shadow-book">
              <img
                src={aksaraHubLogo}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="h-full w-full scale-[1.55] object-cover"
              />
            </div>
            <p className="section-label mb-2">Sudah Login</p>
            <h2 className="font-playfair text-2xl font-bold text-textMain">
              {user.name}
            </h2>
            <p className="mt-1 text-sm text-textSecondary">{user.email}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/" className="btn-primary">
                <Icon name="compass" className="h-4 w-4" />
                Ke Jelajah
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-7 flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-cream shadow-book">
                <img
                  src={aksaraHubLogo}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="h-full w-full scale-[1.55] object-cover"
                />
              </div>
              <div>
                <p className="section-label mb-1">Daftar</p>
                <h1 className="font-playfair text-2xl font-bold leading-tight text-textMain">
                  Buat akun AksaraHub
                </h1>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="register-name" className="section-label mb-1.5 block">
                  Nama
                </label>
                <input
                  id="register-name"
                  type="text"
                  autoComplete="name"
                  className="input-field"
                  placeholder="Nama kamu"
                  value={values.name}
                  onChange={(event) => handleChange("name", event.target.value)}
                />
              </div>

              <div>
                <label htmlFor="register-email" className="section-label mb-1.5 block">
                  Email
                </label>
                <input
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  className="input-field"
                  placeholder="nama@email.com"
                  value={values.email}
                  onChange={(event) => handleChange("email", event.target.value)}
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="register-password" className="section-label">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="flex items-center gap-1 text-xs font-semibold text-textSecondary hover:text-accentHover"
                  >
                    <Icon name="eye" className="h-3.5 w-3.5" />
                    {showPassword ? "Sembunyikan" : "Tampilkan"}
                  </button>
                </div>
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className="input-field"
                  placeholder="Minimal isi untuk demo"
                  value={values.password}
                  onChange={(event) => handleChange("password", event.target.value)}
                />
              </div>
            </div>

            {message && (
              <p className="mt-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm font-semibold text-accentHover dark:bg-red-950/20">
                {message}
              </p>
            )}

            <button type="submit" className="btn-primary mt-6 w-full" disabled={loading}>
              <Icon name="users" className="h-4 w-4" />
              {loading ? "Mendaftarkan..." : "Daftar"}
            </button>

            <p className="mt-5 text-center text-sm text-textSecondary">
              Sudah punya akun?{" "}
              <Link to="/login" className="font-semibold text-accentHover">
                Masuk
              </Link>
            </p>
          </form>
        )}
      </div>

      <p className="mt-6 text-center text-xs leading-relaxed text-textSecondary">
        Pendaftaran ini berjalan lokal di browser, cocok untuk demo aplikasi
        tanpa backend. Data akun tidak dikirim ke server.
      </p>
    </div>
  );
}
