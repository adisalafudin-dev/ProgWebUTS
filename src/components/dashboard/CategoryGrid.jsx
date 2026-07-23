import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../Icon";

function buildCategories(books) {
  const map = new Map();

  books.forEach((book) => {
    const genres = [
      book.genre,
      ...(book.genres || []),
      ...(book.tags || []),
      ...(book.subject?.slice(0, 3) || []),
    ].filter(Boolean);

    genres.forEach((genre) => {
      if (!map.has(genre)) {
        map.set(genre, { name: genre, cover: book.cover, count: 0 });
      }
      const entry = map.get(genre);
      entry.count += 1;
      if (!entry.cover && book.cover) entry.cover = book.cover;
    });
  });

  return [...map.values()].sort((a, b) => b.count - a.count);
}

const gradients = [
  "from-primary to-secondary",
  "from-textMain to-primary",
  "from-accentHover to-primary",
  "from-primary to-accent",
];

export default function CategoryGrid({ books = [], limit = 8 }) {
  const [isCompact, setIsCompact] = useState(false);
  const categories = buildCategories(books).slice(0, limit);

  if (categories.length === 0) return null;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="section-label">Jelajahi</p>
          <h2 className="font-playfair text-2xl font-bold text-textMain">
            Book Category
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setIsCompact((value) => !value)}
          aria-label={
            isCompact ? "Tampilkan grid besar" : "Tampilkan grid ringkas"
          }
          aria-pressed={isCompact}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-borderSoft bg-white text-textSecondary transition-colors hover:border-accent hover:text-accentHover"
        >
          <Icon name={isCompact ? "collection" : "grid"} className="h-4 w-4" />
        </button>
      </div>

      <div
        className={`grid gap-4 ${
          isCompact
            ? "grid-cols-3 sm:grid-cols-5 lg:grid-cols-6"
            : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
        }`}
      >
        {categories.map((category, i) => (
          <Link
            key={category.name}
            to={`/books?genre=${encodeURIComponent(category.name)}`}
            className="group text-center"
          >
            <div className="book-card relative aspect-[2/3] overflow-hidden">
              <div
                className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br p-3 ${
                  gradients[i % gradients.length]
                }`}
                aria-hidden="true"
              >
                <p className="font-playfair text-sm leading-relaxed text-white/85">
                  {category.name}
                </p>
              </div>
              {category.cover && (
                <img
                  src={category.cover}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="relative z-[1] h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              )}
            </div>
            <p className="mt-2 truncate text-sm font-semibold text-textMain group-hover:text-accentHover">
              {category.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
