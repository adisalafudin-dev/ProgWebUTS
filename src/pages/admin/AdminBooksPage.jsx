import { useEffect, useMemo, useState } from "react";
import Icon from "../../components/Icon";
import EmptyState from "../../components/EmptyState";
import LoadingSpinner from "../../components/LoadingSpinner";
import Pagination from "../../components/Pagination";
import BookModal from "../../components/BookModal";
import { GENRES, SORT_OPTIONS } from "../../constants/books";
import { fetchOpenLibraryBooks } from "../../services/openLibraryApi";
import { saveSearchHistory } from "../../services/dashboardService";
import { useDebounce } from "../../hooks/useDebounce";

export default function AdminBooksPage() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Control States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Selected book for Detail Buku Modal (reuses BookModal from user pages)
  const [selectedBookDetail, setSelectedBookDetail] = useState(null);

  // Debounce search term to prevent excessive API requests
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetch Public API Data
  const loadBooksData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchOpenLibraryBooks({
        q: debouncedSearchTerm,
        genre: selectedCategory,
        sort: sortBy,
      });
      setBooks(data || []);
      setCurrentPage(1);
      // Simpan ke riwayat pencarian admin (untuk Dashboard "Aktivitas Terakhir")
      if (debouncedSearchTerm && debouncedSearchTerm.trim()) {
        saveSearchHistory(debouncedSearchTerm.trim(), (data || []).length);
      }
    } catch (err) {
      console.error("Error fetching books from Public API:", err);
      setError(
        "Gagal memuat data buku dari Open Library Public API. Silakan coba beberapa saat lagi.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBooksData();
  }, [debouncedSearchTerm, selectedCategory, sortBy]);

  // Available categories list
  const categoryOptions = useMemo(() => {
    return GENRES;
  }, []);

  // Filtered and Sorted list pagination
  const totalPages = Math.max(1, Math.ceil(books.length / itemsPerPage));
  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return books.slice(start, start + itemsPerPage);
  }, [books, currentPage, itemsPerPage]);

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    selectedCategory !== "Semua" ||
    sortBy !== "default";

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("Semua");
    setSortBy("default");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Header Action */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-slate-900">
            Daftar Buku (Public API)
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            Kelola dan pantau koleksi buku real-time yang bersumber dari Open Library API.
          </p>
        </div>

        {/* Add Book Button (Disabled - Available after Backend Integration) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-2 rounded-xl bg-slate-100 border border-slate-200 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-400 cursor-not-allowed opacity-80"
            title="Fitur ini memerlukan integrasi backend"
          >
            <Icon name="plus" className="h-4 w-4" />
            <span>Tambah Buku</span>
          </button>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 border border-amber-200">
            <Icon name="info" className="h-3.5 w-3.5" />
            Available after Backend Integration
          </span>
        </div>
      </div>

      {/* Read-Only Information Banner */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-amber-900 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-amber-100 p-2.5 text-amber-700">
            <Icon name="info" className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-semibold">Mode Read-Only (Public API)</p>
            <p className="text-xs text-amber-700">
              Data buku dikirim secara *live* dari Public API Open Library. Aksi Tambah, Edit, dan Hapus dinonaktifkan sementara.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center rounded-full bg-amber-200/90 px-3 py-1 text-[11px] font-bold text-amber-900 uppercase tracking-wider">
          Available after Backend Integration
        </span>
      </div>

      {/* Filters Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Icon
              name="search"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari judul atau penulis..."
              className="w-full rounded-xl border border-slate-200 pl-10 pr-8 py-2 text-xs sm:text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <Icon name="close" className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            >
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "Semua" ? "Semua Kategori" : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reset Active Filters */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-500">
              Ditemukan <span className="font-semibold text-slate-900">{books.length}</span> buku dari Public API
            </span>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 transition-colors"
            >
              <Icon name="refresh" className="h-3.5 w-3.5" />
              Reset Filter
            </button>
          </div>
        )}
      </div>

      {/* Conditional Rendering: Loading State */}
      {isLoading ? (
        <div className="min-h-[300px] rounded-2xl border border-slate-200 bg-white p-12 shadow-sm flex flex-col items-center justify-center">
          <LoadingSpinner />
          <p className="mt-4 text-xs sm:text-sm font-medium text-slate-600">
            Mengambil data buku dari Public API Open Library...
          </p>
        </div>
      ) : error ? (
        /* Conditional Rendering: Error State */
        <div className="rounded-2xl border border-red-200 bg-red-50/60 p-6 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <Icon name="info" className="h-6 w-6" />
          </div>
          <h3 className="font-playfair text-lg font-bold text-slate-900 mb-1">
            Gagal Memuat Data
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-4">
            {error}
          </p>
          <button
            type="button"
            onClick={loadBooksData}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
          >
            <Icon name="refresh" className="h-4 w-4" />
            Coba Lagi
          </button>
        </div>
      ) : books.length > 0 ? (
        /* Content Table Container */
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3.5 font-semibold w-16">Cover</th>
                  <th className="px-5 py-3.5 font-semibold">Judul & Penulis</th>
                  <th className="px-5 py-3.5 font-semibold">Kategori</th>
                  <th className="px-5 py-3.5 font-semibold">Tahun & Rating</th>
                  <th className="px-5 py-3.5 font-semibold">Status Ketersediaan</th>
                  <th className="px-5 py-3.5 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedBooks.map((book) => {
                  const isAvailable = book.available !== false;
                  const categoryName = book.genre || book.genres?.[0] || "General";
                  return (
                    <tr key={book.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Cover Thumbnail */}
                      <td className="px-5 py-3">
                        <button
                          type="button"
                          onClick={() => setSelectedBookDetail(book)}
                          className="group relative h-12 w-9 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-2xs transition-transform hover:scale-105"
                          title="Klik untuk melihat Detail Buku"
                        >
                          {book.cover ? (
                            <img
                              src={book.cover}
                              alt={book.title}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-slate-800 text-white text-[9px] text-center p-0.5 font-bold">
                              {book.title?.slice(0, 3)}
                            </div>
                          )}
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                            <Icon name="eye" className="h-4 w-4" />
                          </div>
                        </button>
                      </td>

                      {/* Title & Author */}
                      <td className="px-5 py-3">
                        <div className="flex flex-col">
                          <button
                            type="button"
                            onClick={() => setSelectedBookDetail(book)}
                            className="text-left font-semibold text-slate-900 hover:text-slate-700 transition-colors line-clamp-1"
                          >
                            {book.title}
                          </button>
                          <span className="text-xs text-slate-500 font-medium">
                            {book.author}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200/60">
                          {categoryName}
                        </span>
                      </td>

                      {/* Year & Rating */}
                      <td className="px-5 py-3 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="text-slate-600 font-medium">{book.year || "-"}</span>
                          <span className="inline-flex items-center gap-1 font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                            <Icon name="star" className="h-3 w-3" />
                            {book.rating || "4.0"}
                          </span>
                        </div>
                      </td>

                      {/* Availability Status */}
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            isAvailable
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {isAvailable ? "Tersedia" : "Dipinjam"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Detail Buku Button (Active) */}
                          <button
                            type="button"
                            onClick={() => setSelectedBookDetail(book)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                            title="Lihat Detail Buku"
                          >
                            <Icon name="eye" className="h-3.5 w-3.5 text-slate-600" />
                            <span>Detail</span>
                          </button>

                          {/* Edit Button (Disabled) */}
                          <button
                            type="button"
                            disabled
                            className="rounded-lg p-1.5 text-slate-300 bg-slate-50 cursor-not-allowed opacity-60"
                            title="Edit: Available after Backend Integration"
                          >
                            <Icon name="pen" className="h-3.5 w-3.5" />
                          </button>

                          {/* Delete Button (Disabled) */}
                          <button
                            type="button"
                            disabled
                            className="rounded-lg p-1.5 text-slate-300 bg-slate-50 cursor-not-allowed opacity-60"
                            title="Delete: Available after Backend Integration"
                          >
                            <Icon name="trash" className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Reusable Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={books.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      ) : (
        /* Conditional Rendering: Empty State */
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <EmptyState
            icon="bookOpen"
            title="Tidak ada buku ditemukan"
            description={
              hasActiveFilters
                ? "Tidak ada data buku dari Public API yang sesuai dengan kata kunci atau filter Anda."
                : "Belum ada data buku yang berhasil dimuat dari Public API."
            }
          />
          {hasActiveFilters && (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={handleResetFilters}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Reset Semua Filter
              </button>
            </div>
          )}
        </div>
      )}

      {/* Detail Buku Modal (Reuses user-facing BookModal component) */}
      <BookModal
        book={selectedBookDetail}
        onClose={() => setSelectedBookDetail(null)}
      />
    </div>
  );
}
