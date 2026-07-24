import { useEffect } from "react";
import Icon from "../Icon";

export default function AdminReviewDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  review = null,
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
  const book = review.book || review.bookTitle || "Buku";
  const comment = review.comment || review.content || review.text || "-";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <Icon name="trash" className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-playfair text-lg font-bold text-slate-900">
              Hapus Ulasan
            </h3>
            <p className="text-xs text-slate-500">
              Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-slate-50 p-4 border border-slate-200/80 text-xs text-slate-600 space-y-2">
          <p>
            Apakah Anda yakin ingin menghapus ulasan dari{" "}
            <strong className="text-slate-900">{user}</strong> untuk buku{" "}
            <strong className="text-slate-900">{book}</strong>?
          </p>
          <div className="rounded-lg bg-white p-3 border border-slate-200/60 italic text-slate-700 font-serif text-[11px] line-clamp-3">
            &ldquo;{comment}&rdquo;
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => onConfirm(review.id)}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-rose-700 transition-colors"
          >
            <Icon name="trash" className="h-4 w-4" />
            <span>Hapus Ulasan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
