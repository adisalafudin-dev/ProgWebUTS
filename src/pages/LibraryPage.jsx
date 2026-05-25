import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import BookCardSkeleton from "../components/BookCardSkeleton";
import BookModal from "../components/BookModal";
import Icon from "../components/Icon";
import { SORT_OPTIONS } from "../data/books";

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

const getBookId = (book) =>
  book?.key || book?.id || book?.workKey || book?.title;

// ✅ Terima prop books dari App
export default function LibraryPage({
  books = [],
  isLoading = false,
  fetchData,
  favoriteIds = new Set(),
  onToggleFavorite,
  onToast,
}) {
  const ITEMS_PER_PAGE = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [authorTerm, setAuthorTerm] = useState("");
  const [submittedAuthorTerm, setSubmittedAuthorTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("Semua");
  const [submittedTopic, setSubmittedTopic] = useState("Semua");
  const [sortValue, setSortValue] = useState("default");
  const [selectedBook, setSelectedBook] = useState(null);
  const [showLoading, setShowLoading] = useState(isLoading);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const [searchMessage, setSearchMessage] = useState("");

  const activeKeyword = debouncedSearchTerm.trim().toLowerCase();
  const activeAuthor = submittedAuthorTerm.trim().toLowerCase();
  const hasSearch = activeKeyword !== "";
  const selectedTopicLabel =
    TOPICS.find((topic) => topic.value === submittedTopic)?.label ||
    submittedTopic;
  const isBookFavorite = (book) => favoriteIds.has(getBookId(book));
  const getBookGenres = (book) =>
    [book.genre, ...(book.genres || []), ...(book.tags || [])].filter(Boolean);

  useEffect(() => {
    setSelectedBook(null);
    setCurrentPage(1);
    if (activeKeyword || activeAuthor || submittedTopic !== "Semua")
      setSearchMessage("");
  }, [activeKeyword, activeAuthor, submittedTopic]);

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
      book.genre,
      ...(book.genres || []),
      ...(book.tags || []),
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      activeKeyword === "" ||
      [book.title, book.author].join(" ").toLowerCase().includes(activeKeyword);
    const matchesAuthor =
      activeAuthor === "" ||
      (book.author || "").toLowerCase().includes(activeAuthor);
    const matchesTopic =
      submittedTopic === "Semua" ||
      searchableText.includes(submittedTopic.toLowerCase());

    return matchesSearch && matchesAuthor && matchesTopic;
  });
  const hasFilteredBooks = filteredBooks.length > 0;

  // Pagination logic
  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const hasKeyword = searchTerm.trim() !== "";
    const hasAuthor = authorTerm.trim() !== "";
    const hasTopic = selectedTopic !== "Semua";
    const hasSort = sortValue !== "default";

    if (!hasKeyword && !hasAuthor && !hasTopic && !hasSort) {
      const message = "Masukkan judul, penulis, pilih genre, atau urutkan dulu.";
      setSearchMessage(message);
      onToast?.("Pencarian masih kosong", message, "info");
      return;
    }

    setSearchMessage("");
    setDebouncedSearchTerm(searchTerm);
    setSubmittedAuthorTerm(authorTerm);
    setSubmittedTopic(selectedTopic);
    fetchData?.({
      q: searchTerm.trim(),
      author: authorTerm.trim(),
      genre: selectedTopic,
      yearMin: 1800,
      minRating: 0,
      available: false,
      featured: false,
      sort: sortValue,
    });
  };

  const resetLibraryFilters = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setAuthorTerm("");
    setSubmittedAuthorTerm("");
    setSelectedTopic("Semua");
    setSubmittedTopic("Semua");
    setSortValue("default");
    setCurrentPage(1);
    setSearchMessage("");
    fetchData?.(null);
    onToast?.(
      "Pencarian direset",
      "Katalog API kembali menampilkan semua hasil.",
      "info",
    );
  };

  const searchPopularBooks = () => {
    setSearchTerm("popular");
    setDebouncedSearchTerm("popular");
    setAuthorTerm("");
    setSubmittedAuthorTerm("");
    setSelectedTopic("Semua");
    setSubmittedTopic("Semua");
    setSortValue("rating-desc");
    setCurrentPage(1);
    setSearchMessage("");
    fetchData?.({
      q: "popular",
      author: "",
      genre: "Semua",
      yearMin: 1800,
      minRating: 0,
      available: false,
      featured: false,
      sort: "rating-desc",
    });
    onToast?.(
      "Mencari buku populer",
      "Katalog menampilkan hasil dengan kata kunci populer.",
      "info",
    );
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
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="relative">
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
                    Cari judul buku
                  </label>
                  <input
                    id="api-search"
                    type="search"
                    name="search"
                    placeholder="Cari judul buku..."
                    autoComplete="off"
                    aria-invalid={searchMessage ? "true" : undefined}
                    aria-describedby={
                      searchMessage ? "api-search-message" : undefined
                    }
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="input-field pl-9"
                  />
                </div>

                <div>
                  <label htmlFor="api-author" className="sr-only">
                    Cari nama penulis
                  </label>
                  <input
                    id="api-author"
                    type="text"
                    name="author"
                    placeholder="Cari penulis..."
                    autoComplete="off"
                    value={authorTerm}
                    onChange={(event) => setAuthorTerm(event.target.value)}
                    className="input-field"
                  />
                </div>

                <div className="relative">
                  <label htmlFor="api-sort" className="sr-only">
                    Urutkan hasil
                  </label>
                  <select
                    id="api-sort"
                    name="sort"
                    className="select-field"
                    value={sortValue}
                    onChange={(event) => setSortValue(event.target.value)}
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary pointer-events-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {searchMessage && (
                <p
                  id="api-search-message"
                  className="text-sm font-semibold text-accentHover"
                >
                  {searchMessage}
                </p>
              )}

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
              {(searchTerm ||
                authorTerm ||
                selectedTopic !== "Semua" ||
                sortValue !== "default") && (
                <button
                  type="button"
                  className="btn-secondary min-h-11 whitespace-nowrap"
                  onClick={resetLibraryFilters}
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
          <div
            className="inline-flex rounded-lg border border-borderSoft bg-white p-1 shadow-book"
            aria-label="Ubah mode tampilan katalog"
          >
            {[
              { value: "grid", label: "Grid View", icon: "collection" },
              { value: "list", label: "List View", icon: "bookOpen" },
            ].map((view) => (
              <button
                key={view.value}
                type="button"
                className={`inline-flex min-h-9 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-300 ${
                  viewMode === view.value
                    ? "bg-primary text-white"
                    : "text-textSecondary hover:bg-cream hover:text-accentHover"
                }`}
                aria-pressed={viewMode === view.value}
                onClick={() => setViewMode(view.value)}
              >
                <Icon name={view.icon} className="h-3.5 w-3.5" />
                {view.label}
              </button>
            ))}
          </div>
        </div>

        {/* ✅ render dari prop books, bukan PLACEHOLDER_BOOKS */}
        {showLoading ? (
          <div className="mb-10" role="status" aria-live="polite">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,13.5rem),1fr))] items-stretch gap-5 lg:gap-6">
                {Array.from({ length: 8 }, (_, index) => (
                  <BookCardSkeleton key={index} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {Array.from({ length: 8 }, (_, index) => (
                  <BookCardSkeleton key={index} variant="list" />
                ))}
              </div>
            )}
            <span className="sr-only">
              Mengambil data dari Open Library API...
            </span>
          </div>
        ) : hasFilteredBooks ? (
          viewMode === "grid" ? (
            <div className="mb-10 grid grid-cols-[repeat(auto-fit,minmax(min(100%,13.5rem),1fr))] items-stretch gap-5 lg:gap-6">
              {paginatedBooks.map((book, i) => (
                <BookCard
                  key={book.key || book.id || i}
                  book={book}
                  index={i}
                  onSelect={setSelectedBook}
                  isFavorite={isBookFavorite(book)}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="mb-10 space-y-3">
              {paginatedBooks.map((book, i) => {
                const bookGenres = [...new Set(getBookGenres(book))];

                return (
                  <article
                    key={book.key || book.id || i}
                    className="book-card grid grid-cols-[5rem_minmax(0,1fr)] gap-3 p-3 sm:grid-cols-[6rem_minmax(0,1fr)_auto] sm:items-center"
                  >
                    <button
                      type="button"
                      className="h-28 overflow-hidden rounded-md bg-cream sm:h-36"
                      onClick={() => setSelectedBook(book)}
                    >
                      {book.cover ? (
                        <img
                          src={book.cover}
                          alt={`Sampul buku ${book.title}`}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="flex h-full items-center justify-center p-2 text-center text-xs font-semibold text-textSecondary">
                          {book.title}
                        </span>
                      )}
                    </button>

                    <div className="min-w-0 self-center">
                      <p className="section-label mb-1 truncate">
                        {bookGenres.slice(0, 2).join(" / ") || "General"}
                      </p>
                      <h3 className="font-playfair text-base font-bold leading-snug text-textMain line-clamp-2 sm:text-lg">
                        {book.title}
                      </h3>
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-textSecondary sm:text-sm">
                        <span className="line-clamp-1 font-semibold">
                          {book.author || "Penulis tidak diketahui"}
                        </span>
                        <span className="hidden text-borderSoft sm:inline">
                          /
                        </span>
                        <span>{book.year || "-"}</span>
                        <span className="text-borderSoft">/</span>
                        <span className="inline-flex items-center gap-1 font-semibold text-accentHover">
                          <Icon
                            name="star"
                            className="h-3.5 w-3.5 text-accent"
                          />
                          {book.rating || "-"}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {bookGenres.slice(0, 4).map((genre) => (
                          <span
                            key={genre}
                            className="rounded-full bg-cream px-2 py-0.5 text-[10px] font-semibold leading-none text-secondary"
                          >
                            {genre}
                          </span>
                        ))}
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none ${
                            book.available
                              ? "bg-cream text-primary"
                              : "bg-accentHover text-white"
                          }`}
                        >
                          {book.available ? "Tersedia" : "Dipinjam"}
                        </span>
                      </div>
                    </div>

                    <div className="col-span-2 grid grid-cols-2 gap-2 sm:col-span-1 sm:flex sm:flex-wrap sm:justify-end">
                      <button
                        type="button"
                        className={`inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all sm:text-sm ${
                          isBookFavorite(book)
                            ? "border-accent bg-accent text-white hover:bg-accentHover"
                            : "border-borderSoft bg-white text-secondary hover:border-accent hover:text-accentHover"
                        }`}
                        aria-pressed={isBookFavorite(book)}
                        onClick={() => onToggleFavorite?.(book)}
                      >
                        <Icon name="heart" className="h-3.5 w-3.5" />
                        {isBookFavorite(book) ? "Hapus" : "Favorit"}
                      </button>
                      <button
                        type="button"
                        className="btn-primary min-h-9 px-3 py-1.5 text-xs sm:text-sm"
                        onClick={() => setSelectedBook(book)}
                      >
                        Lihat Detail
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )
        ) : (
          <div className="rounded-lg border border-borderSoft bg-white p-8 text-center mb-10 shadow-book">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-cream text-accentHover">
              <Icon name="search" className="h-7 w-7" strokeWidth={2} />
            </div>
            <p className="font-playfair text-xl font-semibold text-textMain">
              Buku tidak ditemukan
            </p>
            <p className="mx-auto mt-2 max-w-md font-crimson text-sm text-textSecondary">
              Coba gunakan kata kunci lain, ubah genre, atau reset filter.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                className="btn-secondary"
                onClick={resetLibraryFilters}
              >
                Reset Filter
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={searchPopularBooks}
              >
                Cari Buku Populer
              </button>
            </div>
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
        isFavorite={isBookFavorite(selectedBook)}
        onToggleFavorite={onToggleFavorite}
        onToast={onToast}
      />
    </>
  );
}
