export default function BookCard({ book, onSelect }) {
  const gradients = [
    "from-primary to-secondary",
    "from-textMain to-primary",
    "from-accentHover to-primary",
    "from-primary to-accent",
  ];

  const title = book.title || "Judul tidak tersedia";
  const authors =
    book.author || book.author_name?.join(", ") || "Penulis tidak diketahui";
  const year = book.year || book.first_publish_year || "-";
  const rating = Number(book.rating) || 0;
  const coverUrl = book.cover;
  const tags = book.tags || book.subject?.slice(0, 3) || [];
  const displayGenres = [
    book.genre,
    ...(book.genres || []),
    ...tags,
  ].filter(Boolean);
  const uniqueGenres = [...new Set(displayGenres)];
  const gradient = gradients[title.charCodeAt(0) % gradients.length];

  return (
    <article
      className="book-card group flex h-full flex-col"
      aria-label={`Buku: ${title} oleh ${authors}`}
    >
      <figure className="relative aspect-[2/3] shrink-0 overflow-hidden border-b border-borderSoft bg-cream">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} p-5 flex items-center justify-center`}
          aria-hidden="true"
        >
          <p className="font-playfair text-white/85 text-center text-sm leading-relaxed">
            {title}
          </p>
        </div>

        {coverUrl && (
          <img
            src={coverUrl}
            alt={`Sampul buku ${title}`}
            loading="lazy"
            className="relative z-[1] h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        )}

        <figcaption className="sr-only">
          {title} - {authors}
        </figcaption>

        <span
          aria-label={book.available ? "Tersedia" : "Sedang dipinjam"}
          className={`absolute top-2 right-2 z-20 text-xs font-semibold font-crimson
                      px-2 py-0.5 rounded-full
            ${
              book.available
                ? "bg-cream text-primary"
                : "bg-accentHover text-white"
            }`}
        >
          {book.available ? "Tersedia" : "Dipinjam"}
        </span>

        <div
          className="absolute inset-0 z-10 flex translate-y-2 items-center justify-center bg-primary/70
                     opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100"
        >
          {onSelect ? (
            <button
              type="button"
              className="btn-primary text-sm py-2 px-4"
              onClick={() => onSelect(book)}
            >
              Lihat Detail
            </button>
          ) : (
            <span className="btn-primary text-sm py-2 px-4">Lihat Detail</span>
          )}
        </div>
      </figure>

      <div className="flex flex-1 flex-col p-4">
        <p className="section-label mb-1 min-h-[1rem] truncate">
          {uniqueGenres.slice(0, 2).join(" / ") || "General"}
        </p>
        <h3
          className="mb-1 min-h-[2.75rem] font-playfair text-base font-semibold leading-snug
                     text-textMain line-clamp-2
                     group-hover:text-accentHover transition-colors duration-200"
        >
          {title}
        </h3>
        <p className="mb-3 font-crimson text-sm text-textSecondary line-clamp-1">
          {authors}
        </p>

        <div className="mt-auto flex items-center justify-between">
          <div
            className="flex items-center gap-1"
            aria-label={rating ? `Rating ${rating}` : "Rating belum tersedia"}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                aria-hidden="true"
                className={`w-3 h-3 ${
                  star <= Math.round(rating) ? "text-accent" : "text-borderSoft"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-xs text-textSecondary ml-0.5 font-crimson">
              {rating || "-"}
            </span>
          </div>
          <span className="text-xs text-textSecondary font-crimson">
            {year}
          </span>
        </div>

        {uniqueGenres.length > 0 && (
          <div className="mt-3 flex min-h-[1.5rem] flex-wrap gap-1">
            {uniqueGenres.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-crimson bg-cream
                           text-secondary px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
