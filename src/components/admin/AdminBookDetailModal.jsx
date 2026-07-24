import { useEffect } from "react";
import Icon from "../Icon";

const displayValue = (value) => value || "—";

export default function AdminBookDetailModal({ book, onClose }) {
  useEffect(() => {
    if (!book) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [book, onClose]);

  if (!book) return null;

  const fields = [
    ["Penulis", book.author],
    ["Tahun Terbit", book.year],
    ["Publisher", book.publisher],
    ["ISBN", book.isbn],
    ["Subject / Kategori", book.subjects?.join(", ") || book.genre],
    ["Bahasa", book.languages?.join(", ")],
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Detail buku: ${book.title}`}
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-slate-100 p-5 sm:p-6">
          <div className="flex min-w-0 gap-4">
            <div className="h-20 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
              {book.cover ? (
                <img src={book.cover} alt={`Sampul ${book.title}`} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center p-1 text-center text-[9px] font-semibold text-slate-400">
                  Tanpa cover
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Detail katalog</p>
              <h2 className="mt-1 truncate font-playfair text-xl font-bold text-slate-900 sm:text-2xl">{book.title}</h2>
              <p className="mt-1 text-sm text-slate-500">{book.author}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Tutup detail">
            <Icon name="close" className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 sm:p-6">
          {fields.map(([label, value]) => (
            <div key={label} className="rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
              <p className="mt-1 break-words text-sm font-medium text-slate-800">{displayValue(value)}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-500 sm:px-6">
          Data katalog disediakan oleh Open Library API.
        </div>
      </div>
    </div>
  );
}
