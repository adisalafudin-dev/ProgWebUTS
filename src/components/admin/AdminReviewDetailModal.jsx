import { useEffect } from "react";
import Icon from "../Icon";

export default function AdminReviewDetailModal({
  isOpen,
  onClose,
  review = null,
  onDelete = null,
  onModerateStatus = null,
}) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !review) return null;

  const user = review.user || review.userName || "Pengguna";
  const userEmail = review.userEmail || review.email || "-";
  const book = review.book || review.bookTitle || "Buku Tidak Didefinisikan";
  const rating = Number(review.rating) || 0;
  const comment = review.comment || review.content || review.text || "Tidak ada isi komentar.";
  const status = review.status || "Menunggu";
  const dateStr = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : review.date || "Tanggal tidak tercatat";

  const getStatusBadge = (st) => {
    switch (st) {
      case "Disetujui":
      case "Approved":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Ditolak":
      case "Rejected":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-amber-100 text-amber-800 border-amber-200";
    }
  };

  const getRatingLabel = (num) => {
    if (num >= 5) return "Sangat Memuaskan";
    if (num >= 4) return "Bagus";
    if (num >= 3) return "Cukup";
    if (num >= 2) return "Kurang";
    return "Sangat Kurang";
  };

  const initials = user
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("") || "U";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-amber-100 p-2 text-amber-700">
              <Icon name="star" className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-playfair text-lg font-bold text-slate-900">
                Detail Ulasan
              </h3>
              <p className="text-xs text-slate-500">ID Ulasan: #{review.id}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-600 transition-colors"
          >
            <Icon name="close" className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-xs sm:text-sm max-h-[75vh] overflow-y-auto">
          {/* Status & Rating Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4 border border-slate-200/60">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Rating Pengguna
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Icon
                      key={star}
                      name="star"
                      className={`h-4 w-4 ${
                        star <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-slate-900">{rating}/5</span>
                <span className="text-xs text-slate-500 font-medium">
                  ({getRatingLabel(rating)})
                </span>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1 text-right">
                Status Moderasi
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${getStatusBadge(
                  status
                )}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    status === "Disetujui" || status === "Approved"
                      ? "bg-emerald-500"
                      : status === "Ditolak" || status === "Rejected"
                      ? "bg-rose-500"
                      : "bg-amber-500"
                  }`}
                />
                {status}
              </span>
            </div>
          </div>

          {/* Book Info */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <Icon name="bookOpen" className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
                Buku Yang Diulas
              </span>
              <h4 className="font-semibold text-slate-900 text-sm truncate">
                {book}
              </h4>
              {review.bookAuthor && (
                <p className="text-xs text-slate-500">oleh {review.bookAuthor}</p>
              )}
            </div>
          </div>

          {/* Reviewer User Info */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs">
            {review.userAvatar ? (
              <img
                src={review.userAvatar}
                alt={user}
                className="h-10 w-10 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white shadow-2xs">
                {initials}
              </div>
            )}
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
                Pengulas
              </span>
              <h4 className="font-semibold text-slate-900 text-sm">{user}</h4>
              <p className="text-xs font-mono text-slate-500">{userEmail}</p>
            </div>
          </div>

          {/* Comment Block */}
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 block">
              Isi Ulasan / Komentar
            </span>
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-slate-700 leading-relaxed font-serif text-sm italic">
              &ldquo;{comment}&rdquo;
            </div>
          </div>

          {/* Timestamp info */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <Icon name="clock" className="h-3.5 w-3.5" />
              Waktu Ulasan: {dateStr}
            </span>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-6 py-4 bg-slate-50/50">
          <div className="flex items-center gap-2">
            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDelete(review);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
              >
                <Icon name="trash" className="h-3.5 w-3.5" />
                <span>Hapus Ulasan</span>
              </button>
            )}

            {onModerateStatus && status !== "Disetujui" && (
              <button
                type="button"
                onClick={() => onModerateStatus(review, "Disetujui")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
              >
                <Icon name="check" className="h-3.5 w-3.5" />
                <span>Setujui</span>
              </button>
            )}

            {onModerateStatus && status !== "Ditolak" && (
              <button
                type="button"
                onClick={() => onModerateStatus(review, "Ditolak")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-100 transition-colors"
              >
                <Icon name="ban" className="h-3.5 w-3.5" />
                <span>Tolak</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
