import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import BookModal from "../components/BookModal";
import Icon from "../components/Icon";
import LoadingSpinner from "../components/LoadingSpinner";

const TOPICS = [
  { value: "Semua", label: "Semua", icon: "collection" },
  { value: "Fiction", label: "Fiction", icon: "bookOpen" },
  { value: "Fantasy", label: "Fantasy", icon: "star" },
  { value: "Adventure", label: "Adventure", icon: "compass" },
  { value: "Mystery", label: "Mystery", icon: "eye" },
  { value: "Romance", label: "Romance", icon: "heart" },
  { value: "Science", label: "Science", icon: "flask" },
  { value: "Chemistry", label: "Chemistry", icon: "flask" },
  { value: "Physics", label: "Physics", icon: "flask" },
  { value: "History", label: "History", icon: "globe" },
  { value: "Poetry", label: "Poetry", icon: "pen" },
];

// ✅ Terima prop books dari App
export default function LibraryPage({ books = [], isLoading = false }) {
  const ITEMS_PER_PAGE = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("Semua");
  const [selectedBook, setSelectedBook] = useState(null);
  const [showLoading, setShowLoading] = useState(isLoading);
  const [currentPage, setCurrentPage] = useState(1);

  const activeKeyword = debouncedSearchTerm.trim().toLowerCase();
  const hasSearch = activeKeyword !== "";
  const selectedTopicLabel =
    TOPICS.find((topic) => topic.value === selectedTopic)?.label ||
    selectedTopic;

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  useEffect(() => {
    setSelectedBook(null);
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedTopic]);

  useEffect(() => {
    let timerId;

    if (isLoading) {
      setShowLoading(true);
    } else {
      timerId = setTimeout(() => {
        setShowLoading(false);
      }, 900);
    }

    return () => clearTimeout(timerId);
  }, [isLoading]);

  const filteredBooks = books.filter((book) => {
    const searchableText = [
      book.title,
      book.author,
      book.genre,
      ...(book.genres || []),
      ...(book.tags || []),
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      activeKeyword === "" || searchableText.includes(activeKeyword);
    const matchesTopic =
      selectedTopic === "Semua" ||
      searchableText.includes(selectedTopic.toLowerCase());

    return matchesSearch && matchesTopic;
  });
  const hasFilteredBooks = filteredBooks.length > 0;

  // Pagination logic
  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <section
        id="katalog"
        aria-labelledby="library-heading"
        className="border-y border-accent/70 bg-gradient-to-br from-primary via-primary to-accentHover py-12 text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="section-label text-accent mb-2">
                Data Langsung dari API
              </p>
              <h2
                id="library-heading"
                className="font-playfair font-bold text-3xl lg:text-4xl leading-tight"
              >
                Perpustakaan Digital
              </h2>
              <p className="font-crimson text-white/60 mt-2 text-lg">
                Sumber: <span className="text-accent">Open Library API</span>
              </p>
            </div>
            <div
              className="flex items-center gap-2 text-sm font-crimson text-white/50
                            bg-white/5 border border-white/10 px-4 py-2 rounded-lg"
            >
              {/* ✅ status aktif karena sudah fetch */}
              <span
                className={`w-2 h-2 rounded-full bg-accent ${
                  showLoading ? "animate-ping" : ""
                }`}
                aria-hidden="true"
              />
              {showLoading ? "Mengambil data..." : "Fetch API aktif"}
            </div>
          </div>
        </div>
      </section>

      <section
        aria-label="Form pencarian katalog API"
        className="border-b border-borderSoft bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <form
            action="#"
            method="get"
            noValidate
            onSubmit={handleSearchSubmit}
            className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(260px,1fr)_auto] lg:items-start"
          >
            <div className="space-y-3">
              <div className="relative max-w-xl">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
                <label htmlFor="api-search" className="sr-only">
                  Cari judul atau penulis
                </label>
                <input
                  id="api-search"
                  type="search"
                  name="search"
                  placeholder="Cari judul atau penulis..."
                  autoComplete="off"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="input-field pl-9"
                />
              </div>

              <fieldset className="flex flex-wrap items-center gap-2">
                <legend className="sr-only">Pilih topik buku</legend>
                {TOPICS.map((t) => (
                  <label key={t.value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="topic"
                      value={t.value}
                      checked={selectedTopic === t.value}
                      onChange={(event) => setSelectedTopic(event.target.value)}
                      className="sr-only peer"
                    />
                    <span
                      className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border
                                     border-borderSoft bg-white px-3 py-2 text-xs font-semibold
                                     font-crimson text-textSecondary transition-all duration-300
                                     hover:border-accent hover:text-accentHover
                                     peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white"
                    >
                      <Icon name={t.icon} className="w-3.5 h-3.5" />
                      {t.label}
                    </span>
                  </label>
                ))}
              </fieldset>
            </div>

            <div className="flex flex-wrap gap-2 lg:justify-end">
              <button
                type="submit"
                className="btn-primary min-h-11 whitespace-nowrap"
              >
                <Icon name="search" className="w-4 h-4" strokeWidth={2} />
                Cari
              </button>
              {searchTerm && (
                <button
                  type="button"
                  className="btn-secondary min-h-11 whitespace-nowrap"
                  onClick={() => setSearchTerm("")}
                >
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      <section
        aria-labelledby="results-heading"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      >
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <p className="section-label">Hasil API</p>
            <h2
              id="results-heading"
              className="font-playfair font-semibold text-xl text-textMain"
            >
              Topik:{" "}
              <span className="text-amber-700">{selectedTopicLabel}</span>
              <span className="font-crimson font-normal text-base text-slate-400 ml-2">
                · Halaman {currentPage}
              </span>
            </h2>
            {hasSearch && (
              <p className="font-crimson text-sm text-textSecondary mt-1">
                Hasil pencarian untuk "{debouncedSearchTerm}"
              </p>
            )}
          </div>
          <div
            className="flex items-center gap-2 text-sm font-crimson text-textSecondary
                          bg-white border border-borderSoft px-3 py-1.5 rounded-lg"
          >
            <Icon name="collection" className="w-4 h-4 text-accent" />
            {/* ✅ pakai books.length bukan PLACEHOLDER_BOOKS */}
            {startIndex + 1}-{Math.min(endIndex, filteredBooks.length)} dari{" "}
            {filteredBooks.length} buku
          </div>
        </div>

        {/* ✅ render dari prop books, bukan PLACEHOLDER_BOOKS */}
        {showLoading ? (
          <div className="rounded-lg border border-borderSoft bg-white/80 shadow-book">
            <LoadingSpinner message="Mengambil data dari Open Library API..." />
          </div>
        ) : hasFilteredBooks ? (
          <div className="mb-10 grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginatedBooks.map((book, i) => (
              <BookCard
                key={book.key || book.id || i}
                book={book}
                index={i}
                onSelect={setSelectedBook}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-borderSoft bg-white p-8 text-center mb-10">
            <p className="font-playfair text-lg font-semibold text-textMain">
              Buku tidak ditemukan
            </p>
            <p className="font-crimson text-sm text-textSecondary mt-1">
              Coba ubah kata kunci atau pilih topik lain.
            </p>
          </div>
        )}

        {/* Statistik rating — hanya muncul jika books punya field rating */}
        {filteredBooks.some((b) => b.rating) && (
          <section
            aria-labelledby="stats-heading"
            className="bg-white border border-borderSoft rounded-lg p-6 mb-8"
          >
            <p className="section-label mb-1">Statistik</p>
            <h3
              id="stats-heading"
              className="font-playfair font-semibold text-textMain mb-5"
            >
              Top 5 Rating Tertinggi
            </h3>
            <div className="space-y-3">
              {[...filteredBooks]
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 5)
                .map((book, i) => (
                  <div key={book.key || i} className="flex items-center gap-3">
                    <span className="w-5 text-xs font-bold text-textSecondary font-crimson">
                      {i + 1}
                    </span>
                    <span className="font-crimson text-sm text-secondary flex-1 truncate">
                      {book.title}
                    </span>
                    <span className="text-xs text-textSecondary font-crimson whitespace-nowrap">
                      ★ {book.rating}
                    </span>
                  </div>
                ))}
            </div>
          </section>
        )}

        {hasFilteredBooks && (
          <nav
            aria-label="Paginasi hasil buku"
            className="flex items-center justify-center gap-3 mt-10"
          >
            <button
              type="button"
              className="btn-secondary text-sm py-2 px-4"
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage(currentPage - 1);
                document
                  .getElementById("katalog")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              ← Sebelumnya
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                      page === currentPage
                        ? "bg-primary text-white"
                        : "bg-white border border-borderSoft text-textSecondary hover:border-primary hover:text-primary"
                    }`}
                    onClick={() => {
                      setCurrentPage(page);
                      document
                        .getElementById("katalog")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>
            <button
              type="button"
              className="btn-secondary text-sm py-2 px-4"
              disabled={currentPage === totalPages}
              onClick={() => {
                setCurrentPage(currentPage + 1);
                document
                  .getElementById("katalog")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Berikutnya →
            </button>
          </nav>
        )}
      </section>

      <BookModal
        key={selectedBook?.key || selectedBook?.id || "empty-book-modal"}
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
      />
    </>
  );
}
