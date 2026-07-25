import { useState, useEffect } from "react";
import Icon from "../Icon";

export default function AdminCategoryModal({
  isOpen,
  onClose,
  onSave,
  category = null,
}) {
  const isEditing = Boolean(category?.id);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    bookCount: 0,
  });

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Helper to generate slug from name
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  useEffect(() => {
    if (isOpen) {
      if (category) {
        setFormData({
          name: category.name || "",
          slug: category.slug || "",
          description: category.description || "",
          bookCount: category.bookCount || 0,
        });
        setSlugManuallyEdited(true);
      } else {
        setFormData({
          name: "",
          slug: "",
          description: "",
          bookCount: 0,
        });
        setSlugManuallyEdited(false);
      }
      setErrorMsg("");
    }
  }, [isOpen, category]);

  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNameChange = (e) => {
    const nameVal = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name: nameVal,
      slug: slugManuallyEdited ? prev.slug : generateSlug(nameVal),
    }));
    if (errorMsg) setErrorMsg("");
  };

  const handleSlugChange = (e) => {
    setSlugManuallyEdited(true);
    setFormData((prev) => ({
      ...prev,
      slug: generateSlug(e.target.value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setErrorMsg("Nama kategori wajib diisi.");
      return;
    }

    const finalSlug = formData.slug.trim() || generateSlug(formData.name);

    onSave({
      id: category?.id,
      name: formData.name.trim(),
      slug: finalSlug,
      description: formData.description.trim(),
      bookCount: Number(formData.bookCount) || 0,
    });
  };

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
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-amber-100 p-2 text-amber-800">
              <Icon name={isEditing ? "pen" : "tag"} className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-playfair text-lg font-bold text-slate-900">
                {isEditing ? "Edit Kategori" : "Tambah Kategori Baru"}
              </h3>
              <p className="text-xs text-slate-500">
                {isEditing
                  ? "Perbarui informasi kategori yang sudah ada"
                  : "Isi formulir di bawah untuk membuat kategori baru"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            aria-label="Tutup modal"
          >
            <Icon name="close" className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="rounded-xl bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-100 flex items-center gap-2">
              <Icon name="info" className="h-4 w-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Category Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Nama Kategori <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={handleNameChange}
              placeholder="Contoh: Teknologi, Sains, Fiksi..."
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              autoFocus
            />
          </div>

          {/* Category Slug */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Slug URL
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-xs font-medium text-slate-400">
                /
              </span>
              <input
                type="text"
                value={formData.slug}
                onChange={handleSlugChange}
                placeholder="teknologi"
                className="w-full rounded-xl border border-slate-200 pl-7 pr-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Slug dibuat otomatis dari nama kategori. Anda juga dapat mengubahnya secara manual.
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Deskripsi Kategori
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Penjelasan singkat mengenai jenis atau isi buku dalam kategori ini..."
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20 resize-none"
            />
          </div>

          {/* Initial / Current Book Count */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Jumlah Buku Terdaftar
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                value={formData.bookCount}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, bookCount: e.target.value }))
                }
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Jumlah koleksi buku yang terkelompok dalam kategori ini.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
            >
              <Icon name={isEditing ? "check" : "plus"} className="h-4 w-4" />
              <span>{isEditing ? "Simpan Perubahan" : "Tambah Kategori"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
