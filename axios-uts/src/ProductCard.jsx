import { useState } from "react";
import StarRating from "./StarRating";

export default function ProductCard({ value }) {
  const [added, setAdded] = useState(false);
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
      <div className="relative bg-gray-50 h-56 flex items-center justify-center p-4">
        <img
          src={value.image}
          alt={value.title}
          className="h-44 object-contain"
        />
        <span className="absolute top-3 left-3 bg-white border border-gray-200 rounded-md text-xs text-gray-500 px-2 py-1 uppercase tracking-wide">
          {value.category}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <p className="text-sm font-medium text-gray-900 mb-1 leading-snug line-clamp-2">
          {value.title}
        </p>
        <p className="text-xs text-gray-500 mb-3 leading-relaxed line-clamp-3 flex-1">
          {value.description}
        </p>

        <div className="flex items-center gap-1.5 mb-4">
          <StarRating rate={value.rating.rate} />
          <span className="text-xs font-medium text-gray-800">
            {value.rating.rate}
          </span>
          <span className="text-xs text-gray-400">({value.rating.count})</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xl font-semibold text-gray-900">
            ${value.price}
          </span>
          <button
            onClick={() => setAdded(!added)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border text-xs transition-all active:scale-95 ${
              added
                ? "border-green-400 text-green-700 bg-green-50"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {added ? "✓ Added" : "🛒 Add to cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
