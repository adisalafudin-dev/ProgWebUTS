import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const FAVORITES_STORAGE_KEY = "aksarahub-favorite-books";

const getBookId = (book) =>
  book?.key || book?.id || book?.workKey || book?.title;

const FavoriteContext = createContext(null);

export function FavoriteProvider({ children }) {
  const [favoriteBooks, setFavoriteBooks] = useState(() => {
    try {
      const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return savedFavorites ? JSON.parse(savedFavorites) : [];
    } catch {
      return [];
    }
  });

  const favoriteIds = useMemo(() => {
    return new Set(favoriteBooks.map((book) => getBookId(book)));
  }, [favoriteBooks]);

  const favoriteCount = favoriteBooks.length;

  const persistFavorites = useCallback((books) => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(books));
    } catch {
      // localStorage not available
    }
  }, []);

  const toggleFavorite = useCallback(
    (book) => {
      if (!book) return;
      const bookId = getBookId(book);
      setFavoriteBooks((prev) => {
        const exists = prev.some((item) => getBookId(item) === bookId);
        const updated = exists
          ? prev.filter((item) => getBookId(item) !== bookId)
          : [...prev, book];
        persistFavorites(updated);
        return updated;
      });
    },
    [persistFavorites],
  );

  const value = useMemo(
    () => ({
      favoriteBooks,
      favoriteIds,
      favoriteCount,
      toggleFavorite,
    }),
    [favoriteBooks, favoriteIds, favoriteCount, toggleFavorite],
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
