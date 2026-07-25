import { useEffect, useState, lazy, Suspense } from "react";
import {
  useLocation,
  useNavigate,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MainLayout from "./MainLayout";
import AuthLayout from "./AuthLayout";
import AdminLayout from "./AdminLayout";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import { ROLES } from "../constants/roles.js";
import { FALLBACK_BOOKS } from "../constants/books";
import { fetchOpenLibraryBooks } from "../services/openLibraryApi";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useFavorites } from "../contexts/FavoriteContext.jsx";
import { useNotification } from "../contexts/NotificationContext.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { useScrollRestoration } from "../hooks/useScrollRestoration";
import aksaraToast from "../utils/toast.js";

// Lazy load pages for code splitting
const ExplorePage = lazy(() => import("../pages/ExplorePage"));
const LibraryPage = lazy(() => import("../pages/LibraryPage"));
const FavoritesPage = lazy(() => import("../pages/FavoritesPage"));
const AboutPage = lazy(() => import("../pages/AboutPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const SettingsPage = lazy(() => import("../pages/SettingsPage"));
const BookDetailPage = lazy(() => import("../pages/BookDetailPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const AdminDashboardPage = lazy(() => import("../pages/admin/AdminDashboardPage"));
const AdminBooksPage = lazy(() => import("../pages/admin/AdminBooksPage"));
const AdminBookDetailPage = lazy(() => import("../pages/admin/AdminBookDetailPage"));
const AdminCategoriesPage = lazy(() => import("../pages/admin/AdminCategoriesPage"));
const AdminUsersPage = lazy(() => import("../pages/admin/AdminUsersPage"));
const AdminStatisticsPage = lazy(() => import("../pages/admin/AdminStatisticsPage"));

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { favoriteBooks, favoriteIds, favoriteCount, toggleFavorite } =
    useFavorites();
  const { showToast } = useNotification();
  
  // Custom scroll restoration
  useScrollRestoration();

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
      console.error("Error fetching books:", err);
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
      setError(
        "API Open Library belum bisa diakses, menampilkan data contoh. Silakan coba lagi nanti.",
      );
      aksaraToast.apiFetchError();
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
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route
            index
            element={
              <ExplorePage
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
                error={error}
                fetchData={fetchData}
              />
            }
          />
          <Route
            path="books/:id"
            element={<BookDetailPage dataStore={dataStore} />}
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
          <Route path="books/:workId" element={<AdminBookDetailPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route
            path="reviews"
            element={<Navigate to="/admin/dashboard" replace />}
          />
          <Route path="statistics" element={<AdminStatisticsPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
