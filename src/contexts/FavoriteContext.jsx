import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { favoriteApi } from "../services/favoriteApi.js";
import { useAuth } from "./AuthContext.jsx";
import { getBookId } from "../utils/bookHelpers.js";

const FAVORITES_STORAGE_KEY = "aksarahub-favorite-books";

const FavoriteContext = createContext(null);

export function FavoriteProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load favorites from localStorage for offline/guest, or from API when authenticated
  useEffect(() => {
    const loadFavorites = async () => {
      if (isAuthenticated) {
        setLoading(true);
        try {
          const response = await favoriteApi.getFavorites();
          const data = response.data || response;
          const books = Array.isArray(data)
            ? data
            : data?.favorites || data?.data || [];
          setFavoriteBooks(books);
        } catch {
          // Fallback ke localStorage jika API gagal
          try {
            const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
            setFavoriteBooks(saved ? JSON.parse(saved) : []);
          } catch {
            setFavoriteBooks([]);
          }
        } finally {
          setLoading(false);
        }
      } else {
        // Guest: load dari localStorage
        try {
          const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
          setFavoriteBooks(saved ? JSON.parse(saved) : []);
        } catch {
          setFavoriteBooks([]);
        }
      }
    };

    loadFavorites();
  }, [isAuthenticated]);

  const favoriteIds = useMemo(() => {
    return new Set(favoriteBooks.map((book) => getBookId(book)));
  }, [favoriteBooks]);

  const favoriteCount = favoriteBooks.length;

  const toggleFavorite = useCallback(
    async (book) => {
      if (!book) return;
      const bookId = getBookId(book);

      const exists = favoriteBooks.some((item) => getBookId(item) === bookId);

      if (isAuthenticated) {
        try {
          if (exists) {
            // Remove from backend
            await favoriteApi.removeFavoriteByBook(bookId);
            setFavoriteBooks((prev) =>
              prev.filter((item) => getBookId(item) !== bookId),
            );
          } else {
            // Add to backend
            const payload = {
              bookId,
              title: book.title,
              author: book.author_name?.join(", ") || book.author || "",
              coverUrl: book.cover_i
                ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                : "",
              ...book,
            };
            await favoriteApi.addFavorite(payload);
            setFavoriteBooks((prev) => [...prev, book]);
          }
        } catch {
          // Fallback ke localStorage jika API gagal
          setFavoriteBooks((prev) => {
            const updated = exists
              ? prev.filter((item) => getBookId(item) !== bookId)
              : [...prev, book];
            try {
              localStorage.setItem(
                FAVORITES_STORAGE_KEY,
                JSON.stringify(updated),
              );
            } catch {
              // ignore
            }
            return updated;
          });
        }
      } else {
        // Guest: simpan di localStorage
        setFavoriteBooks((prev) => {
          const updated = exists
            ? prev.filter((item) => getBookId(item) !== bookId)
            : [...prev, book];
          try {
            localStorage.setItem(
              FAVORITES_STORAGE_KEY,
              JSON.stringify(updated),
            );
          } catch {
            // ignore
          }
          return updated;
        });
      }
    },
    [favoriteBooks, isAuthenticated],
  );

  const value = useMemo(
    () => ({
      favoriteBooks,
      favoriteIds,
      favoriteCount,
      loading,
      toggleFavorite,
    }),
    [favoriteBooks, favoriteIds, favoriteCount, loading, toggleFavorite],
  );

  return (
    <FavoriteContext.Provider value={value}>
      {children}
    </FavoriteContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoriteProvider");
  }
  return context;
}
