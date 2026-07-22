import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BookModal from "../components/BookModal";
import { FALLBACK_BOOKS } from "../constants/books";

const getBookId = (book) =>
  book?.key || book?.id || book?.workKey || book?.title;

export default function BookDetailPage({
  dataStore = [],
  favoriteBooks = [],
  onToggleFavorite,
  onToast,
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const book = useMemo(() => {
    const allBooks = [...dataStore, ...favoriteBooks, ...FALLBACK_BOOKS];
    return allBooks.find(
      (item) => getBookId(item) === id || item.id === id || item.key === id,
    );
  }, [dataStore, favoriteBooks, id]);

  if (!book) {
    return (
      <section className="mx-auto min-h-[70vh] max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-borderSoft bg-white p-8 text-center shadow-book">
          <p className="font-playfair text-2xl font-semibold text-textMain mb-4">
            Buku tidak ditemukan
          </p>
          <p className="font-crimson text-textSecondary mb-6">
            Mohon periksa kembali tautan yang digunakan atau kembali ke daftar
            buku.
          </p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate("/books")}
          >
            Kembali ke Katalog
          </button>
        </div>
      </section>
    );
  }

  return (
    <BookModal
      key={getBookId(book)}
      book={book}
      onClose={() => navigate("/books")}
      isFavorite={favoriteBooks.some(
        (item) => getBookId(item) === getBookId(book),
      )}
      onToggleFavorite={onToggleFavorite}
      onToast={onToast}
    />
  );
}
