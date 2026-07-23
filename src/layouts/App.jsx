import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "../pages/HomePage";
import DashboardPage from "../pages/DashboardPage";
import LibraryPage from "../pages/LibraryPage";
import FavoritesPage from "../pages/FavoritesPage";
import AboutPage from "../pages/AboutPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import SettingsPage from "../pages/SettingsPage";
import BookDetailPage from "../pages/BookDetailPage";
import NotFoundPage from "../pages/NotFoundPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminBooksPage from "../pages/admin/AdminBooksPage";
import AdminCategoriesPage from "../pages/admin/AdminCategoriesPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import AdminReviewsPage from "../pages/admin/AdminReviewsPage";
import MainLayout from "./MainLayout";
import AuthLayout from "./AuthLayout";
import AdminLayout from "./AdminLayout";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import { ROLES } from "../constants/roles.js";
import { FALLBACK_BOOKS } from "../constants/books";
import { fetchOpenLibraryBooks } from "../services/openLibraryApi";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useTheme } from "../contexts/ThemeContext.jsx";
import { useFavorites } from "../contexts/FavoriteContext.jsx";
import { useNotification } from "../contexts/NotificationContext.jsx";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { favoriteBooks, favoriteIds, favoriteCount, toggleFavorite } =
    useFavorites();
  const { showToast } = useNotification();

  const [isLoading, setIsLoading] = useState(true);
  const [dataStore, setDataStore] = useState([]);
  const [recommendationStore, setRecommendationStore] = useState([]);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    logout();
    if (
      location.pathname === "/favorites" ||
      location.pathname.startsWith("/admin")
    ) {
      navigate("/", { replace: true });
    }
  };

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
      <Route element={<MainLayout />}>
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
            />
          }
        />
        <Route
          path="books/:id"
          element={<BookDetailPage dataStore={dataStore} />}
        />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage
                books={dataStore}
                continueReadingBooks={dataStore.slice(0, 4)}
                recentReviews={[]}
                notifications={[]}
                onMarkNotificationRead={(id) => {}}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="favorites"
          element={
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          }
        />
        <Route path="about" element={<AboutPage />} />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="books" element={<AdminBooksPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="reviews" element={<AdminReviewsPage />} />
      </Route>
    </Routes>
  );
}
