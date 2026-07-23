import Icon from "../../components/Icon";
import EmptyState from "../../components/EmptyState";

const mockReviews = [
  {
    id: 1,
    book: "Sejarah Nusantara",
    user: "Demo Reader",
    rating: 5,
    comment: "Buku yang sangat informatif dan mudah dibaca.",
    status: "Disetujui",
  },
  {
    id: 2,
    book: "Petualangan di Hutan",
    user: "Budi Santoso",
    rating: 4,
    comment: "Ceritanya seru, cocok untuk anak remaja.",
    status: "Menunggu",
  },
  {
    id: 3,
    book: "Panduan React",
    user: "Siti Rahma",
    rating: 3,
    comment: "Penjelasannya bagus tapi perlu contoh lebih banyak.",
    status: "Menunggu",
  },
];

export default function AdminReviewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-playfair text-2xl font-bold text-slate-900">
          Daftar Ulasan
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Moderasi ulasan pengguna sebelum ditampilkan ke publik.
        </p>
      </div>

      {mockReviews.length > 0 ? (
        <div className="space-y-4">
          {mockReviews.map((review) => (
            <article
              key={review.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-900">{review.book}</h3>
                  <p className="mt-1 text-sm text-slate-500">oleh {review.user}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
                    <Icon name="star" className="h-3.5 w-3.5" />
                    {review.rating}/5
                  </span>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                      review.status === "Disetujui"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {review.status}
                  </span>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                {review.comment}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="star"
          title="Tidak ada ulasan"
          description="Belum ada ulasan yang perlu dimoderasi."
        />
      )}
    </div>
  );
}
