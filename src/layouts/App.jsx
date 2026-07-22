import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "../pages/HomePage";
import LibraryPage from "../pages/LibraryPage";
import FavoritesPage from "../pages/FavoritesPage";
import AboutPage from "../pages/AboutPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import SettingsPage from "../pages/SettingsPage";
import BookDetailPage from "../pages/BookDetailPage";
import NotFoundPage from "../pages/NotFoundPage";
import MainLayout from "./MainLayout";
import { FALLBACK_BOOKS } from "../constants/books";
import { fetchOpenLibraryBooks } from "../services/bookApi";

const FAVORITES_STORAGE_KEY = "aksarahub-favorite-books";
const THEME_STORAGE_KEY = "aksarahub-theme";
const AUTH_STORAGE_KEY = "aksarahub-user";

const getBookId = (book) =>
  book?.key || book?.id || book?.workKey || book?.title;

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [dataStore, setDataStore] = useState([]);
  const [recommendationStore, setRecommendationStore] = useState([]);
  const [error, setError] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme) return savedTheme === "dark";
      return (
        window.matchMedia?.("(prefers-color-scheme: dark)").matches || false
      );
    } catch {
      return false;
    }
  });
  const [favoriteBooks, setFavoriteBooks] = useState(() => {
    try {
      const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return savedFavorites ? JSON.parse(savedFavorites) : [];
    } catch {
      return [];
    }
  });

  const favoriteIds = new Set(favoriteBooks.map(getBookId).filter(Boolean));

  const showToast = (title, message = "", type = "success") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((currentToasts) =>
      [{ id, title, message, type }, ...currentToasts].slice(0, 4),
    );
  };

  const dismissToast = (toastId) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== toastId),
    );
  };

  const toggleFavorite = (book) => {
    if (!currentUser) {
      showToast(
        "Login diperlukan",
        "Masuk dulu untuk menyimpan buku favorit.",
        "info",
      );
      navigate("/login", {
        state: { redirectTo: location.pathname },
      });
      return;
    }

    const bookId = getBookId(book);
    if (!bookId) return;

    const alreadySaved = favoriteBooks.some(
      (favoriteBook) => getBookId(favoriteBook) === bookId,
    );

    setFavoriteBooks((currentFavorites) => {
      const isStillSaved = currentFavorites.some(
        (favoriteBook) => getBookId(favoriteBook) === bookId,
      );

      if (isStillSaved) {
        return currentFavorites.filter(
          (favoriteBook) => getBookId(favoriteBook) !== bookId,
        );
      }

      return [book, ...currentFavorites];
    });

    showToast(
      alreadySaved ? "Favorit dihapus" : "Favorit disimpan",
      book.title || "Buku pilihan kamu sudah diperbarui.",
      "success",
    );
  };

  const toggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    showToast(
      nextMode ? "Dark mode aktif" : "Light mode aktif",
      nextMode
        ? "Tampilan berubah ke mode gelap."
        : "Tampilan kembali ke mode terang.",
      "info",
    );
  };

  const handleLogin = (user) => {
    const nextUser = {
      name: user.name,
      email: user.email,
      loggedInAt: new Date().toISOString(),
    };
    setCurrentUser(nextUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    if (location.pathname === "/favorites") {
      navigate("/", { replace: true });
    }
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteBooks));
  }, [favoriteBooks]);

  async function fetchData(rawFilters = {}) {
    const filters = rawFilters || {};
    const isDefaultFetch = Object.keys(filters).length === 0;

    setIsLoading(true);
    setError(null);
    try {
      const books = await fetchOpenLibraryBooks(filters);

      setDataStore(books);
      if (isDefaultFetch) {
        setRecommendationStore(books);
      } else {
        setRecommendationStore((currentRecommendations) =>
          currentRecommendations.length === 0 ? books : currentRecommendations,
        );
      }
    } catch (err) {
      setDataStore((currentBooks) => {
        const nextBooks =
          currentBooks.length > 0 ? currentBooks : FALLBACK_BOOKS;
        setRecommendationStore((currentRecommendations) =>
          currentRecommendations.length === 0
            ? nextBooks
            : currentRecommendations,
        );
        return nextBooks;
      });
      setError("API Open Library belum bisa diakses, menampilkan data contoh.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (error && dataStore.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream px-4">
        <div className="max-w-md rounded-lg border border-borderSoft bg-white p-6 text-center shadow-book">
          <p className="font-playfair text-xl font-semibold text-textMain mb-2">
            Data belum bisa dimuat
          </p>
          <p className="font-crimson text-textSecondary mb-4">{error}</p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => fetchData()}
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainLayout
            favoriteCount={favoriteBooks.length}
            isDarkMode={isDarkMode}
            onToggleTheme={toggleTheme}
            currentUser={currentUser}
            onLogout={handleLogout}
            onToast={showToast}
            toasts={toasts}
            onDismissToast={dismissToast}
          />
        }
      >
        <Route
          index
          element={
            <HomePage
              books={dataStore}
              featuredSourceBooks={
                recommendationStore.length > 0 ? recommendationStore : dataStore
              }
              error={error}
              fetchData={fetchData}
              isLoading={isLoading}
              favoriteIds={favoriteIds}
              onToggleFavorite={toggleFavorite}
              onToast={showToast}
            />
          }
        />
        <Route
          path="books"
          element={
            <LibraryPage
              books={dataStore}
              isLoading={isLoading}
              fetchData={fetchData}
              favoriteIds={favoriteIds}
              onToggleFavorite={toggleFavorite}
              onToast={showToast}
            />
          }
        />
        <Route
          path="books/:id"
          element={
            <BookDetailPage
              dataStore={dataStore}
              favoriteBooks={favoriteBooks}
              onToggleFavorite={toggleFavorite}
              onToast={showToast}
            />
          }
        />
        <Route
          path="favorites"
          element={
            currentUser ? (
              <FavoritesPage
                favoriteBooks={favoriteBooks}
                favoriteIds={favoriteIds}
                onToggleFavorite={toggleFavorite}
                onToast={showToast}
              />
            ) : (
              <Navigate
                to="/login"
                state={{ redirectTo: "/favorites" }}
                replace
              />
            )
          }
        />
        <Route path="about" element={<AboutPage />} />
        <Route
          path="login"
          element={
            <LoginPage
              currentUser={currentUser}
              onLogin={handleLogin}
              onLogout={handleLogout}
              onToast={showToast}
            />
          }
        />
        <Route
          path="register"
          element={
            <RegisterPage
              currentUser={currentUser}
              onLogin={handleLogin}
              onToast={showToast}
            />
          }
        />
        <Route
          path="profile"
          element={
            currentUser ? (
              <ProfilePage
                currentUser={currentUser}
                favoriteBooks={favoriteBooks}
              />
            ) : (
              <Navigate
                to="/login"
                state={{ redirectTo: "/profile" }}
                replace
              />
            )
          }
        />
        <Route
          path="settings"
          element={
            <SettingsPage isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
