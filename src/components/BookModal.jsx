import { useEffect, useState } from "react";
import Icon from "./Icon";

const normalizeOpenLibraryDescription = (description) => {
  if (!description) return "";
  if (typeof description === "string") return description;
  if (typeof description.value === "string") return description.value;
  return "";
};

export default function BookModal({
  book,
  onClose = () => {},
  isFavorite = false,
  onToggleFavorite,
  onToast,
}) {
  const [isBorrowed, setIsBorrowed] = useState(false);
  const [synopsis, setSynopsis] = useState("");
  const [isSynopsisLoading, setIsSynopsisLoading] = useState(false);
  const activeBookId = book?.key || book?.id || book?.workKey || book?.title;

  useEffect(() => {
    if (!book) return undefined;

    const fallbackSynopsis =
      book.synopsis ||
      book.description ||
      "Sinopsis buku belum tersedia dari katalog Open Library.";

    setSynopsis(fallbackSynopsis);

    if (!book.workKey?.startsWith("/works/")) return undefined;

    const controller = new AbortController();
    setIsSynopsisLoading(true);

    fetch(`https://openlibrary.org${book.workKey}.json`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Gagal mengambil sinopsis");
        return response.json();
      })
      .then((data) => {
        const apiSynopsis = normalizeOpenLibraryDescription(data.description);
        if (apiSynopsis) setSynopsis(apiSynopsis);
      })
      .catch((error) => {
        if (error.name !== "AbortError") setSynopsis(fallbackSynopsis);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsSynopsisLoading(false);
      });

    return () => controller.abort();
  }, [book]);

  useEffect(() => {
    setIsBorrowed(false);
  }, [activeBookId]);

  useEffect(() => {
    if (!book) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [book, onClose]);

  if (!book) return null;

  const title = book.title || "Judul tidak tersedia";
  const author = book.author || "Penulis tidak diketahui";
  const genres = [book.genre, ...(book.genres || [])].filter(Boolean);
  const uniqueGenres = [...new Set(genres)];
  const isBorrowable = book.available !== false;
  const isAvailable = isBorrowable && !isBorrowed;
  const statusLabel = isAvailable ? "Tersedia" : "Dipinjam";
  const borrowButtonLabel = !isBorrowable
    ? "Sedang Dipinjam"
    : isBorrowed
      ? "Kembalikan Buku"
      : "Pinjam Buku";
  const bookInfo = [
    { label: "Penulis", value: author },
    { label: "Tahun Terbit", value: book.year || "-" },
    { label: "Jumlah Halaman", value: book.pages ? `${book.pages} hal` : "-" },
    {
      label: "Genre",
      value: uniqueGenres.length > 0 ? uniqueGenres.join(", ") : "General",
    },
    { label: "Rating", value: book.rating ? `${book.rating} / 5.0` : "-" },
  ];

  const handleBorrowToggle = () => {
    if (!isBorrowable && !isBorrowed) return;

    const nextBorrowed = !isBorrowed;
    setIsBorrowed(nextBorrowed);
    onToast?.(
      nextBorrowed ? "Buku dipinjam" : "Buku dikembalikan",
      title,
      "success",
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(24, 51, 47, 0.76)" }}
      role="dialog"
      aria-modal="true"
      aria-label={`Detail buku: ${title}`}
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-lg bg-cream text-textMain shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex max-h-[90vh] flex-col overflow-y-auto sm:flex-row">
          <div className="sm:w-52 flex-shrink-0 bg-borderSoft">
            {book.cover ? (
              <img
                src={book.cover}
                alt={`Sampul ${title}`}
                className="w-full sm:h-full object-cover max-h-56 sm:max-h-none"
              />
            ) : (
              <div className="min-h-56 h-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary p-5">
                <p className="font-playfair text-white/80 text-center text-sm">
                  {title}
                </p>
              </div>
            )}
          </div>

          <div className="flex-1 bg-cream p-6">
            <div className="mb-3 flex items-start justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="section-label">
                  {uniqueGenres.slice(0, 2).join(" / ") || "General"}
                </p>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                    isAvailable
                      ? "bg-primary text-white"
                      : "bg-accentHover text-white"
                  }`}
                >
                  {statusLabel}
                </span>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-borderSoft bg-white px-3 py-1.5 text-sm font-semibold text-textSecondary transition-colors hover:border-accent hover:text-accentHover"
                aria-label="Tutup detail buku"
                onClick={onClose}
              >
                <Icon name="close" className="h-4 w-4" strokeWidth={2} />
                Tutup
              </button>
            </div>

            <h2 className="font-playfair font-bold text-2xl text-textMain leading-tight mb-1">
              {title}
            </h2>

            <div className="mb-5 mt-4">
              <p className="section-label mb-2">Informasi Buku</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {bookInfo.map(({ label, value }) => (
                  <div
                    key={label}
                    className="rounded-lg border border-borderSoft bg-white px-3 py-2"
                  >
                    <p className="text-xs text-textSecondary font-crimson">
                      {label}
                    </p>
                    <p className="font-playfair font-semibold text-textMain text-sm">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-5 rounded-lg border border-borderSoft bg-white px-4 py-3">
              <p className="section-label mb-1">Sinopsis</p>
              <p className="text-sm leading-relaxed text-textSecondary">
                {isSynopsisLoading ? "Mengambil sinopsis buku..." : synopsis}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="btn-primary text-sm py-2.5"
                disabled={!isBorrowable && !isBorrowed}
                onClick={handleBorrowToggle}
              >
                {borrowButtonLabel}
              </button>
              <button
                type="button"
                className="btn-secondary text-sm py-2.5"
                onClick={() => onToggleFavorite?.(book)}
              >
                <Icon name="heart" className="h-4 w-4" strokeWidth={2} />
                {isFavorite ? "Hapus Favorit" : "Simpan Favorit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
