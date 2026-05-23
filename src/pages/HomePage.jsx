import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import BookModal from "../components/BookModal";
import SearchFilter from "../components/SearchFilter";
import Icon from "../components/Icon";

export default function HomePage({ books = [], error, fetchData }) {
  const [filters, setFilters] = useState(null);

  const filtered = filters
    ? books
        .filter((b) => {
          if (
            filters.q &&
            !b.title.toLowerCase().includes(filters.q.toLowerCase())
          )
            return false;
          if (
            filters.author &&
            !b.author.toLowerCase().includes(filters.author.toLowerCase())
          )
            return false;
          if (
            filters.genre !== "Semua" &&
            ![b.genre, ...(b.genres || [])].includes(filters.genre)
          )
            return false;
          if (b.year !== "-" && b.year < filters.yearMin) return false;
          if (b.rating < filters.minRating) return false;
          if (filters.available && !b.available) return false;
          if (filters.featured && !b.featured) return false;
          return true;
        })
        .sort((a, b) => {
          if (filters.sort === "title-asc")
            return a.title.localeCompare(b.title);
          if (filters.sort === "rating-desc") return b.rating - a.rating;
          if (filters.sort === "year-desc") return b.year - a.year;
          return 0;
        })
    : books;
  const [selectedBook, setSelectedBook] = useState(null);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const collectionBooks = books;
  const markedFeaturedBooks = collectionBooks
    .filter((book) => book.featured)
    .slice(0, 5);
  const featuredBooks =
    markedFeaturedBooks.length > 0
      ? markedFeaturedBooks
      : collectionBooks.slice(0, 5);
  const heroBook = featuredBooks[activeHeroIndex] || featuredBooks[0];
  const totalAuthors = new Set(collectionBooks.map((book) => book.author)).size;
  const totalGenres = new Set(
    collectionBooks.flatMap((book) => book.genres || [book.genre]),
  ).size;

  useEffect(() => {
    setActiveHeroIndex(0);
  }, [featuredBooks.length]);

  useEffect(() => {
    if (featuredBooks.length <= 1) return undefined;

    const timerId = setInterval(() => {
      setActiveHeroIndex((current) => (current + 1) % featuredBooks.length);
    }, 4500);

    return () => clearInterval(timerId);
  }, [featuredBooks.length]);

  if (!heroBook) {
    return (
      <section
        id="beranda"
        className="min-h-[60vh] flex items-center justify-center bg-cream px-4"
      >
        <div className="max-w-md rounded-lg border border-borderSoft bg-white p-6 text-center shadow-book">
          <p className="section-label mb-2">Koleksi Buku</p>
          <h1 className="font-playfair text-2xl font-bold text-textMain mb-2">
            Data buku belum tersedia
          </h1>
          <p className="font-crimson text-textSecondary">
            Tunggu sebentar sampai data dari API selesai dimuat.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* ══════════════════════════════════════════════
          HERO SECTION — <section> Semantic HTML
          Tailwind: flex, gradient bg, responsive grid
      ══════════════════════════════════════════════ */}
      <section
        id="beranda"
        aria-labelledby="hero-heading"
        className="relative overflow-hidden border-b-4 border-accent bg-primary text-white"
      >
        <div
          key={`hero-bg-${heroBook.key || heroBook.id || activeHeroIndex}`}
          className="hero-bg-motion absolute inset-0 scale-110 bg-cover bg-center opacity-45 blur-2xl"
          style={{
            backgroundImage: heroBook.cover ? `url(${heroBook.cover})` : "none",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_72%_38%,rgba(184,137,45,0.22),transparent_28%),linear-gradient(90deg,rgba(24,51,47,0.98),rgba(24,51,47,0.86),rgba(122,46,46,0.5))]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-px bg-white/20"
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          {/* Flexbox / Grid dua kolom */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
            {/* Teks hero */}
            <div
              key={`hero-copy-${heroBook.key || heroBook.id || activeHeroIndex}`}
              className="hero-copy-motion"
            >
              <p className="section-label mb-3 text-accent">
                Buku Pilihan Minggu Ini
              </p>
              <h1
                id="hero-heading"
                className="font-playfair font-extrabold text-4xl lg:text-6xl
                           text-white leading-tight mb-5 max-w-2xl"
              >
                {heroBook.title}
              </h1>
              <p className="max-w-xl border-l-2 border-accent pl-4 text-white/82 text-lg mb-8">
                oleh{" "}
                <span className="text-accent font-semibold">
                  {heroBook.author}
                </span>
                <span className="mx-2 text-white/30">·</span>
                <span>{heroBook.year}</span>
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {(heroBook.genres || heroBook.tags || [heroBook.genre])
                  .filter(Boolean)
                  .slice(0, 4)
                  .map((genre) => (
                    <span
                      key={genre}
                      className="rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs font-semibold text-white/75"
                    >
                      {genre}
                    </span>
                  ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <a href="#koleksi" className="btn-primary">
                  <Icon name="eye" className="w-4 h-4" strokeWidth={2} />
                  Lihat Koleksi
                </a>
                <a href="#katalog" className="btn-secondary text-primary">
                  <Icon name="cloud" className="w-4 h-4" />
                  Katalog API
                </a>
              </div>
              {featuredBooks.length > 1 && (
                <div
                  className="mt-8 flex items-center gap-2"
                  aria-label="Pilih buku unggulan"
                >
                  {featuredBooks.map((book, index) => (
                    <button
                      key={book.key || book.id || index}
                      type="button"
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        index === activeHeroIndex
                          ? "w-9 bg-accent"
                          : "w-2.5 bg-white/30 hover:bg-white/60"
                      }`}
                      aria-label={`Tampilkan ${book.title}`}
                      aria-current={index === activeHeroIndex}
                      onClick={() => setActiveHeroIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Gambar cover hero */}
            <div className="hidden lg:flex justify-center">
              <figure
                key={`hero-cover-${heroBook.key || heroBook.id || activeHeroIndex}`}
                className="hero-cover-motion relative w-52"
              >
                {heroBook.cover ? (
                  <img
                    src={heroBook.cover}
                    alt={`Sampul buku ${heroBook.title}`}
                    className="w-full rounded-lg shadow-2xl border-4 border-white/15
                               hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div
                    className="aspect-[2/3] w-full rounded-lg shadow-2xl border border-white/10
                               bg-gradient-to-br from-primary to-secondary p-5
                               flex items-center justify-center"
                  >
                    <p className="font-playfair text-white/80 text-center text-sm">
                      {heroBook.title}
                    </p>
                  </div>
                )}
                <figcaption
                  className="absolute -bottom-4 -right-4 bg-white text-textMain
                             px-3 py-1.5 rounded-lg shadow-book flex items-center gap-2"
                >
                  <Icon name="star" className="w-4 h-4 text-accent" />
                  <span className="font-playfair font-bold text-lg">
                    {heroBook.rating}
                  </span>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>

        {/* Stats bar — Tailwind flex + divide */}
        <div className="relative border-t border-white/10 bg-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-3 divide-x divide-white/10">
              {[
                {
                  icon: "collection",
                  label: "Total Koleksi",
                  value: collectionBooks.length,
                },
                { icon: "users", label: "Penulis", value: totalAuthors },
                { icon: "tag", label: "Genre", value: totalGenres },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 px-4 py-4"
                >
                  <span className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-accent">
                    <Icon name={stat.icon} className="w-4 h-4" />
                  </span>
                  <span>
                    <span className="block text-2xl font-extrabold font-playfair text-white leading-none">
                      {stat.value}
                    </span>
                    <span className="block text-xs font-crimson text-white/60 mt-1">
                      {stat.label}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {}
      <section
        id="koleksi"
        aria-labelledby="koleksi-heading"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14"
      >
        {/* Layout dua kolom: aside filter + grid buku */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── <aside> Semantic HTML untuk sidebar filter ── */}
          <aside
            aria-label="Panel filter buku"
            className="lg:w-64 flex-shrink-0"
          >
            <SearchFilter onFilter={setFilters} />
          </aside>

          {/* Konten utama: daftar buku */}
          {filtered.length > 0 ? (
            <div className="flex-1 min-w-0">
              {/* Header section */}
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                  <p className="section-label">Koleksi Buku</p>
                  <h2
                    id="koleksi-heading"
                    className="font-playfair font-bold text-2xl text-textMain"
                  >
                    Semua Buku
                  </h2>
                </div>
                <p className="font-crimson text-sm text-textSecondary">
                  Menampilkan{" "}
                  <span className="font-semibold text-accentHover">
                    {filtered.length} {/* ← bukan collectionBooks.length */}
                  </span>
                  buku
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map(
                  (
                    book,
                    i, // ← ganti ini
                  ) => (
                    <BookCard
                      key={book.key || book.id || i}
                      book={book}
                      index={i}
                      onSelect={setSelectedBook}
                    />
                  ),
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="min-h-fit max-w-screen w-full flex items-start justify-center bg-parchment-50 px-4">
                <div className="max-w-screen rounded-lg border border-red-100 p-6 text-center shadow-book">
                  <p className="font-playfair text-xl font-semibold text-ink mb-2">
                    Maaf, Data buku tidak tersedia
                  </p>
                  <p className="font-crimson text-slate-500 mb-4">{error}</p>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => fetchData()}
                  >
                    Coba Lagi
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          BUKU UNGGULAN — <section> featured strip
          Tailwind: horizontal scroll snap
      ══════════════════════════════════════════════ */}
      <section
        aria-labelledby="featured-heading"
        className="bg-white border-y border-borderSoft py-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="section-label">Pilihan Editor</p>
              <h2
                id="featured-heading"
                className="font-playfair font-bold text-2xl text-textMain"
              >
                Buku Unggulan
              </h2>
            </div>
          </div>

          {/* Flex row dengan hover effects */}
          <div
            className="flex gap-5 overflow-x-auto pb-3
                          snap-x snap-mandatory scroll-smooth"
          >
            {featuredBooks.map((book, i) => (
              <div
                key={book.key || book.id || i}
                className="snap-start flex-shrink-0 w-40 sm:w-48"
              >
                <BookCard book={book} index={i} onSelect={setSelectedBook} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <BookModal
        key={selectedBook?.key || selectedBook?.id || "home-book-modal"}
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
      />
    </>
  );
}
