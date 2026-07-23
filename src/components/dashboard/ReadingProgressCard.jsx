import Icon from "../Icon";

export default function ReadingProgressCard({ book, onSelect }) {
  const progress = Math.min(100, Math.max(0, Number(book.progress) || 0));

  return (
    <article className="book-card group flex w-64 shrink-0 flex-col overflow-hidden sm:w-72">
      <button
        type="button"
        className="relative aspect-[16/9] w-full overflow-hidden bg-cream"
        onClick={() => onSelect?.(book)}
      >
        {book.cover ? (
          <img
            src={book.cover}
            alt={`Sampul ${book.title}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-secondary p-4 text-center text-xs font-semibold text-white/80">
            {book.title}
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-primary/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="btn-primary px-3 py-1.5 text-xs">Lanjut Baca</span>
        </div>
      </button>

      <div className="flex flex-1 flex-col p-3.5">
        <h3 className="mb-1 font-playfair text-sm font-semibold leading-snug text-textMain line-clamp-1">
          {book.title}
        </h3>
        <p className="mb-3 text-xs text-textSecondary line-clamp-1">
          {book.author}
        </p>

        <div className="mt-auto">
          <div className="mb-1 flex items-center justify-between text-[11px] font-semibold text-textSecondary">
            <span className="inline-flex items-center gap-1 text-accentHover">
              <Icon name="clock" className="h-3 w-3" /> Bab{" "}
              {book.currentChapter ?? "-"}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-cream">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
