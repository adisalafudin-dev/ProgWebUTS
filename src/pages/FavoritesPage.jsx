import { useState } from "react";
import { Link } from "react-router-dom";
import BookCard from "../components/BookCard";
import BookModal from "../components/BookModal";
import Icon from "../components/Icon";
import { useFavorites } from "../contexts/FavoriteContext.jsx";
import { useNotification } from "../contexts/NotificationContext.jsx";

const getBookId = (book) =>
  book?.key || book?.id || book?.workKey || book?.title;

export default function FavoritesPage() {
  const { favoriteBooks, favoriteIds, toggleFavorite } = useFavorites();
  const { showToast } = useNotification();
  const [selectedBook, setSelectedBook] = useState(null);
  const isBookFavorite = (book) => favoriteIds.has(getBookId(book));

  return (
    <>
      <section
        id="favorit"
        aria-labelledby="favorite-heading"
        className="mx-auto min-h-[70vh] max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
      >
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="section-label">Rak Pribadi</p>
            <h1
              id="favorite-heading"
              className="font-playfair text-3xl font-bold text-textMain"
            >
              Buku Favorit
            </h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-lg border border-borderSoft bg-white px-3 py-1.5 text-sm font-semibold text-textSecondary shadow-book">
            <Icon name="heart" className="h-4 w-4 text-accent" />
            {favoriteBooks.length} buku
          </div>
        </div>

        {favoriteBooks.length > 0 ? (
          <div className="book-grid">
            {favoriteBooks.map((book, index) => (
              <BookCard
                key={book.key || book.id || index}
                book={book}
                index={index}
                onSelect={setSelectedBook}
                isFavorite={isBookFavorite(book)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-borderSoft bg-white p-8 text-center shadow-book">
            <Icon name="heart" className="mx-auto mb-3 h-8 w-8 text-accent" />
            <p className="font-playfair text-lg font-semibold text-textMain">
              Belum ada buku favorit
            </p>
            <p className="mx-auto mt-1 max-w-md text-sm text-textSecondary">
              Simpan buku dari beranda atau katalog API untuk membuat rak
              favorit pribadi.
            </p>
            <Link to="/" className="btn-primary mt-5">
              Jelajahi Buku
            </Link>
          </div>
        )}
      </section>

      <BookModal
        key={selectedBook?.key || selectedBook?.id || "favorites-book-modal"}
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        isFavorite={isBookFavorite(selectedBook)}
        onToggleFavorite={toggleFavorite}
        onToast={showToast}
      />
    </>
  );
}
