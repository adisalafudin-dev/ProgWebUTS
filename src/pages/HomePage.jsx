import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import BookModal from "../components/BookModal";
import SearchFilter from "../components/SearchFilter";
import Icon from "../components/Icon";
import { GENRES } from "../data/books";

export default function HomePage({ books = [], error, fetchData }) {
  const ITEMS_PER_PAGE = 10;
  const [filters, setFilters] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [collectionView, setCollectionView] = useState("grid");
  const [currentPageCollection, setCurrentPageCollection] = useState(1);

  const filtered = filters
    ? books
        .filter((book) => {
          if (
            filters.q &&
            !book.title.toLowerCase().includes(filters.q.toLowerCase())
          )
            return false;
          if (
            filters.author &&
            !book.author.toLowerCase().includes(filters.author.toLowerCase())
          )
            return false;
          if (
            filters.genre !== "Semua" &&
            ![book.genre, ...(book.genres || [])].includes(filters.genre)
          )
            return false;
          if (book.year !== "-" && book.year < filters.yearMin) return false;
          if (book.rating < filters.minRating) return false;
          if (filters.available && !book.available) return false;
          if (filters.featured && !book.featured) return false;
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

  // Pagination logic for collection
  const totalPagesCollection = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndexCollection = (currentPageCollection - 1) * ITEMS_PER_PAGE;
  const endIndexCollection = startIndexCollection + ITEMS_PER_PAGE;
  const paginatedFiltered = filtered.slice(
    startIndexCollection,
    endIndexCollection,
  );

  const markedFeaturedBooks = books.filter((book) => book.featured).slice(0, 5);
  const featuredBooks =
    markedFeaturedBooks.length > 0 ? markedFeaturedBooks : books.slice(0, 5);
  const heroBook = featuredBooks[activeHeroIndex] || featuredBooks[0];
  const totalAuthors = new Set(books.map((book) => book.author)).size;
  const totalGenres = GENRES.filter((genre) => genre !== "Semua").length;

  useEffect(() => {
    setActiveHeroIndex(0);
    setCurrentPageCollection(1);
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
      <section
        id="beranda"
        aria-labelledby="hero-heading"
        className="relative min-h-[calc(100vh-76px)] overflow-hidden border-b border-accent/60 bg-transparent text-white"
      >
        <div
          key={`hero-bg-${heroBook.key || heroBook.id || activeHeroIndex}`}
          className="hero-bg-motion absolute inset-0 bg-cover bg-center opacity-85 blur-xl"
          style={{
            backgroundImage: heroBook.cover ? `url(${heroBook.cover})` : "none",
          }}
          aria-hidden="true"
        />
        <div
          key={`hero-bg-clear-${heroBook.key || heroBook.id || activeHeroIndex}`}
          className="hero-bg-clear absolute inset-0 bg-cover bg-center opacity-35"
          style={{
            backgroundImage: heroBook.cover ? `url(${heroBook.cover})` : "none",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_72%_38%,rgba(255,255,255,0.16),transparent_30%),linear-gradient(90deg,rgba(10,26,24,0.78),rgba(10,26,24,0.52),rgba(20,18,16,0.28))]"
          aria-hidden="true"
        />
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/20" />

        <div className="relative mx-auto flex min-h-[calc(100vh-140px)] max-w-7xl items-center px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)] lg:gap-14">
            <div
              key={`hero-copy-${heroBook.key || heroBook.id || activeHeroIndex}`}
              className="hero-copy-motion max-w-3xl"
            >
              <p className="section-label mb-3 text-accent">
                Buku Pilihan Minggu Ini
              </p>
              <h1
                id="hero-heading"
                className="mb-5 max-w-2xl font-playfair text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl lg:text-6xl"
              >
                {heroBook.title}
              </h1>
              <p className="mb-6 max-w-xl border-l-2 border-accent pl-4 text-base text-white/82 sm:text-lg">
                oleh{" "}
                <span className="text-accent font-semibold">
                  {heroBook.author}
                </span>
                <span className="mx-2 text-white/30">-</span>
                <span>{heroBook.year}</span>
              </p>
              <p className="mb-6 max-w-2xl text-sm leading-relaxed text-white/70 line-clamp-3 sm:text-base">
                {heroBook.description ||
                  "Deskripsi buku belum tersedia dari katalog Open Library."}
              </p>
              <div className="mb-8 flex min-h-[2rem] flex-wrap gap-2">
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

            <div className="flex justify-center lg:justify-end">
              <figure
                key={`hero-cover-${heroBook.key || heroBook.id || activeHeroIndex}`}
                className="hero-cover-motion relative w-44 sm:w-52 lg:w-64"
              >
                {heroBook.cover ? (
                  <img
                    src={heroBook.cover}
                    alt={`Sampul buku ${heroBook.title}`}
                    className="aspect-[2/3] w-full rounded-lg border border-white/15 object-cover shadow-2xl transition-transform duration-700 ease-out hover:scale-[1.03]"
                  />
                ) : (
                  <div className="aspect-[2/3] w-full rounded-lg border border-white/10 bg-gradient-to-br from-primary to-secondary p-5 shadow-2xl flex items-center justify-center">
                    <p className="font-playfair text-white/80 text-center text-sm">
                      {heroBook.title}
                    </p>
                  </div>
                )}
                <figcaption className="absolute -bottom-4 -right-4 bg-white text-textMain px-3 py-1.5 rounded-lg shadow-book flex items-center gap-2">
                  <Icon name="star" className="w-4 h-4 text-accent" />
                  <span className="font-playfair font-bold text-lg">
                    {heroBook.rating}
                  </span>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/10 bg-white/[0.06] backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-3 divide-x divide-white/10">
              {[
                {
                  icon: "collection",
                  label: "Total Koleksi",
                  value: books.length,
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

      <section
        id="koleksi"
        aria-labelledby="koleksi-heading"
        className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <aside aria-label="Panel filter buku" className="lg:self-start">
            <SearchFilter onFilter={setFilters} />
          </aside>

          {filtered.length > 0 ? (
            <div className="min-w-0 flex-1">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="section-label">Koleksi Buku</p>
                  <h2
                    id="koleksi-heading"
                    className="font-playfair text-2xl font-bold text-textMain"
                  >
                    Semua Buku
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-crimson text-sm text-textSecondary">
                    Menampilkan{" "}
                    <span className="font-semibold text-accentHover">
                      {startIndexCollection + 1}-
                      {Math.min(endIndexCollection, filtered.length)}
                    </span>{" "}
                    dari{" "}
                    <span className="font-semibold">{filtered.length}</span>{" "}
                    buku
                  </p>
                  <div
                    className="inline-flex rounded-lg border border-borderSoft bg-white p-1 shadow-book"
                    aria-label="Ubah tampilan koleksi"
                  >
                    {[
                      { value: "grid", label: "Grid", icon: "collection" },
                      { value: "list", label: "List", icon: "bookOpen" },
                    ].map((view) => (
                      <button
                        key={view.value}
                        type="button"
                        className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-300 ${
                          collectionView === view.value
                            ? "bg-primary text-white"
                            : "text-textSecondary hover:bg-cream hover:text-accentHover"
                        }`}
                        aria-pressed={collectionView === view.value}
                        onClick={() => setCollectionView(view.value)}
                      >
                        <Icon name={view.icon} className="h-3.5 w-3.5" />
                        {view.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {collectionView === "grid" ? (
                <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {paginatedFiltered.map((book, i) => (
                    <BookCard
                      key={book.key || book.id || i}
                      book={book}
                      index={i}
                      onSelect={setSelectedBook}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {paginatedFiltered.map((book, i) => {
                    const bookGenres = [
                      book.genre,
                      ...(book.genres || []),
                      ...(book.tags || []),
                    ].filter(Boolean);
                    const uniqueBookGenres = [...new Set(bookGenres)];

                    return (
                      <article
                        key={book.key || book.id || i}
                        className="book-card group grid grid-cols-[4rem_minmax(0,1fr)] gap-3 p-2.5 sm:grid-cols-[4.5rem_minmax(0,1fr)_auto] sm:items-center"
                      >
                        <button
                          type="button"
                          className="relative h-24 overflow-hidden rounded-md bg-cream sm:h-28"
                          onClick={() => setSelectedBook(book)}
                        >
                          {book.cover ? (
                            <img
                              src={book.cover}
                              alt={`Sampul buku ${book.title}`}
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                            />
                          ) : (
                            <span className="flex h-full items-center justify-center p-3 text-center text-xs font-semibold text-textSecondary">
                              {book.title}
                            </span>
                          )}
                        </button>

                        <div className="min-w-0 self-center">
                          <p className="section-label mb-1 truncate">
                            {uniqueBookGenres.slice(0, 2).join(" / ") ||
                              "General"}
                          </p>
                          <h3 className="font-playfair text-base font-bold leading-snug text-textMain line-clamp-1 group-hover:text-accentHover sm:text-lg">
                            {book.title}
                          </h3>
                          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-textSecondary sm:text-sm">
                            <span className="line-clamp-1">{book.author}</span>
                            <span className="hidden text-borderSoft sm:inline">
                              /
                            </span>
                            <span className="font-semibold text-accent">
                              ★ {book.rating || "-"}
                            </span>
                            <span className="text-borderSoft">/</span>
                            <span>{book.year || "-"}</span>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {uniqueBookGenres.slice(0, 3).map((genre) => (
                              <span
                                key={genre}
                                className="rounded-full bg-cream px-2 py-0.5 text-[10px] font-semibold leading-none text-secondary"
                              >
                                {genre}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="col-span-2 flex justify-end sm:col-span-1 sm:self-center">
                          <button
                            type="button"
                            className="btn-primary px-3 py-1.5 text-xs sm:text-sm"
                            onClick={() => setSelectedBook(book)}
                          >
                            Lihat Detail
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
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
          )}
        </div>

        {filtered.length > 0 && (
          <nav
            aria-label="Paginasi koleksi buku"
            className="flex items-center justify-center gap-3 mt-10"
          >
            <button
              type="button"
              className="btn-secondary text-sm py-2 px-4"
              disabled={currentPageCollection === 1}
              onClick={() => {
                setCurrentPageCollection(currentPageCollection - 1);
                document
                  .getElementById("koleksi")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              ← Sebelumnya
            </button>
            <div className="flex items-center gap-2">
              {Array.from(
                { length: totalPagesCollection },
                (_, i) => i + 1,
              ).map((page) => (
                <button
                  key={page}
                  type="button"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    page === currentPageCollection
                      ? "bg-primary text-white"
                      : "bg-white border border-borderSoft text-textSecondary hover:border-primary hover:text-primary"
                  }`}
                  onClick={() => {
                    setCurrentPageCollection(page);
                    document
                      .getElementById("koleksi")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="btn-secondary text-sm py-2 px-4"
              disabled={currentPageCollection === totalPagesCollection}
              onClick={() => {
                setCurrentPageCollection(currentPageCollection + 1);
                document
                  .getElementById("koleksi")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Berikutnya →
            </button>
          </nav>
        )}
      </section>

      <section
        aria-labelledby="featured-heading"
        className="border-y border-borderSoft bg-white py-10"
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

          <div className="flex gap-5 overflow-x-auto pb-3 pr-2 snap-x snap-mandatory scroll-smooth">
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
