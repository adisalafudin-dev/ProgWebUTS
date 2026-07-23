// src/components/dashboard/ReviewCard.jsx
import RatingStars from "./RatingStars";

export default function ReviewCard({ review }) {
  return (
    <article className="book-card flex gap-3 p-3.5">
      <div className="h-16 w-12 shrink-0 overflow-hidden rounded-md bg-cream">
        {review.bookCover ? (
          <img
            src={review.bookCover}
            alt={`Sampul ${review.bookTitle}`}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-secondary p-1 text-center text-[8px] text-white/80">
            {review.bookTitle}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate font-playfair text-sm font-semibold text-textMain">
            {review.bookTitle}
          </h3>
          <span className="shrink-0 text-[11px] text-textSecondary">
            {review.date}
          </span>
        </div>
        <RatingStars rating={review.rating} size="h-3 w-3" />
        <p className="mt-1.5 text-xs leading-relaxed text-textSecondary line-clamp-2">
          {review.comment}
        </p>
      </div>
    </article>
  );
}
