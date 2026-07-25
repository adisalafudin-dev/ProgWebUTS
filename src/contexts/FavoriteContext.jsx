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
import aksaraToast from "../utils/toast.js";

const FAVORITES_STORAGE_KEY = "aksarahub-favorite-books";

const FavoriteContext = createContext(null);

const normalizeFavoriteBooks = (books = []) =>
  books.map((book, index) => ({
    ...book,
    favoritedAt:
      book.favoritedAt ||
      Date.now() - (books.length - index - 1) * 1000,
  }));

const readFavoritesFromStorage = () => {
  const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
  if (!saved) return [];
  const parsed = JSON.parse(saved);
  if (!Array.isArray(parsed)) {
    throw new Error("Format data favorit tidak valid.");
  }
  return normalizeFavoriteBooks(parsed);
};

export function FavoriteProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadFavorites = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (isAuthenticated) {
      try {
        const response = await favoriteApi.getFavorites();
        const data = response.data || response;
        const books = Array.isArray(data)
          ? data
          : data?.favorites || data?.data || [];
        setFavoriteBooks(normalizeFavoriteBooks(books));
      } catch {
        try {
          setFavoriteBooks(readFavoritesFromStorage());
        } catch (storageError) {
          setFavoriteBooks([]);
          setError(
            storageError.message ||
              "Gagal membaca data favorit dari penyimpanan lokal.",
          );
          aksaraToast.favoriteStorageReadError();
        }
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      setFavoriteBooks(readFavoritesFromStorage());
    } catch (storageError) {
      setFavoriteBooks([]);
      setError(
        storageError.message ||
          "Gagal membaca data favorit dari penyimpanan lokal.",
      );
      aksaraToast.favoriteStorageReadError();
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const favoriteIds = useMemo(() => {
    return new Set(favoriteBooks.map((book) => getBookId(book)));
  }, [favoriteBooks]);

  const favoriteCount = favoriteBooks.length;

  const addFavorite = useCallback(
    async (book) => {
      if (!book) return;
      const bookId = getBookId(book);
      const exists = favoriteBooks.some((item) => getBookId(item) === bookId);

      if (exists) {
        aksaraToast.favoriteAlreadyExists();
        return;
      }

      if (isAuthenticated) {
        try {
          const payload = {
            bookId,
            title: book.title,
            author: book.author_name?.join(", ") || book.author || "",
            coverUrl: book.cover_i
              ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
              : "",
            ...book,
            favoritedAt: Date.now(),
          };
          await favoriteApi.addFavorite(payload);
          setFavoriteBooks((prev) => [
            ...prev,
            { ...book, favoritedAt: Date.now() },
          ]);
        } catch {
          setFavoriteBooks((prev) => {
            const updated = [...prev, { ...book, favoritedAt: Date.now() }];
            try {
              localStorage.setItem(
                FAVORITES_STORAGE_KEY,
                JSON.stringify(updated),
              );
            } catch {
              setError("Gagal menyimpan data favorit ke penyimpanan lokal.");
            }
            return updated;
          });
        }
      } else {
        setFavoriteBooks((prev) => {
          const updated = [...prev, { ...book, favoritedAt: Date.now() }];
          try {
            localStorage.setItem(
              FAVORITES_STORAGE_KEY,
              JSON.stringify(updated),
            );
          } catch {
            setError("Gagal menyimpan data favorit ke penyimpanan lokal.");
          }
          return updated;
        });
      }
      aksaraToast.favoriteAdded();
    },
    [favoriteBooks, isAuthenticated],
  );

  const removeFavorite = useCallback(
    async (book) => {
      if (!book) return;
      const bookId = getBookId(book);
      const exists = favoriteBooks.some((item) => getBookId(item) === bookId);

      if (!exists) return;

      if (isAuthenticated) {
        try {
          await favoriteApi.removeFavoriteByBook(bookId);
          setFavoriteBooks((prev) =>
            prev.filter((item) => getBookId(item) !== bookId),
          );
        } catch {
          setFavoriteBooks((prev) => {
            const updated = prev.filter((item) => getBookId(item) !== bookId);
            try {
              localStorage.setItem(
                FAVORITES_STORAGE_KEY,
                JSON.stringify(updated),
              );
            } catch {
              setError("Gagal menyimpan data favorit ke penyimpanan lokal.");
            }
            return updated;
          });
        }
      } else {
        setFavoriteBooks((prev) => {
          const updated = prev.filter((item) => getBookId(item) !== bookId);
          try {
            localStorage.setItem(
              FAVORITES_STORAGE_KEY,
              JSON.stringify(updated),
            );
          } catch {
            setError("Gagal menyimpan data favorit ke penyimpanan lokal.");
          }
          return updated;
        });
      }
      aksaraToast.favoriteRemoved();
    },
    [favoriteBooks, isAuthenticated],
  );

  const toggleFavorite = useCallback(
    async (book) => {
      if (!book) return;
      const bookId = getBookId(book);
      const exists = favoriteBooks.some((item) => getBookId(item) === bookId);

      if (exists) {
        await removeFavorite(book);
      } else {
        await addFavorite(book);
      }
    },
    [favoriteBooks, addFavorite, removeFavorite],
  );

  const value = useMemo(
    () => ({
      favoriteBooks,
      favoriteIds,
      favoriteCount,
      loading,
      error,
      reloadFavorites: loadFavorites,
      toggleFavorite,
      addFavorite,
      removeFavorite,
    }),
    [
      favoriteBooks,
      favoriteIds,
      favoriteCount,
      loading,
      error,
      loadFavorites,
      toggleFavorite,
      addFavorite,
      removeFavorite,
    ],
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
