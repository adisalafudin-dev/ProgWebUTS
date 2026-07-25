import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BookCard from "../components/BookCard";
import BookCardSkeleton from "../components/BookCardSkeleton";
import BookModal from "../components/BookModal";
import Icon from "../components/Icon";
import EmptyState from "../components/EmptyState";
import { useFavorites } from "../contexts/FavoriteContext.jsx";
import { useNotification } from "../contexts/NotificationContext.jsx";
import { formatRating, getBookId } from "../utils/bookHelpers.js";

// Helper algorithms to compute ratings and recommendation scores
const getNumericYear = (book) => {
  const year = Number(book?.year || book?.first_publish_year);
  return Number.isFinite(year) ? year : 0;
};

const getRecommendationGenres = (book) =>
  [book?.genre, ...(book?.genres || []), ...(book?.tags || []), ...(book?.subjects || [])].filter(
    Boolean
  );

const getRecommendedBooks = (books, limit = 8) => {
  if (!books || books.length === 0) return [];

  const genreCounts = books.reduce((counts, book) => {
    getRecommendationGenres(book).forEach((genre) => {
      counts.set(genre, (counts.get(genre) || 0) + 1);
    });
    return counts;
  }, new Map());

  const years = books.map(getNumericYear).filter(Boolean);
  const newestYear = years.length > 0 ? Math.max(...years) : 0;
  const oldestYear = years.length > 0 ? Math.min(...years) : newestYear;
  const yearRange = Math.max(newestYear - oldestYear, 1);
  const maxGenreCount = Math.max(...genreCounts.values(), 1);

  return [...books]
    .map((book, index) => {
      const rating = Number(book.rating) || 0;
      const year = getNumericYear(book);
      const genres = getRecommendationGenres(book);
      const genrePopularity =
        genres.length > 0
          ? Math.max(...genres.map((genre) => genreCounts.get(genre) || 0))
          : 0;

      const score =
        (rating / 5) * 40 +
        (year ? ((year - oldestYear) / yearRange) * 25 : 0) +
        (genrePopularity / maxGenreCount) * 20 +
        (book.available ? 15 : 0);

      return { book, index, score, rating, year };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.rating !== a.rating) return b.rating - a.rating;
      if (b.year !== a.year) return b.year - a.year;
      return a.index - b.index;
    })
    .slice(0, limit)
    .map(({ book }) => book);
};

export default function ExplorePage({
  books = [],
  featuredSourceBooks = books,
  error = null,
  fetchData,
  isLoading = false,
}) {
  const navigate = useNavigate();
  const { favoriteIds, toggleFavorite } = useFavorites();
  const { showToast } = useNotification();

  const [selectedBook, setSelectedBook] = useState(null);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  // Search state
  const [searchTitle, setSearchTitle] = useState("");
  const [searchAuthor, setSearchAuthor] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const isBookFavorite = (book) => favoriteIds.has(getBookId(book));

  // Compute recommended & newest books
  const featuredBooks = useMemo(
    () => getRecommendedBooks(featuredSourceBooks, 6),
    [featuredSourceBooks]
  );

  const heroBook = featuredBooks[activeHeroIndex] || featuredBooks[0] || books[0];

  const newestBooks = useMemo(() => {
    return [...books]
      .sort((a, b) => getNumericYear(b) - getNumericYear(a))
      .slice(0, 8);
  }, [books]);

  const recommendedList = useMemo(() => {
    return featuredBooks.length > 0 ? featuredBooks : books.slice(0, 8);
  }, [featuredBooks, books]);

  // Dynamic statistics computed from API data
  const stats = useMemo(() => {
    const totalBooks = books.length;
    const authors = new Set(books.map((b) => b.author).filter(Boolean));
    const publishers = new Set(
      books.flatMap((b) => (Array.isArray(b.publisher) ? b.publisher : [b.publisher])).filter(Boolean)
    );
    const subjects = new Set(
      books.flatMap((b) => [b.genre, ...(b.genres || []), ...(b.subjects || [])]).filter(Boolean)
    );

    return {
      totalBooks,
      totalAuthors: authors.size,
      totalPublishers: publishers.size,
      totalSubjects: subjects.size,
    };
  }, [books]);

  // Extract popular categories (subjects) from Open Library API data
  const popularCategories = useMemo(() => {
    const categoryMap = new Map();
    books.forEach((book) => {
      const genres = [
        book.genre,
        ...(book.genres || []),
        ...(book.tags || []),
        ...(book.subjects || []),
      ].filter(Boolean);

      genres.forEach((g) => {
        const cleanName = g.trim();
        if (cleanName && cleanName !== "Semua") {
          categoryMap.set(cleanName, (categoryMap.get(cleanName) || 0) + 1);
        }
      });
    });

    const sorted = [...categoryMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    return sorted.map(([name, count]) => ({ name, count }));
  }, [books]);

  // Extract popular authors from Open Library API data
  const popularAuthors = useMemo(() => {
    const authorMap = new Map();
    books.forEach((book) => {
      if (book.author && book.author !== "Penulis Tidak Diketahui") {
        const name = book.author.trim();
        if (!authorMap.has(name)) {
          authorMap.set(name, { name, count: 0, sampleBook: book });
        }
        authorMap.get(name).count += 1;
      }
    });

    return [...authorMap.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [books]);

  // Extract popular publishers from Open Library API data
  const popularPublishers = useMemo(() => {
    const pubMap = new Map();
    books.forEach((book) => {
      const publishers = Array.isArray(book.publisher)
        ? book.publisher
        : [book.publisher];
      publishers.filter(Boolean).forEach((pub) => {
        const name = pub.trim();
        if (name) {
          pubMap.set(name, (pubMap.get(name) || 0) + 1);
        }
      });
    });

    return [...pubMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ name, count }));
  }, [books]);

  // Hero carousel auto-play
  useEffect(() => {
    if (featuredBooks.length <= 1) return undefined;

    const timerId = setInterval(() => {
      setActiveHeroIndex((current) => (current + 1) % featuredBooks.length);
    }, 5000);

    return () => clearInterval(timerId);
  }, [featuredBooks.length]);

  // Handle Search Submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTitle.trim() || searchAuthor.trim() || selectedCategory !== "Semua") {
      const query = [searchTitle.trim(), searchAuthor.trim()].filter(Boolean).join(" ");
      navigate(`/books?q=${encodeURIComponent(query)}&genre=${encodeURIComponent(selectedCategory)}`);
    } else {
      navigate("/books");
    }
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/books?genre=${encodeURIComponent(categoryName)}`);
  };

  const handleAuthorClick = (authorName) => {
    navigate(`/books?q=${encodeURIComponent(authorName)}`);
  };

  const handlePublisherClick = (publisherName) => {
    navigate(`/books?q=${encodeURIComponent(publisherName)}`);
  };

  // Error State
  if (error && books.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-cream px-4">
        <div className="max-w-md w-full rounded-2xl border border-red-200 bg-white p-8 text-center shadow-book">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-accentHover">
            <Icon name="info" className="h-7 w-7" />
          </div>
          <h2 className="font-playfair text-2xl font-bold text-textMain mb-2">
            Gagal Memuat Data Perpustakaan
          </h2>
          <p className="font-crimson text-textSecondary mb-6 leading-relaxed">
            {error || "API Open Library belum bisa diakses. Silakan periksa koneksi Anda dan coba lagi."}
          </p>
          <button
            type="button"
            className="btn-primary w-full justify-center py-3"
            onClick={() => fetchData?.()}
          >
            <Icon name="refresh" className="h-4 w-4" />
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-12 pb-10">
      {/* 1. HERO SECTION */}
      <section
        key={`hero-section-${heroBook?.key || heroBook?.id || activeHeroIndex}`}
        aria-label="Hero Banner Perpustakaan Digital"
        className="relative overflow-hidden rounded-3xl bg-primary text-white shadow-2xl transition-all duration-700"
      >
        {/* Dynamic Cover Background Layers */}
        {heroBook?.cover ? (
          <>
            <div
              key={`hero-bg-motion-${heroBook?.key || heroBook?.id || activeHeroIndex}`}
              className="hero-bg-motion absolute inset-0 bg-cover bg-center opacity-75 blur-xl scale-105"
              style={{ backgroundImage: `url(${heroBook.cover})` }}
              aria-hidden="true"
            />
            <div
              key={`hero-bg-clear-${heroBook?.key || heroBook?.id || activeHeroIndex}`}
              className="hero-bg-clear absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
              style={{ backgroundImage: `url(${heroBook.cover})` }}
              aria-hidden="true"
            />
          </>
        ) : null}

        {/* Readability Gradient Overlays */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#0a1a18]/95 via-[#0a1a18]/85 to-[#0a1a18]/50 lg:via-[#0a1a18]/80"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(217,119,6,0.2),transparent_55%)]"
          aria-hidden="true"
        />

        <div className="relative px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div key={`hero-copy-${heroBook?.key || heroBook?.id || activeHeroIndex}`} className="hero-copy-motion">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-accent shadow-sm backdrop-blur-md">
                <Icon name="shield" className="h-3.5 w-3.5" />
                <span>Sistem Informasi Perpustakaan Digital</span>
              </div>

              <h1 className="mb-4 font-playfair text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                {heroBook ? heroBook.title : "Katalog & Koleksi Digital AksaraHub"}
              </h1>

              <p className="mb-6 max-w-xl text-base text-white/80 leading-relaxed sm:text-lg">
                {heroBook ? (
                  <>
                    Ditulis oleh{" "}
                    <span className="font-semibold text-accent">{heroBook.author}</span>
                    {heroBook.year !== "-" && ` (${heroBook.year})`} - Akses ribuan judul referensi ilmiah, sastra, dan buku populer secara real-time dari Open Library.
                  </>
                ) : (
                  "Temukan ribuan referensi buku ilmiah, sastra, dan pengetahuan umum yang terhubung langsung secara terpadu."
                )}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link to="/books" className="btn-primary py-3 px-6 text-base">
                  <Icon name="compass" className="h-5 w-5" />
                  Jelajahi Katalog
                </Link>
                <Link to="/favorites" className="btn-secondary text-primary py-3 px-6 text-base">
                  <Icon name="heart" className="h-5 w-5" />
                  Rak Favorit
                </Link>
                {heroBook && (
                  <button
                    type="button"
                    onClick={() => toggleFavorite(heroBook)}
                    className={`inline-flex items-center gap-2 rounded-lg border px-4 py-3 font-semibold transition-all duration-300 ${
                      isBookFavorite(heroBook)
                        ? "border-red-500 bg-red-500 text-white"
                        : "border-white/20 bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    <Icon name="heart" className="h-4 w-4" />
                    {isBookFavorite(heroBook) ? "Favorit" : "Simpan"}
                  </button>
                )}
              </div>

              {/* Slide indicators if multiple hero books */}
              {featuredBooks.length > 1 && (
                <div className="mt-8 flex items-center gap-2">
                  {featuredBooks.map((book, idx) => (
                    <button
                      key={book.key || idx}
                      type="button"
                      onClick={() => setActiveHeroIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === activeHeroIndex ? "w-8 bg-accent" : "w-2 bg-white/30 hover:bg-white/60"
                      }`}
                      aria-label={`Slide ${idx + 1}: ${book.title}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Hero Cover Card */}
            <div key={`hero-cover-${heroBook?.key || heroBook?.id || activeHeroIndex}`} className="hero-cover-motion flex justify-center lg:justify-end">
              {isLoading && !heroBook ? (
                <div className="aspect-[2/3] w-48 animate-pulse rounded-2xl bg-white/10 sm:w-56" />
              ) : heroBook ? (
                <div
                  className="group relative cursor-pointer"
                  onClick={() => setSelectedBook(heroBook)}
                >
                  <div className="relative aspect-[2/3] w-48 overflow-hidden rounded-2xl border border-white/20 bg-secondary shadow-2xl transition-transform duration-500 group-hover:scale-105 sm:w-56">
                    {heroBook.cover ? (
                      <img
                        src={heroBook.cover}
                        alt={heroBook.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col justify-center p-6 text-center">
                        <Icon name="bookOpen" className="mx-auto mb-3 h-10 w-10 text-accent" />
                        <p className="font-playfair font-bold text-white text-sm">{heroBook.title}</p>
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-3 -right-3 rounded-xl bg-white px-3 py-1.5 shadow-lg">
                    <div className="flex items-center gap-1 text-sm font-bold text-textMain">
                      <Icon name="star" className="h-4 w-4 text-accent fill-accent" />
                      <span>{formatRating(heroBook.rating, "4.5")}</span>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* 2. SEARCH BUKU */}
      <section
        aria-label="Pencarian Buku Utama"
        className="rounded-2xl border border-borderSoft bg-white p-6 shadow-book lg:p-8"
      >
        <div className="mb-6">
          <p className="section-label mb-1">Pencarian Cepat</p>
          <h2 className="font-playfair text-2xl font-bold text-textMain sm:text-3xl">
            Cari Buku di Koleksi Perpustakaan
          </h2>
          <p className="text-sm text-textSecondary mt-1">
            Gunakan filter judul, nama penulis, atau kategori subjek untuk menemukan pustaka yang Anda inginkan.
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Input Judul / Kata Kunci */}
            <div>
              <label htmlFor="search-title" className="section-label mb-1.5 block text-xs">
                Judul / Kata Kunci
              </label>
              <div className="relative">
                <Icon name="search" className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary" />
                <input
                  id="search-title"
                  type="text"
                  placeholder="Contoh: Chemistry, Physics..."
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Input Penulis */}
            <div>
              <label htmlFor="search-author" className="section-label mb-1.5 block text-xs">
                Penulis
              </label>
              <div className="relative">
                <Icon name="users" className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary" />
                <input
                  id="search-author"
                  type="text"
                  placeholder="Nama Penulis..."
                  value={searchAuthor}
                  onChange={(e) => setSearchAuthor(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Select Subjek / Kategori */}
            <div>
              <label htmlFor="search-category" className="section-label mb-1.5 block text-xs">
                Kategori Subjek
              </label>
              <div className="relative">
                <Icon name="tag" className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary pointer-events-none" />
                <select
                  id="search-category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input-field pl-10 appearance-none bg-white cursor-pointer"
                >
                  <option value="Semua">Semua Kategori</option>
                  {popularCategories.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name} ({cat.count})
                    </option>
                  ))}
                </select>
                <Icon name="chevronDown" className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            {(searchTitle || searchAuthor || selectedCategory !== "Semua") && (
              <button
                type="button"
                onClick={() => {
                  setSearchTitle("");
                  setSearchAuthor("");
                  setSelectedCategory("Semua");
                }}
                className="btn-secondary py-2.5 text-xs"
              >
                Reset Filter
              </button>
            )}
            <button type="submit" className="btn-primary py-2.5 px-6 text-sm">
              <Icon name="search" className="h-4 w-4" />
              Cari Katalog
            </button>
          </div>
        </form>
      </section>

      {/* 3. STATISTIK SINGKAT */}
      <section aria-label="Statistik Koleksi Perpustakaan">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-borderSoft bg-white p-5 shadow-book transition-transform hover:-translate-y-1">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accentHover">
              <Icon name="bookOpen" className="h-5 w-5" />
            </div>
            <p className="font-playfair text-2xl font-extrabold text-textMain sm:text-3xl">
              {isLoading ? "..." : stats.totalBooks}
            </p>
            <p className="text-xs font-semibold text-textSecondary uppercase tracking-wider mt-1">
              Total Koleksi Buku
            </p>
          </div>

          <div className="rounded-2xl border border-borderSoft bg-white p-5 shadow-book transition-transform hover:-translate-y-1">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Icon name="users" className="h-5 w-5" />
            </div>
            <p className="font-playfair text-2xl font-extrabold text-textMain sm:text-3xl">
              {isLoading ? "..." : stats.totalAuthors}
            </p>
            <p className="text-xs font-semibold text-textSecondary uppercase tracking-wider mt-1">
              Penulis Terdaftar
            </p>
          </div>

          <div className="rounded-2xl border border-borderSoft bg-white p-5 shadow-book transition-transform hover:-translate-y-1">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700">
              <Icon name="tag" className="h-5 w-5" />
            </div>
            <p className="font-playfair text-2xl font-extrabold text-textMain sm:text-3xl">
              {isLoading ? "..." : stats.totalSubjects}
            </p>
            <p className="text-xs font-semibold text-textSecondary uppercase tracking-wider mt-1">
              Kategori Subjek
            </p>
          </div>

          <div className="rounded-2xl border border-borderSoft bg-white p-5 shadow-book transition-transform hover:-translate-y-1">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-purple-700">
              <Icon name="globe" className="h-5 w-5" />
            </div>
            <p className="font-playfair text-2xl font-extrabold text-textMain sm:text-3xl">
              {isLoading ? "..." : stats.totalPublishers}
            </p>
            <p className="text-xs font-semibold text-textSecondary uppercase tracking-wider mt-1">
              Penerbit Terkoneksi
            </p>
          </div>
        </div>
      </section>

      {/* 4. BUKU TERBARU */}
      <section aria-labelledby="heading-buku-terbaru">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="section-label mb-1">Penerbitan Terbaru</p>
            <h2 id="heading-buku-terbaru" className="font-playfair text-2xl font-bold text-textMain sm:text-3xl">
              Buku Rilisan Terbaru
            </h2>
          </div>
          <Link to="/books?sort=year-desc" className="flex items-center gap-1.5 text-sm font-semibold text-accentHover hover:underline">
            <span>Lihat Semua</span>
            <Icon name="chevronRight" className="h-4 w-4" />
          </Link>
        </div>

        {/* Skeleton loading when fetching */}
        {isLoading && books.length === 0 ? (
          <div className="book-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        ) : newestBooks.length > 0 ? (
          <div className="book-grid">
            {newestBooks.map((book) => (
              <BookCard
                key={getBookId(book)}
                book={book}
                isFavorite={isBookFavorite(book)}
                onToggleFavorite={toggleFavorite}
                onSelect={setSelectedBook}
              />
            ))}
          </div>
        ) : (
          <EmptyState icon="collection" text="Tidak ada data buku terbaru yang ditemukan." />
        )}
      </section>

      {/* 5. REKOMENDASI BUKU */}
      <section aria-labelledby="heading-rekomendasi">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="section-label mb-1">Rekomendasi Pustaka</p>
            <h2 id="heading-rekomendasi" className="font-playfair text-2xl font-bold text-textMain sm:text-3xl">
              Rekomendasi Pilihan Kurator
            </h2>
          </div>
          <Link to="/books?sort=rating-desc" className="flex items-center gap-1.5 text-sm font-semibold text-accentHover hover:underline">
            <span>Lihat Selengkapnya</span>
            <Icon name="chevronRight" className="h-4 w-4" />
          </Link>
        </div>

        {isLoading && books.length === 0 ? (
          <div className="book-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        ) : recommendedList.length > 0 ? (
          <div className="book-grid">
            {recommendedList.map((book) => (
              <BookCard
                key={getBookId(book)}
                book={book}
                isFavorite={isBookFavorite(book)}
                onToggleFavorite={toggleFavorite}
                onSelect={setSelectedBook}
              />
            ))}
          </div>
        ) : (
          <EmptyState icon="star" text="Belum ada buku rekomendasi." />
        )}
      </section>

      {/* 6. KATEGORI POPULER (SUBJECT) */}
      <section aria-labelledby="heading-kategori-populer">
        <div className="mb-6">
          <p className="section-label mb-1">Eksplorasi Subjek</p>
          <h2 id="heading-kategori-populer" className="font-playfair text-2xl font-bold text-textMain sm:text-3xl">
            Kategori Populer
          </h2>
          <p className="text-sm text-textSecondary mt-1">
            Klik pada kategori subjek untuk langsung menyaring koleksi buku di katalog.
          </p>
        </div>

        {popularCategories.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {popularCategories.map((cat) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => handleCategoryClick(cat.name)}
                className="group flex flex-col justify-between rounded-2xl border border-borderSoft bg-white p-5 shadow-book text-left transition-all duration-300 hover:border-accent hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-cream text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                  <Icon name="tag" className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-playfair text-base font-bold text-textMain group-hover:text-accentHover">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-textSecondary mt-1 font-semibold">
                    {cat.count} Judul Buku
                  </p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <EmptyState icon="tag" text="Data kategori belum tersedia dari API." />
        )}
      </section>

      {/* 7. PENULIS POPULER */}
      <section aria-labelledby="heading-penulis-populer">
        <div className="mb-6">
          <p className="section-label mb-1">Penulis Terkemuka</p>
          <h2 id="heading-penulis-populer" className="font-playfair text-2xl font-bold text-textMain sm:text-3xl">
            Penulis Populer
          </h2>
        </div>

        {popularAuthors.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {popularAuthors.map((author) => (
              <div
                key={author.name}
                onClick={() => handleAuthorClick(author.name)}
                className="flex cursor-pointer items-center gap-4 rounded-2xl border border-borderSoft bg-white p-4 shadow-book transition-all duration-300 hover:border-accent hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white font-playfair text-lg font-bold">
                  {author.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-playfair text-base font-bold text-textMain hover:text-accentHover">
                    {author.name}
                  </h3>
                  <p className="text-xs text-textSecondary font-semibold mt-0.5">
                    {author.count} Karya dalam katalog
                  </p>
                </div>
                <Icon name="chevronRight" className="h-4 w-4 text-textSecondary shrink-0" />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon="users" text="Belum ada data penulis dari API." />
        )}
      </section>

      {/* 8. PUBLISHER POPULER */}
      <section aria-labelledby="heading-publisher-populer">
        <div className="mb-6">
          <p className="section-label mb-1">Mitra Penerbitan</p>
          <h2 id="heading-publisher-populer" className="font-playfair text-2xl font-bold text-textMain sm:text-3xl">
            Penerbit Populer
          </h2>
        </div>

        {popularPublishers.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {popularPublishers.map((pub) => (
              <button
                key={pub.name}
                type="button"
                onClick={() => handlePublisherClick(pub.name)}
                className="flex flex-col items-center justify-center rounded-2xl border border-borderSoft bg-white p-4 shadow-book text-center transition-all duration-300 hover:border-accent hover:-translate-y-0.5"
              >
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-cream text-primary">
                  <Icon name="globe" className="h-4 w-4" />
                </div>
                <p className="line-clamp-1 font-playfair text-xs font-bold text-textMain">
                  {pub.name}
                </p>
                <span className="mt-1 text-[10px] font-semibold text-textSecondary">
                  {pub.count} Buku
                </span>
              </button>
            ))}
          </div>
        ) : (
          <EmptyState icon="globe" text="Belum ada data penerbit." />
        )}
      </section>

      {/* BOOK DETAIL MODAL */}
      <BookModal
        key={selectedBook ? getBookId(selectedBook) : "explore-book-modal"}
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        isFavorite={isBookFavorite(selectedBook)}
        onToggleFavorite={toggleFavorite}
        onToast={showToast}
      />
    </div>
  );
}
