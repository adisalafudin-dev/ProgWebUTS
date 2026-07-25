import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BookCard from "../components/BookCard";
import BookCardSkeleton from "../components/BookCardSkeleton";
import BookModal from "../components/BookModal";
import Icon from "../components/Icon";
import { SORT_OPTIONS } from "../constants/books";
import { useFavorites } from "../contexts/FavoriteContext.jsx";
import { useNotification } from "../contexts/NotificationContext.jsx";
import { useDebounce } from "../hooks/useDebounce";
import { formatRating, getBookId } from "../utils/bookHelpers.js";

// ─── Constants ────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 12;

const TOPICS = [
  { value: "Semua", label: "Semua", icon: "collection" },
  { value: "Fiction", label: "Fiksi", icon: "bookOpen" },
  { value: "Fantasy", label: "Fantasy", icon: "star" },
  { value: "Adventure", label: "Petualangan", icon: "compass" },
  { value: "Mystery", label: "Misteri", icon: "eye" },
  { value: "Romance", label: "Romansa", icon: "heart" },
  { value: "Science", label: "Sains", icon: "flask" },
  { value: "History", label: "Sejarah", icon: "globe" },
  { value: "Poetry", label: "Puisi", icon: "pen" },
  { value: "Philosophy", label: "Filsafat", icon: "scroll" },
  { value: "Children", label: "Anak-anak", icon: "star" },
];

const LANGUAGE_OPTIONS = [
  { value: "", label: "Semua Bahasa" },
  { value: "eng", label: "Inggris" },
  { value: "fre", label: "Perancis" },
  { value: "ger", label: "Jerman" },
  { value: "spa", label: "Spanyol" },
  { value: "ind", label: "Indonesia" },
  { value: "jpn", label: "Jepang" },
];

const YEAR_OPTIONS = [
  { value: "", label: "Semua Tahun" },
  { value: "2020", label: "2020 – Sekarang" },
  { value: "2010", label: "2010 – 2019" },
  { value: "2000", label: "2000 – 2009" },
  { value: "1990", label: "1990 – 1999" },
  { value: "1900", label: "Sebelum 1990" },
];

// ─── Helper functions ─────────────────────────────────────────────────────────

const getYearRange = (value) => {
  const map = {
    "2020": [2020, 9999],
    "2010": [2010, 2019],
    "2000": [2000, 2009],
    "1990": [1990, 1999],
    "1900": [0, 1989],
  };
  return map[value] || null;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ icon, value, label, color = "text-accent" }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-borderSoft bg-white px-4 py-3 shadow-book">
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cream ${color}`}
      >
        <Icon name={icon} className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="font-playfair text-lg font-bold leading-none text-textMain">
          {value ?? "—"}
        </p>
        <p className="mt-0.5 text-xs text-textSecondary font-crimson">{label}</p>
      </div>
    </div>
  );
}

function EmptyStateBlock({ onReset, onPopular }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-borderSoft bg-white py-16 px-6 text-center shadow-book mb-10">
      <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cream text-accentHover">
        <Icon name="bookOpen" className="h-8 w-8" strokeWidth={1.5} />
      </span>
      <h3 className="font-playfair text-xl font-semibold text-textMain">
        Tidak ada buku ditemukan
      </h3>
      <p className="mx-auto mt-2 max-w-sm font-crimson text-sm text-textSecondary">
        Coba gunakan kata kunci lain atau ubah filter pencarian yang sedang aktif.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button type="button" className="btn-secondary" onClick={onReset}>
          <Icon name="refresh" className="h-4 w-4" />
          Reset Filter
        </button>
        <button type="button" className="btn-primary" onClick={onPopular}>
          <Icon name="star" className="h-4 w-4" />
          Cari Buku Populer
        </button>
      </div>
    </div>
  );
}

function ErrorStateBlock({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-red-100 bg-white py-14 px-6 text-center shadow-book mb-10">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-accentHover">
        <Icon name="info" className="h-7 w-7" strokeWidth={1.5} />
      </span>
      <h3 className="font-playfair text-xl font-semibold text-textMain">
        Gagal Memuat Data
      </h3>
      <p className="mx-auto mt-2 max-w-sm font-crimson text-sm text-textSecondary">
        {message || "Terjadi kesalahan saat mengambil data dari Open Library API."}
      </p>
      <button type="button" className="btn-primary mt-6" onClick={onRetry}>
        <Icon name="refresh" className="h-4 w-4" />
        Coba Lagi
      </button>
    </div>
  );
}

function PaginationBar({ currentPage, totalPages, totalItems, startIndex, endIndex, onChange }) {
  const scrollToTop = useCallback(() => {
    document.getElementById("katalog-heading")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const goToPage = useCallback(
    (page) => {
      onChange(page);
      scrollToTop();
    },
    [onChange, scrollToTop]
  );

  if (totalPages <= 1) return null;

  // Build page number window
  const maxVisible = 5;
  let pages = [];
  if (totalPages <= maxVisible) {
    pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
    pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  return (
    <nav aria-label="Paginasi hasil buku" className="mt-10 space-y-3">
      <p className="text-center text-xs text-textSecondary font-crimson">
        Menampilkan{" "}
        <span className="font-semibold text-textMain">
          {startIndex + 1}–{Math.min(endIndex, totalItems)}
        </span>{" "}
        dari <span className="font-semibold text-textMain">{totalItems}</span> buku
      </p>
      <div className="flex items-center justify-center gap-1.5">
        <button
          type="button"
          className="btn-secondary min-h-9 px-3 py-2 text-sm disabled:opacity-40"
          disabled={currentPage === 1}
          onClick={() => goToPage(currentPage - 1)}
          aria-label="Halaman sebelumnya"
        >
          <Icon name="chevronLeft" className="h-4 w-4" />
          <span className="hidden sm:inline">Sebelumnya</span>
        </button>

        {pages[0] > 1 && (
          <>
            <button
              type="button"
              className="min-h-9 w-9 rounded-lg border border-borderSoft bg-white text-sm font-semibold text-textSecondary transition-all hover:border-primary hover:text-primary"
              onClick={() => goToPage(1)}
            >
              1
            </button>
            {pages[0] > 2 && (
              <span className="px-1 text-textSecondary text-sm">…</span>
            )}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className={`min-h-9 w-9 rounded-lg text-sm font-semibold transition-all ${
              page === currentPage
                ? "bg-primary text-white shadow-md"
                : "border border-borderSoft bg-white text-textSecondary hover:border-primary hover:text-primary"
            }`}
            aria-current={page === currentPage ? "page" : undefined}
            onClick={() => goToPage(page)}
          >
            {page}
          </button>
        ))}

        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && (
              <span className="px-1 text-textSecondary text-sm">…</span>
            )}
            <button
              type="button"
              className="min-h-9 w-9 rounded-lg border border-borderSoft bg-white text-sm font-semibold text-textSecondary transition-all hover:border-primary hover:text-primary"
              onClick={() => goToPage(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          type="button"
          className="btn-secondary min-h-9 px-3 py-2 text-sm disabled:opacity-40"
          disabled={currentPage === totalPages}
          onClick={() => goToPage(currentPage + 1)}
          aria-label="Halaman berikutnya"
        >
          <span className="hidden sm:inline">Berikutnya</span>
          <Icon name="chevronRight" className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function LibraryPage({
  books = [],
  isLoading = false,
  error = null,
  fetchData,
}) {
  const [searchParams] = useSearchParams();
  const { favoriteIds, toggleFavorite } = useFavorites();
  const { showToast } = useNotification();

  // ── Filter states ──────────────────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState("");
  const [authorTerm, setAuthorTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("Semua");
  const [submittedTopic, setSubmittedTopic] = useState("Semua");
  const [sortValue, setSortValue] = useState("default");
  const [yearFilter, setYearFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");

  // ── UI states ──────────────────────────────────────────────────────────────
  const [selectedBook, setSelectedBook] = useState(null);
  const [showLoading, setShowLoading] = useState(isLoading);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const [apiError, setApiError] = useState(null);

  // ── Debounced values ───────────────────────────────────────────────────────
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const debouncedAuthorTerm = useDebounce(authorTerm, 400);

  // ── Computed ───────────────────────────────────────────────────────────────
  const activeKeyword = debouncedSearchTerm.trim().toLowerCase();
  const activeAuthor = debouncedAuthorTerm.trim().toLowerCase();
  const searchSummary = [debouncedSearchTerm.trim(), debouncedAuthorTerm.trim()]
    .filter(Boolean)
    .join(" / ");
  const hasActiveFilters =
    searchTerm || authorTerm || selectedTopic !== "Semua" ||
    sortValue !== "default" || yearFilter || languageFilter;

  // ── URL query param handler ────────────────────────────────────────────────
  useEffect(() => {
    const queryParam = searchParams.get("q");
    if (queryParam) {
      setSearchTerm(queryParam);
      fetchData?.({ q: queryParam, author: "", genre: "Semua", sort: "default" });
    }
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Sync loading state with a short minimum display delay ─────────────────
  useEffect(() => {
    let timerId;
    if (isLoading) {
      setShowLoading(true);
    } else {
      timerId = setTimeout(() => setShowLoading(false), 600);
    }
    return () => clearTimeout(timerId);
  }, [isLoading]);

  // ── Propagate external error ───────────────────────────────────────────────
  useEffect(() => {
    setApiError(error || null);
  }, [error]);

  // ── Reset page when filters change ────────────────────────────────────────
  useEffect(() => {
    setSelectedBook(null);
    setCurrentPage(1);
  }, [activeKeyword, activeAuthor, submittedTopic, yearFilter, languageFilter, sortValue]);

  // ── Statistics derived from all books ─────────────────────────────────────
  const stats = useMemo(() => {
    if (!books.length) return null;
    const authors = new Set(
      books.flatMap((b) => b.authors || (b.author ? [b.author] : []))
    );
    const subjects = new Set(books.flatMap((b) => b.subjects || []));
    const publishers = new Set(
      books.flatMap((b) => b.publishers || (b.publisher ? [b.publisher] : []))
    );
    return {
      total: books.length,
      authors: authors.size,
      subjects: subjects.size,
      publishers: publishers.size,
    };
  }, [books]);

  // ── Check if language / year filters are available from data ──────────────
  const hasLanguageData = useMemo(
    () => books.some((b) => b.languages && b.languages.length > 0),
    [books]
  );
  const hasYearData = useMemo(
    () => books.some((b) => b.year && b.year !== "-"),
    [books]
  );

  // ── Filtered & sorted books ────────────────────────────────────────────────
  const filteredBooks = useMemo(() => {
    const yearRange = getYearRange(yearFilter);

    return books.filter((book) => {
      const bookText = [book.title, book.genre, ...(book.genres || []), ...(book.tags || [])]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !activeKeyword ||
        [book.title, book.author].join(" ").toLowerCase().includes(activeKeyword);

      const matchesAuthor =
        !activeAuthor ||
        (book.author || "").toLowerCase().includes(activeAuthor);

      const matchesTopic =
        submittedTopic === "Semua" ||
        bookText.includes(submittedTopic.toLowerCase());

      const matchesYear = !yearRange
        ? true
        : (() => {
            const y = Number(book.year);
            return y >= yearRange[0] && y <= yearRange[1];
          })();

      const matchesLanguage =
        !languageFilter ||
        (book.languages || []).some((lang) =>
          lang.toLowerCase().includes(languageFilter.toLowerCase())
        );

      return matchesSearch && matchesAuthor && matchesTopic && matchesYear && matchesLanguage;
    });
  }, [books, activeKeyword, activeAuthor, submittedTopic, yearFilter, languageFilter]);

  // ── Pagination ─────────────────────────────────────────────────────────────
  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedBooks = useMemo(
    () => filteredBooks.slice(startIndex, endIndex),
    [filteredBooks, startIndex, endIndex]
  );

  const isBookFavorite = useCallback(
    (book) => favoriteIds.has(getBookId(book)),
    [favoriteIds]
  );

  const getBookGenres = useCallback(
    (book) =>
      [...new Set([book.genre, ...(book.genres || []), ...(book.tags || [])].filter(Boolean))],
    []
  );

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleSearchSubmit = useCallback(
    (event) => {
      event.preventDefault();
      setSubmittedTopic(selectedTopic);
      fetchData?.({
        q: searchTerm.trim(),
        author: authorTerm.trim(),
        genre: selectedTopic,
        sort: sortValue,
      });
    },
    [searchTerm, authorTerm, selectedTopic, sortValue, fetchData]
  );

  const resetLibraryFilters = useCallback(() => {
    setSearchTerm("");
    setAuthorTerm("");
    setSelectedTopic("Semua");
    setSubmittedTopic("Semua");
    setSortValue("default");
    setYearFilter("");
    setLanguageFilter("");
    setCurrentPage(1);
    setApiError(null);
    fetchData?.(null);
    showToast("Filter direset", "Katalog kembali menampilkan semua koleksi.", "info");
  }, [fetchData, showToast]);

  const searchPopularBooks = useCallback(() => {
    setSearchTerm("popular");
    setAuthorTerm("");
    setSelectedTopic("Semua");
    setSubmittedTopic("Semua");
    setSortValue("rating-desc");
    setYearFilter("");
    setLanguageFilter("");
    setCurrentPage(1);
    setApiError(null);
    fetchData?.({ q: "popular", author: "", genre: "Semua", sort: "rating-desc" });
    showToast("Mencari buku populer", "Menampilkan hasil dengan kata kunci populer.", "info");
  }, [fetchData, showToast]);

  const handleRetry = useCallback(() => {
    setApiError(null);
    fetchData?.(null);
  }, [fetchData]);

  const selectedTopicLabel =
    TOPICS.find((t) => t.value === submittedTopic)?.label || submittedTopic;

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        id="katalog"
        aria-labelledby="katalog-heading"
        className="border-y border-accent/70 bg-gradient-to-br from-primary via-primary to-accentHover py-8 text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="section-label text-accent mb-1.5">
              Sistem Informasi Perpustakaan Digital
            </p>
            <h1
              id="katalog-heading"
              className="font-playfair font-bold text-2xl sm:text-3xl leading-tight"
            >
              Katalog Buku
            </h1>
            <p className="font-crimson text-white/60 mt-1.5 text-sm sm:text-base">
              Seluruh koleksi bersumber langsung dari{" "}
              <a
                href="https://openlibrary.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline underline-offset-2 hover:text-white transition-colors"
              >
                Open Library API
              </a>
              . Data diperbarui secara real&#8209;time.
            </p>
          </div>
        </div>
      </section>

      {/* ── STATISTICS ───────────────────────────────────────────────────── */}
      {stats && !showLoading && (
        <section
          aria-label="Statistik koleksi perpustakaan"
          className="border-b border-borderSoft bg-cream/60"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard icon="bookOpen" value={stats.total} label="Total Buku" />
              <StatCard
                icon="users"
                value={stats.authors}
                label="Total Penulis"
                color="text-secondary"
              />
              <StatCard
                icon="tag"
                value={stats.subjects}
                label="Total Subjek"
                color="text-accentHover"
              />
              {stats.publishers > 0 && (
                <StatCard
                  icon="globe"
                  value={stats.publishers}
                  label="Total Penerbit"
                  color="text-primary"
                />
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── FILTER ───────────────────────────────────────────────────────── */}
      <section
        aria-label="Filter dan pencarian katalog buku"
        className="border-b border-borderSoft bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <form
            action="#"
            method="get"
            noValidate
            onSubmit={handleSearchSubmit}
            className="space-y-4"
          >
            {/* Row 1: search + sort */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {/* Search judul */}
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary pointer-events-none"
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
                <label htmlFor="katalog-search" className="sr-only">
                  Cari judul buku
                </label>
                <input
                  id="katalog-search"
                  type="search"
                  name="search"
                  placeholder="Cari judul buku..."
                  autoComplete="off"
                  aria-label="Cari judul buku"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-9"
                />
              </div>

              {/* Search penulis */}
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
                <label htmlFor="katalog-author" className="sr-only">
                  Cari nama penulis
                </label>
                <input
                  id="katalog-author"
                  type="text"
                  name="author"
                  placeholder="Cari penulis..."
                  autoComplete="off"
                  aria-label="Cari nama penulis"
                  value={authorTerm}
                  onChange={(e) => setAuthorTerm(e.target.value)}
                  className="input-field pl-9"
                />
              </div>

              {/* Sort */}
              <div className="relative">
                <label htmlFor="katalog-sort" className="sr-only">
                  Urutkan hasil
                </label>
                <select
                  id="katalog-sort"
                  name="sort"
                  className="select-field pr-9"
                  aria-label="Urutkan hasil pencarian"
                  value={sortValue}
                  onChange={(e) => setSortValue(e.target.value)}
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Row 2: subject pills */}
            <fieldset>
              <legend className="sr-only">Pilih subjek buku</legend>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter subjek">
                {TOPICS.map((t) => (
                  <label key={t.value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="topic"
                      value={t.value}
                      checked={selectedTopic === t.value}
                      onChange={(e) => setSelectedTopic(e.target.value)}
                      className="sr-only peer"
                    />
                    <span
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border
                                 border-borderSoft bg-white px-3 py-1.5 text-xs font-semibold
                                 font-crimson text-textSecondary transition-all duration-300
                                 hover:border-accent hover:text-accentHover
                                 peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white"
                    >
                      <Icon name={t.icon} className="w-3.5 h-3.5" />
                      {t.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Row 3: Year + Language + action buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Year filter */}
              {hasYearData && (
                <div className="relative min-w-[10rem]">
                  <label htmlFor="katalog-year" className="sr-only">
                    Filter tahun terbit
                  </label>
                  <select
                    id="katalog-year"
                    name="year"
                    className="select-field pr-9 text-sm"
                    aria-label="Filter tahun terbit"
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                  >
                    {YEAR_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              )}

              {/* Language filter */}
              {hasLanguageData && (
                <div className="relative min-w-[10rem]">
                  <label htmlFor="katalog-lang" className="sr-only">
                    Filter bahasa
                  </label>
                  <select
                    id="katalog-lang"
                    name="language"
                    className="select-field pr-9 text-sm"
                    aria-label="Filter bahasa buku"
                    value={languageFilter}
                    onChange={(e) => setLanguageFilter(e.target.value)}
                  >
                    {LANGUAGE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              )}

              {/* Spacer */}
              <div className="flex-1" />

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-2">
                <button type="submit" className="btn-primary min-h-10 whitespace-nowrap">
                  <Icon name="search" className="w-4 h-4" strokeWidth={2} />
                  Cari
                </button>
                {hasActiveFilters && (
                  <button
                    type="button"
                    className="btn-secondary min-h-10 whitespace-nowrap"
                    onClick={resetLibraryFilters}
                    aria-label="Reset semua filter pencarian"
                  >
                    <Icon name="refresh" className="w-4 h-4" />
                    Reset Filter
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* ── RESULTS ──────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="results-heading"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Results bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <p className="section-label">Hasil Pencarian</p>
            <h2
              id="results-heading"
              className="font-playfair font-semibold text-lg text-textMain mt-0.5"
            >
              Kategori:{" "}
              <span className="text-accent">{selectedTopicLabel}</span>
              {searchSummary && (
                <span className="font-crimson font-normal text-sm text-textSecondary ml-2">
                  · "{searchSummary}"
                </span>
              )}
            </h2>
            {!showLoading && (
              <p className="font-crimson text-xs text-textSecondary mt-0.5">
                Menampilkan{" "}
                <span className="font-semibold text-textMain">{filteredBooks.length}</span> buku
                {yearFilter && (
                  <span> · {YEAR_OPTIONS.find((o) => o.value === yearFilter)?.label}</span>
                )}
                {languageFilter && (
                  <span>
                    {" "}
                    · {LANGUAGE_OPTIONS.find((o) => o.value === languageFilter)?.label}
                  </span>
                )}
              </p>
            )}
          </div>

          {/* View toggle — right-aligned */}
          <div
            className="inline-flex rounded-lg border border-borderSoft bg-white p-1 shadow-book"
            aria-label="Ubah mode tampilan katalog"
            role="group"
          >
            {[
              { value: "grid", label: "Grid", icon: "grid" },
              { value: "list", label: "List", icon: "collection" },
            ].map((view) => (
              <button
                key={view.value}
                type="button"
                className={`inline-flex min-h-8 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  viewMode === view.value
                    ? "bg-primary text-white shadow-sm"
                    : "text-textSecondary hover:bg-cream hover:text-accentHover"
                }`}
                aria-pressed={viewMode === view.value}
                aria-label={`Tampilan ${view.label}`}
                onClick={() => setViewMode(view.value)}
              >
                <Icon name={view.icon} className="h-3.5 w-3.5" />
                {view.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content area */}
        {showLoading ? (
          /* Skeleton loading */
          <div role="status" aria-live="polite" aria-label="Memuat data buku dari Open Library">
            {viewMode === "grid" ? (
              <div className="book-grid mb-10">
                {Array.from({ length: ITEMS_PER_PAGE }, (_, i) => (
                  <BookCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="space-y-3 mb-10">
                {Array.from({ length: 8 }, (_, i) => (
                  <BookCardSkeleton key={i} variant="list" />
                ))}
              </div>
            )}
            <span className="sr-only">Mengambil data dari Open Library API…</span>
          </div>
        ) : apiError && filteredBooks.length === 0 ? (
          /* Error state */
          <ErrorStateBlock message={apiError} onRetry={handleRetry} />
        ) : filteredBooks.length > 0 ? (
          /* Book grid / list */
          viewMode === "grid" ? (
            <div className="book-grid mb-2">
              {paginatedBooks.map((book, i) => (
                <BookCard
                  key={book.key || book.id || i}
                  book={book}
                  index={i}
                  onSelect={setSelectedBook}
                  isFavorite={isBookFavorite(book)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3 mb-2">
              {paginatedBooks.map((book, i) => {
                const bookGenres = getBookGenres(book);
                const isFav = isBookFavorite(book);
                return (
                  <article
                    key={book.key || book.id || i}
                    className="book-card grid grid-cols-[5rem_minmax(0,1fr)] gap-3 p-3 sm:grid-cols-[6rem_minmax(0,1fr)_auto] sm:items-center"
                    aria-label={`Buku: ${book.title} oleh ${book.author}`}
                  >
                    {/* Cover */}
                    <button
                      type="button"
                      className="h-28 overflow-hidden rounded-md bg-cream sm:h-36 relative shrink-0"
                      onClick={() => setSelectedBook(book)}
                      aria-label={`Lihat detail buku ${book.title}`}
                    >
                      {book.cover ? (
                        <img
                          src={book.cover}
                          alt={`Sampul buku ${book.title}`}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                      ) : (
                        <span className="flex h-full items-center justify-center p-2 text-center text-xs font-semibold text-textSecondary">
                          {book.title}
                        </span>
                      )}
                      {/* availability badge on cover */}
                      <span
                        className={`absolute bottom-1 left-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${
                          book.available ? "bg-cream text-primary" : "bg-accentHover text-white"
                        }`}
                      >
                        {book.available ? "Tersedia" : "Dipinjam"}
                      </span>
                    </button>

                    {/* Info */}
                    <div className="min-w-0 self-center">
                      <p className="section-label mb-0.5 truncate">
                        {bookGenres.slice(0, 2).join(" / ") || "General"}
                      </p>
                      <h3 className="font-playfair text-base font-bold leading-snug text-textMain line-clamp-2 sm:text-lg">
                        {book.title}
                      </h3>
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-textSecondary sm:text-sm">
                        <span className="line-clamp-1 font-semibold">
                          {book.author || "Penulis tidak diketahui"}
                        </span>
                        <span className="text-borderSoft">·</span>
                        <span>{book.year || "—"}</span>
                        {book.publisher && (
                          <>
                            <span className="text-borderSoft">·</span>
                            <span className="line-clamp-1 italic">{book.publisher}</span>
                          </>
                        )}
                        {Number(book.rating) > 0 && (
                          <>
                            <span className="text-borderSoft">·</span>
                            <span className="inline-flex items-center gap-1 font-semibold text-accentHover">
                              <Icon name="star" className="h-3 w-3 text-accent" />
                              {formatRating(book.rating)}
                            </span>
                          </>
                        )}
                      </div>
                      {/* Subject tags */}
                      {book.subjects && book.subjects.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {book.subjects.slice(0, 3).map((s) => (
                            <span
                              key={s}
                              className="rounded-full bg-cream px-2 py-0.5 text-[10px] font-semibold leading-none text-secondary"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex flex-wrap gap-2 sm:col-span-1 sm:flex-col sm:items-end">
                      <button
                        type="button"
                        className={`inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all sm:text-sm ${
                          isFav
                            ? "border-red-500 bg-red-500 text-white hover:bg-red-600"
                            : "border-borderSoft bg-white text-secondary hover:border-red-400 hover:text-red-500"
                        }`}
                        aria-pressed={isFav}
                        aria-label={isFav ? `Hapus ${book.title} dari favorit` : `Simpan ${book.title} ke favorit`}
                        onClick={() => toggleFavorite(book)}
                      >
                        <Icon name="heart" className="h-3.5 w-3.5" />
                        {isFav ? "Hapus" : "Favorit"}
                      </button>
                      <button
                        type="button"
                        className="btn-primary min-h-9 px-3 py-1.5 text-xs sm:text-sm"
                        aria-label={`Lihat detail buku ${book.title}`}
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
          /* Empty state */
          <EmptyStateBlock onReset={resetLibraryFilters} onPopular={searchPopularBooks} />
        )}

        {/* Pagination */}
        {!showLoading && filteredBooks.length > 0 && (
          <PaginationBar
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredBooks.length}
            startIndex={startIndex}
            endIndex={endIndex}
            onChange={setCurrentPage}
          />
        )}

        {/* Top-5 rating stats (only if rating data is available) */}
        {!showLoading && filteredBooks.some((b) => b.rating) && (
          <section
            aria-labelledby="stats-rating-heading"
            className="bg-white border border-borderSoft rounded-xl p-6 mt-10 shadow-book"
          >
            <p className="section-label mb-1">Statistik</p>
            <h3
              id="stats-rating-heading"
              className="font-playfair font-semibold text-textMain mb-4"
            >
              Top 5 Rating Tertinggi
            </h3>
            <div className="space-y-3">
              {[...filteredBooks]
                .filter((b) => b.rating)
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 5)
                .map((book, i) => (
                  <div
                    key={book.key || i}
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => setSelectedBook(book)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setSelectedBook(book)}
                    aria-label={`Lihat detail: ${book.title}`}
                  >
                    <span className="w-5 text-xs font-bold text-textSecondary font-crimson shrink-0">
                      #{i + 1}
                    </span>
                    <span className="font-crimson text-sm text-secondary flex-1 truncate group-hover:text-accentHover transition-colors">
                      {book.title}
                    </span>
                    <span className="text-xs text-accentHover font-semibold font-crimson whitespace-nowrap">
                      ★ {formatRating(book.rating)}
                    </span>
                  </div>
                ))}
            </div>
          </section>
        )}
      </section>

      {/* ── MODAL ────────────────────────────────────────────────────────── */}
      <BookModal
        key={selectedBook?.key || selectedBook?.id || "empty-book-modal"}
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        isFavorite={isBookFavorite(selectedBook)}
        onToggleFavorite={toggleFavorite}
        onToast={showToast}
      />
    </>
  );
}
