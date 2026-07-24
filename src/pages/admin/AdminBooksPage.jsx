import { useMemo, useState, useEffect } from "react";
import Icon from "../../components/Icon";
import EmptyState from "../../components/EmptyState";
import Pagination from "../../components/Pagination";
import AdminBookModal from "../../components/admin/AdminBookModal";
import AdminBookDeleteModal from "../../components/admin/AdminBookDeleteModal";
import AdminBookCoverPreviewModal from "../../components/admin/AdminBookCoverPreviewModal";
import { GENRES } from "../../constants/books";
import { useNotification } from "../../contexts/NotificationContext";

const INITIAL_BOOKS = [
  {
    id: "b-1",
    title: "Sejarah Nusantara",
    author: "Anonim",
    category: "History",
    year: 2018,
    rating: 4.6,
    pages: 350,
    status: "Aktif",
    cover: "https://covers.openlibrary.org/b/id/8231856-L.jpg",
    synopsis: "Eksplorasi mendalam mengenai sejarah dan peradaban kepulauan Nusantara dari era kerajaan hingga kemerdekaan.",
  },
  {
    id: "b-2",
    title: "Petualangan di Hutan",
    author: "Rina Wijaya",
    category: "Adventure",
    year: 2021,
    rating: 4.3,
    pages: 210,
    status: "Aktif",
    cover: "https://covers.openlibrary.org/b/id/6979861-L.jpg",
    synopsis: "Kisah menegangkan sekelompok remaja yang menjelajahi hutan terlarang untuk menyingkap misteri kuno.",
  },
  {
    id: "b-3",
    title: "Panduan React Modern",
    author: "Dev Team",
    category: "Science",
    year: 2023,
    rating: 4.8,
    pages: 420,
    status: "Draft",
    cover: "https://covers.openlibrary.org/b/id/8305841-L.jpg",
    synopsis: "Panduan praktis membangun aplikasi web berkinerja tinggi dengan React, Hooks, dan TailwindCSS.",
  },
  {
    id: "b-4",
    title: "Kumpulan Puisi Malam",
    author: "Sastra Kita",
    category: "Poetry",
    year: 2019,
    rating: 4.5,
    pages: 120,
    status: "Aktif",
    cover: "https://covers.openlibrary.org/b/id/9255566-L.jpg",
    synopsis: "Koleksi bait puisi perenungan tentang kehidupan, kesepian, dan keindahan malam hari.",
  },
  {
    id: "b-5",
    title: "Nineteen Eighty-Four",
    author: "George Orwell",
    category: "Dystopia",
    year: 1949,
    rating: 4.8,
    pages: 328,
    status: "Aktif",
    cover: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
    synopsis: "Kisah distopia tentang pengawasan totaliter dan perjuangan kebebasan individu.",
  },
  {
    id: "b-6",
    title: "Filosofi Teras",
    author: "Henry Manampiring",
    category: "Philosophy",
    year: 2019,
    rating: 4.9,
    pages: 344,
    status: "Aktif",
    cover: "https://covers.openlibrary.org/b/id/8231856-L.jpg",
    synopsis: "Penerapan filsafat Stoisisme kuno untuk mental yang tangguh dalam menghadapi kehidupan modern.",
  },
];

const LOCAL_STORAGE_KEY = "admin_books_store_v1";

export default function AdminBooksPage() {
  const { showToast } = useNotification();

  // Load state from localStorage if available, or initial fallback
  const [books, setBooks] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Failed to parse saved admin books", e);
    }
    return INITIAL_BOOKS;
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(books));
    } catch (e) {
      console.error("Failed to save admin books to localStorage", e);
    }
  }, [books]);

  // Filter & Search & Pagination States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedStatus, setSelectedStatus] = useState("Semua");
  const [sortBy, setSortBy] = useState("title-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingBook, setDeletingBook] = useState(null);

  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewingBook, setPreviewingBook] = useState(null);

  // Available categories list
  const categoryOptions = useMemo(() => {
    const defaultList = GENRES.filter((g) => g !== "Semua");
    const bookCategories = books.map((b) => b.category || b.genre).filter(Boolean);
    const merged = Array.from(new Set([...defaultList, ...bookCategories]));
    return merged.sort();
  }, [books]);

  // Reset page to 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedStatus, sortBy]);

  // Filter and Sort Books logic
  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        // Search Filter
        const query = searchQuery.trim().toLowerCase();
        if (query) {
          const matchTitle = (book.title || "").toLowerCase().includes(query);
          const matchAuthor = (book.author || "").toLowerCase().includes(query);
          if (!matchTitle && !matchAuthor) return false;
        }

        // Category Filter
        if (selectedCategory !== "Semua") {
          const bookCat = book.category || book.genre;
          if (bookCat !== selectedCategory) return false;
        }

        // Status Filter
        if (selectedStatus !== "Semua") {
          if ((book.status || "Aktif") !== selectedStatus) return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "title-asc":
            return (a.title || "").localeCompare(b.title || "");
          case "title-desc":
            return (b.title || "").localeCompare(a.title || "");
          case "year-desc":
            return (b.year || 0) - (a.year || 0);
          case "year-asc":
            return (a.year || 0) - (b.year || 0);
          case "rating-desc":
            return (b.rating || 0) - (a.rating || 0);
          default:
            return 0;
        }
      });
  }, [books, searchQuery, selectedCategory, selectedStatus, sortBy]);

  // Pagination Slice
  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / itemsPerPage));
  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBooks.slice(start, start + itemsPerPage);
  }, [filteredBooks, currentPage, itemsPerPage]);

  // Statistics
  const totalBookCount = books.length;
  const activeBookCount = books.filter((b) => (b.status || "Aktif") === "Aktif").length;
  const draftBookCount = books.filter((b) => b.status === "Draft").length;

  const hasActiveFilters =
    searchQuery !== "" || selectedCategory !== "Semua" || selectedStatus !== "Semua" || sortBy !== "title-asc";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("Semua");
    setSelectedStatus("Semua");
    setSortBy("title-asc");
    setCurrentPage(1);
  };

  // Handlers for Add/Edit Modal
  const handleOpenAddModal = () => {
    setEditingBook(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (book) => {
    setEditingBook(book);
    setIsFormModalOpen(true);
  };

  const handleSaveBook = (bookData) => {
    if (editingBook) {
      // Edit
      setBooks((prev) =>
        prev.map((b) => (b.id === editingBook.id ? { ...b, ...bookData, id: editingBook.id } : b))
      );
      showToast?.("Buku Diperbarui", `"${bookData.title}" berhasil diperbarui`, "success");
    } else {
      // Add
      const newBook = {
        ...bookData,
        id: `book-${Date.now()}`,
      };
      setBooks((prev) => [newBook, ...prev]);
      showToast?.("Buku Ditambahkan", `"${bookData.title}" berhasil ditambahkan`, "success");
    }
    setIsFormModalOpen(false);
    setEditingBook(null);
  };

  // Handlers for Delete Modal
  const handleOpenDeleteModal = (book) => {
    setDeletingBook(book);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deletingBook) return;
    setBooks((prev) => prev.filter((b) => b.id !== deletingBook.id));
    showToast?.("Buku Dihapus", `"${deletingBook.title}" berhasil dihapus`, "info");
    setIsDeleteModalOpen(false);
    setDeletingBook(null);
  };

  // Handlers for Preview Modal
  const handleOpenPreviewModal = (book) => {
    setPreviewingBook(book);
    setIsPreviewModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-slate-900">
            Daftar Buku
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            Kelola koleksi buku yang ditampilkan di aplikasi, tambah baru, edit, atau perbarui status.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-all active:scale-[0.98]"
        >
          <Icon name="plus" className="h-4 w-4" />
          <span>Tambah Buku</span>
        </button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex items-center gap-4">
          <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
            <Icon name="bookOpen" className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Buku</p>
            <p className="font-playfair text-2xl font-bold text-slate-900">{totalBookCount}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 shadow-sm flex items-center gap-4">
          <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
            <Icon name="check" className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-emerald-600 font-medium">Buku Aktif</p>
            <p className="font-playfair text-2xl font-bold text-emerald-900">{activeBookCount}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-4 shadow-sm flex items-center gap-4">
          <div className="rounded-xl bg-amber-100 p-3 text-amber-700">
            <Icon name="tag" className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-amber-600 font-medium">Buku Draft</p>
            <p className="font-playfair text-2xl font-bold text-amber-900">{draftBookCount}</p>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Field */}
          <div className="relative">
            <Icon
              name="search"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul atau penulis..."
              className="w-full rounded-xl border border-slate-200 pl-10 pr-8 py-2 text-xs sm:text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <Icon name="close" className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            >
              <option value="Semua">Semua Kategori</option>
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            >
              <option value="Semua">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            >
              <option value="title-asc">Judul (A-Z)</option>
              <option value="title-desc">Judul (Z-A)</option>
              <option value="year-desc">Tahun Terbaru</option>
              <option value="year-asc">Tahun Terlama</option>
              <option value="rating-desc">Rating Tertinggi</option>
            </select>
          </div>
        </div>

        {/* Reset Filter Action */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-500">
              Ditemukan <span className="font-semibold text-slate-900">{filteredBooks.length}</span> buku dari filter
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

      {/* Main Content Table & Container */}
      {filteredBooks.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3.5 font-semibold w-16">Cover</th>
                  <th className="px-5 py-3.5 font-semibold">Judul & Penulis</th>
                  <th className="px-5 py-3.5 font-semibold">Kategori</th>
                  <th className="px-5 py-3.5 font-semibold">Tahun & Rating</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedBooks.map((book) => {
                  const categoryName = book.category || book.genre || "General";
                  const status = book.status || "Aktif";
                  return (
                    <tr key={book.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Cover Thumbnail */}
                      <td className="px-5 py-3">
                        <button
                          type="button"
                          onClick={() => handleOpenPreviewModal(book)}
                          className="group relative h-12 w-9 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-2xs transition-transform hover:scale-105"
                          title="Klik untuk melihat sampul"
                        >
                          {book.cover ? (
                            <img
                              src={book.cover}
                              alt={book.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-slate-800 text-white text-[9px] text-center p-0.5">
                              {book.title.slice(0, 3)}
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
                          <span className="font-semibold text-slate-900 hover:text-slate-700 transition-colors">
                            {book.title}
                          </span>
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

                      {/* Status */}
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            status === "Aktif"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenPreviewModal(book)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                            title="Preview Sampul & Detail"
                          >
                            <Icon name="eye" className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(book)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                            title="Edit Buku"
                          >
                            <Icon name="pen" className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenDeleteModal(book)}
                            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                            title="Hapus Buku"
                          >
                            <Icon name="trash" className="h-4 w-4" />
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
            totalItems={filteredBooks.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <EmptyState
            icon="bookOpen"
            title="Tidak ada buku ditemukan"
            description={
              hasActiveFilters
                ? "Tidak ada buku yang sesuai dengan pencarian atau filter yang ditentukan."
                : "Belum ada buku yang ditambahkan ke dalam sistem."
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

      {/* Modals */}
      <AdminBookModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingBook(null);
        }}
        onSave={handleSaveBook}
        book={editingBook}
        categories={categoryOptions}
      />

      <AdminBookDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingBook(null);
        }}
        onConfirm={handleConfirmDelete}
        bookTitle={deletingBook?.title}
      />

      <AdminBookCoverPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => {
          setIsPreviewModalOpen(false);
          setPreviewingBook(null);
        }}
        book={previewingBook}
      />
    </div>
  );
}
