export default function BookCard({ book }) {
  console.log("Book", book);
  const coverId = book.cover_i;
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : null;

  const title = book.title || "Judul tidak tersedia";
  const authors = book.author_name?.join(", ") || "Penulis tidak diketahui";
  const year = book.first_publish_year || "—";
  const subjects = book.subject?.slice(0, 3).join(", ") || "—";
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col">
      <div className="bg-gray-100 h-52 flex items-center justify-center overflow-hidden">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
              />
            </svg>
            <span className="text-sm">No Cover</span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-1 flex-1">
        <h2 className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2">
          {title}
        </h2>
        <p className="text-xs text-blue-600 font-medium truncate">{authors}</p>
        <p className="text-xs text-gray-400 mt-auto pt-2">📅 {year}</p>
        {subjects !== "—" && (
          <p className="text-xs text-gray-400 line-clamp-1">🏷️ {subjects}</p>
        )}
      </div>
    </div>
  );
}
