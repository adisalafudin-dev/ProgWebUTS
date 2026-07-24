import { useEffect, useMemo, useState } from "react";
import Icon from "../../components/Icon";
import EmptyState from "../../components/EmptyState";
import LoadingSpinner from "../../components/LoadingSpinner";
import Pagination from "../../components/Pagination";
import AdminCategoryModal from "../../components/admin/AdminCategoryModal";
import AdminCategoryDeleteModal from "../../components/admin/AdminCategoryDeleteModal";
import { categoryService } from "../../services/categoryService";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal & Notification states (Ready for Backend integration)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Load dynamic categories derived from Public API
  const loadCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await categoryService.getCategories();
      setCategories(data || []);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error fetching categories from Public API:", err);
      setError(
        "Gagal memuat data kategori dari Public API Open Library. Silakan coba beberapa saat lagi."
      );
    } fontally: {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Filter Categories by Search Term
  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return categories;
    const term = searchTerm.toLowerCase().trim();
    return categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(term) ||
        cat.slug.toLowerCase().includes(term) ||
        (cat.description && cat.description.toLowerCase().includes(term))
    );
  }, [categories, searchTerm]);

  // Pagination Logic
  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / itemsPerPage)
  );
  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCategories.slice(start, start + itemsPerPage);
  }, [filteredCategories, currentPage, itemsPerPage]);

  // Summary Statistics (Calculated from Public API Data)
  const totalBooks = useMemo(() => {
    return categories.reduce(
      (sum, cat) => sum + (Number(cat.bookCount) || 0),
      0
    );
  }, [categories]);

  const topCategory = useMemo(() => {
    if (categories.length === 0) return null;
    return categories.reduce((prev, current) =>
      (prev.bookCount || 0) > (current.bookCount || 0) ? prev : current
    );
  }, [categories]);

  // Backend Integration Handlers (Ready for POST / PUT / DELETE API connections)
  const handleSaveCategory = async (categoryData) => {
    try {
      if (categoryData.id) {
        await categoryService.updateCategory(categoryData.id, categoryData);
      } else {
        await categoryService.createCategory(categoryData);
      }
    } catch (err) {
      showNotification(
        err?.message || "Aksi ini memerlukan integrasi backend.",
        "warning"
      );
    } finally {
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
    }
  };

  const handleConfirmDelete = async (categoryId) => {
    try {
      await categoryService.deleteCategory(categoryId);
    } catch (err) {
      showNotification(
        err?.message || "Aksi ini memerlukan integrasi backend.",
        "warning"
      );
    } finally {
      setDeletingCategory(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Header Action */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-slate-900">
            Daftar Kategori (Public API)
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            Kategori dan jumlah buku diekstrak secara otomatis dari Open Library Public API.
          </p>
        </div>

        {/* Add Category Button (Disabled - Available after Backend Integration) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-2 rounded-xl bg-slate-100 border border-slate-200 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-400 cursor-not-allowed opacity-80"
            title="Fitur ini memerlukan integrasi backend"
          >
            <Icon name="plus" className="h-4 w-4" />
            <span>Tambah Kategori</span>
          </button>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 border border-amber-200">
            <Icon name="info" className="h-3.5 w-3.5" />
            Available after Backend Integration
          </span>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div
          className={`rounded-2xl p-4 text-xs sm:text-sm font-medium border flex items-center justify-between shadow-xs transition-all animate-fadeIn ${
            notification.type === "warning"
              ? "bg-amber-50 text-amber-900 border-amber-200"
              : "bg-blue-50 text-blue-900 border-blue-200"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg p-1.5 bg-amber-100 text-amber-800">
              <Icon name="info" className="h-4 w-4" />
            </div>
            <span>{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Read-Only Information Banner */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-amber-900 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-amber-100 p-2.5 text-amber-700">
            <Icon name="info" className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-semibold">
              Mode Read-Only (Public API)
            </p>
            <p className="text-xs text-amber-700">
              Data kategori dan jumlah buku dibuat secara *live* dari Public API Open Library. Aksi Tambah, Edit, dan Hapus dinonaktifkan sementara.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center rounded-full bg-amber-200/90 px-3 py-1 text-[11px] font-bold text-amber-900 uppercase tracking-wider">
          Available after Backend Integration
        </span>
      </div>

      {/* Summary Statistics Cards (Live Public API Data) */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        {/* Card 1: Total Kategori */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center gap-4">
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600 border border-blue-100">
            <Icon name="tag" className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Total Kategori API
            </p>
            <h3 className="font-playfair text-2xl font-bold text-slate-900 mt-0.5">
              {isLoading ? "-" : categories.length}
            </h3>
          </div>
        </div>

        {/* Card 2: Total Buku terdaftar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center gap-4">
          <div className="rounded-xl bg-amber-50 p-3 text-amber-600 border border-amber-100">
            <Icon name="bookOpen" className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Buku Teridentifikasi
            </p>
            <h3 className="font-playfair text-2xl font-bold text-slate-900 mt-0.5">
              {isLoading ? "-" : totalBooks}{" "}
              <span className="text-xs font-normal text-slate-500">buku</span>
            </h3>
          </div>
        </div>

        {/* Card 3: Kategori Terpopuler */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center gap-4">
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 border border-emerald-100">
            <Icon name="flame" className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Kategori Terbanyak
            </p>
            <h3 className="font-playfair text-lg font-bold text-slate-900 mt-0.5 line-clamp-1">
              {isLoading ? "-" : topCategory?.name || "-"}
            </h3>
            <p className="text-xs text-slate-500">
              {isLoading
                ? "-"
                : topCategory
                ? `${topCategory.bookCount} buku dari Public API`
                : "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Control Bar: Search Input */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative max-w-md">
          <Icon
            name="search"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari kategori dari Public API..."
            className="w-full rounded-xl border border-slate-200 pl-10 pr-8 py-2.5 text-xs sm:text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setCurrentPage(1);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <Icon name="close" className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Conditional Rendering: Loading State */}
      {isLoading ? (
        <div className="min-h-[300px] rounded-2xl border border-slate-200 bg-white p-12 shadow-sm flex flex-col items-center justify-center">
          <LoadingSpinner />
          <p className="mt-4 text-xs sm:text-sm font-medium text-slate-600">
            Mengambil data kategori dari Public API Open Library...
          </p>
        </div>
      ) : error ? (
        /* Conditional Rendering: Error State */
        <div className="rounded-2xl border border-red-200 bg-red-50/60 p-6 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <Icon name="info" className="h-6 w-6" />
          </div>
          <h3 className="font-playfair text-lg font-bold text-slate-900 mb-1">
            Gagal Memuat Kategori
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-4">
            {error}
          </p>
          <button
            type="button"
            onClick={loadCategories}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
          >
            <Icon name="refresh" className="h-4 w-4" />
            Coba Lagi
          </button>
        </div>
      ) : filteredCategories.length > 0 ? (
        /* Categories Grid Container */
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {paginatedCategories.map((category) => (
              <article
                key={category.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:shadow-md hover:border-slate-300"
              >
                <div>
                  {/* Top Bar: Name, Slug, & Book Count Badge */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-playfair text-lg font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                        {category.name}
                      </h3>
                      <p className="mt-0.5 text-xs font-mono text-slate-400">
                        /{category.slug}
                      </p>
                    </div>
                    {/* Badge Jumlah Buku per kategori */}
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-200/80 flex-shrink-0">
                      <Icon name="bookOpen" className="h-3.5 w-3.5 text-amber-600" />
                      {category.bookCount} buku
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {category.description || "Kategori dari Public API Open Library."}
                  </p>
                </div>

                {/* Bottom Card Actions (Disabled - Read Only Mode) */}
                <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
                  {/* Edit Button (Disabled) */}
                  <button
                    type="button"
                    disabled
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-300 cursor-not-allowed opacity-70"
                    title="Edit: Available after Backend Integration"
                  >
                    <Icon name="pen" className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </button>

                  {/* Delete Button (Disabled) */}
                  <button
                    type="button"
                    disabled
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-300 cursor-not-allowed opacity-70"
                    title="Delete: Available after Backend Integration"
                  >
                    <Icon name="trash" className="h-3.5 w-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Reusable Pagination */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredCategories.length}
              itemsPerPage={itemsPerPage}
            />
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center">
          <EmptyState
            icon="tag"
            title="Tidak Ada Kategori Ditemukan"
            description={
              searchTerm
                ? `Tidak ada kategori dari Public API yang cocok dengan pencarian "${searchTerm}".`
                : "Belum ada data kategori yang berhasil dimuat dari Public API."
            }
          />
          {searchTerm && (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5"
              >
                <Icon name="refresh" className="h-3.5 w-3.5" />
                Reset Pencarian
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Category Modal (Ready for Backend CRUD) */}
      <AdminCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setEditingCategory(null);
        }}
        onSave={handleSaveCategory}
        category={editingCategory}
      />

      {/* Delete Category Confirmation Modal (Ready for Backend CRUD) */}
      <AdminCategoryDeleteModal
        isOpen={Boolean(deletingCategory)}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleConfirmDelete}
        category={deletingCategory}
      />
    </div>
  );
}
