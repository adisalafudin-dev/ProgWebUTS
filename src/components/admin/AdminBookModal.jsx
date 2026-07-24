import { useEffect, useState } from "react";
import Icon from "../Icon";

export default function AdminBookModal({
  isOpen,
  onClose,
  onSave,
  book = null,
  categories = [],
}) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "Classic",
    year: new Date().getFullYear(),
    rating: 4.5,
    pages: 200,
    status: "Aktif",
    cover: "",
    synopsis: "",
  });

  const [errors, setErrors] = useState({});
  const [coverError, setCoverError] = useState(false);

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || "",
        author: book.author || "",
        category: book.category || book.genre || (categories[0] || "Classic"),
        year: book.year || new Date().getFullYear(),
        rating: book.rating || 4.5,
        pages: book.pages || 200,
        status: book.status || "Aktif",
        cover: book.cover || "",
        synopsis: book.synopsis || book.description || "",
      });
    } else {
      setFormData({
        title: "",
        author: "",
        category: categories[0] || "Classic",
        year: new Date().getFullYear(),
        rating: 4.5,
        pages: 200,
        status: "Aktif",
        cover: "",
        synopsis: "",
      });
    }
    setErrors({});
    setCoverError(false);
  }, [book, isOpen, categories]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "cover") {
      setCoverError(false);
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Judul buku wajib diisi";
    if (!formData.author.trim()) newErrors.author = "Nama penulis wajib diisi";
    if (!formData.category) newErrors.category = "Kategori wajib dipilih";
    if (formData.rating < 0 || formData.rating > 5) {
      newErrors.rating = "Rating harus antara 0.0 sampai 5.0";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      ...formData,
      genre: formData.category,
      year: Number(formData.year) || new Date().getFullYear(),
      rating: Number(formData.rating) || 4.0,
      pages: Number(formData.pages) || 0,
    });
  };

  const isEditing = Boolean(book?.id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-slate-900 p-2 text-white">
              <Icon name={isEditing ? "pen" : "plus"} className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-playfair text-xl font-bold text-slate-900">
                {isEditing ? "Edit Detail Buku" : "Tambah Buku Baru"}
              </h3>
              <p className="text-xs text-slate-500">
                {isEditing
                  ? "Perbarui informasi buku dalam katalog admin."
                  : "Isi formulir berikut untuk menambahkan buku baru."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            aria-label="Tutup modal"
          >
            <Icon name="close" className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-130px)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Live Cover Preview Sidebar */}
            <div className="flex flex-col items-center gap-3 md:col-span-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 w-full text-center">
                Preview Sampul
              </label>

              <div className="relative aspect-[3/4] w-full max-w-[200px] overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center shadow-sm">
                {formData.cover && !coverError ? (
                  <img
                    src={formData.cover}
                    alt="Preview sampul"
                    className="h-full w-full object-cover rounded-lg"
                    onError={() => setCoverError(true)}
                  />
                ) : (
                  <div className="p-4 text-center text-slate-400 flex flex-col items-center">
                    <Icon name="image" className="h-10 w-10 mb-2 opacity-50" />
                    <span className="text-xs font-medium">
                      {coverError ? "Gambar tidak valid" : "Belum Ada Sampul"}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1">
                      Masukkan URL gambarnya di form
                    </span>
                  </div>
                )}

                <div className="absolute top-2 right-2 rounded-md bg-slate-900/70 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                  {formData.status}
                </div>
              </div>

              <div className="text-center w-full">
                <span className="text-xs font-bold text-slate-800 block truncate">
                  {formData.title || "Judul Buku"}
                </span>
                <span className="text-[11px] text-slate-500 block truncate">
                  {formData.author || "Nama Penulis"}
                </span>
              </div>
            </div>

            {/* Inputs Section */}
            <div className="space-y-4 md:col-span-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Judul Buku <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Contoh: Laskar Pelangi"
                  className={`w-full rounded-xl border px-3.5 py-2 text-sm transition-all focus:outline-none focus:ring-2 ${
                    errors.title
                      ? "border-red-300 focus:ring-red-400 bg-red-50/20"
                      : "border-slate-200 focus:border-slate-900 focus:ring-slate-900/20"
                  }`}
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-500 font-medium">{errors.title}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Penulis <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="Contoh: Andrea Hirata"
                    className={`w-full rounded-xl border px-3.5 py-2 text-sm transition-all focus:outline-none focus:ring-2 ${
                      errors.author
                        ? "border-red-300 focus:ring-red-400 bg-red-50/20"
                        : "border-slate-200 focus:border-slate-900 focus:ring-slate-900/20"
                    }`}
                  />
                  {errors.author && (
                    <p className="mt-1 text-xs text-red-500 font-medium">{errors.author}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tahun Terbit
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rating (0.0-5.0)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  URL Sampul Buku (Cover Image)
                </label>
                <input
                  type="url"
                  name="cover"
                  value={formData.cover}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sinopsis / Deskripsi Ringkas
                </label>
                <textarea
                  name="synopsis"
                  rows={3}
                  value={formData.synopsis}
                  onChange={handleChange}
                  placeholder="Tuliskan ringkasan alur atau sinopsis buku di sini..."
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
            >
              <Icon name={isEditing ? "check" : "plus"} className="h-4 w-4" />
              {isEditing ? "Simpan Perubahan" : "Tambah Buku"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
