export default function StarRating({ rate }) {
  return (
    <div className="flex gap-0.5 text-amber-400 text-sm">
      {[1, 2, 3, 4, 5].map((star) => {
        if (rate >= star) return <span key={star}>★</span>;
        if (rate >= star - 0.5)
          return (
            <span key={star} className="opacity-50">
              ★
            </span>
          );
        return (
          <span key={star} className="text-gray-300">
            ★
          </span>
        );
      })}
    </div>
  );
}
