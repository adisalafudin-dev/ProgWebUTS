import BookCard from "../components/BookCard";
import SearchFilter from "../components/SearchFilter";
import Icon from "../components/Icon";

export default function HomePage({ books = [] }) {
  const collectionBooks = books;
  const featuredBooks = collectionBooks.slice(0, 5);
  const heroBook = featuredBooks[0];
  const totalAuthors = new Set(collectionBooks.map((book) => book.author)).size;
  const totalGenres = new Set(collectionBooks.map((book) => book.genre)).size;

  if (!heroBook) {
    return (
      <section
        id="beranda"
        className="min-h-[60vh] flex items-center justify-center bg-parchment-50 px-4"
      >
        <div className="max-w-md rounded-lg border border-slate-200 bg-white p-6 text-center shadow-book">
          <p className="section-label mb-2">Koleksi Buku</p>
          <h1 className="font-playfair text-2xl font-bold text-ink mb-2">
            Data buku belum tersedia
          </h1>
          <p className="font-crimson text-slate-500">
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
        className="relative overflow-hidden bg-ink text-white"
      >
        {/* Background blur cover */}
        <div
          className="absolute inset-0 scale-110 bg-cover bg-center opacity-30 blur-2xl"
          style={{
            backgroundImage: heroBook.cover ? `url(${heroBook.cover})` : "none",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/60"
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          {/* Flexbox / Grid dua kolom */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
            {/* Teks hero */}
            <div>
              <p className="section-label mb-3 text-amber-300">
                Buku Pilihan Minggu Ini
              </p>
              <h1
                id="hero-heading"
                className="font-playfair font-extrabold text-4xl lg:text-6xl
                           text-white leading-tight mb-4 max-w-2xl"
              >
                {heroBook.title}
              </h1>
              <p className="text-slate-200 text-lg mb-8">
                oleh{" "}
                <span className="text-amber-200 font-semibold">
                  {heroBook.author}
                </span>
                <span className="mx-2 text-white/30">·</span>
                <span>{heroBook.year}</span>
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#koleksi" className="btn-primary">
                  <Icon name="eye" className="w-4 h-4" strokeWidth={2} />
                  Lihat Koleksi
                </a>
                <a href="#katalog" className="btn-secondary text-ink">
                  <Icon name="cloud" className="w-4 h-4" />
                  Katalog API
                </a>
              </div>
            </div>

            {/* Gambar cover hero */}
            <div className="hidden lg:flex justify-center">
              <figure className="relative w-52">
                {heroBook.cover ? (
                  <img
                    src={heroBook.cover}
                    alt={`Sampul buku ${heroBook.title}`}
                    className="w-full rounded-lg shadow-2xl border border-white/10
                               hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div
                    className="aspect-[2/3] w-full rounded-lg shadow-2xl border border-white/10
                               bg-gradient-to-br from-amber-800 to-stone-700 p-5
                               flex items-center justify-center"
                  >
                    <p className="font-playfair text-white/80 text-center text-sm">
                      {heroBook.title}
                    </p>
                  </div>
                )}
                <figcaption
                  className="absolute -bottom-4 -right-4 bg-white text-ink
                             px-3 py-1.5 rounded-lg shadow-book flex items-center gap-2"
                >
                  <Icon name="star" className="w-4 h-4 text-amber-500" />
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
                  <span className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-amber-300">
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
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        {/* Layout dua kolom: aside filter + grid buku */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── <aside> Semantic HTML untuk sidebar filter ── */}
          <aside
            aria-label="Panel filter buku"
            className="lg:w-64 flex-shrink-0"
          >
            <SearchFilter />
          </aside>

          {/* Konten utama: daftar buku */}
          <div className="flex-1 min-w-0">
            {/* Header section */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <p className="section-label">Koleksi Buku</p>
                <h2
                  id="koleksi-heading"
                  className="font-playfair font-bold text-2xl text-ink"
                >
                  Semua Buku
                </h2>
              </div>
              <p className="font-crimson text-sm text-slate-500">
                Menampilkan{" "}
                <span className="font-semibold text-amber-600">
                  {collectionBooks.length}
                </span>{" "}
                buku
              </p>
            </div>

            {/* ── Grid responsif — Tailwind CSS Grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {collectionBooks.map((book, i) => (
                <BookCard key={book.key || book.id || i} book={book} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          BUKU UNGGULAN — <section> featured strip
          Tailwind: horizontal scroll snap
      ══════════════════════════════════════════════ */}
      <section
        aria-labelledby="featured-heading"
        className="bg-parchment-100 border-y border-parchment-200 py-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="section-label">Pilihan Editor</p>
              <h2
                id="featured-heading"
                className="font-playfair font-bold text-2xl text-ink"
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
                <BookCard book={book} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
