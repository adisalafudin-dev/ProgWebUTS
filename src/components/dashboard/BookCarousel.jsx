import { useRef } from "react";
import BookCard from "../BookCard";
import Icon from "../Icon";
import { getBookId } from "../../utils/bookHelpers.js";

export default function BookCarousel({
  books = [],
  onSelect,
  isBookFavorite,
  onToggleFavorite,
}) {
  const trackRef = useRef(null);

  const scrollByCard = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const amount = track.clientWidth * 0.8 * direction;
    track.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (books.length === 0) return null;

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="book-carousel-track flex gap-4 overflow-x-auto scroll-smooth pb-2"
      >
        {books.map((book, i) => (
          <div key={getBookId(book) || i} className="w-44 shrink-0 sm:w-52">
            <BookCard
              book={book}
              onSelect={onSelect}
              isFavorite={isBookFavorite?.(book)}
              onToggleFavorite={onToggleFavorite}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scrollByCard(1)}
        aria-label="Lihat buku berikutnya"
        className="absolute -right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-borderSoft bg-white text-textMain shadow-book transition-transform duration-200 hover:scale-105 hover:border-accent md:flex"
      >
        <Icon name="chevronRight" className="h-4 w-4" strokeWidth={2} />
      </button>
    </div>
  );
}
