import { useState, useEffect, useMemo, useCallback } from "react";
import Icon from "../../components/Icon";
import EmptyState from "../../components/EmptyState";
import Pagination from "../../components/Pagination";
import AdminReviewDetailModal from "../../components/admin/AdminReviewDetailModal";
import AdminReviewDeleteModal from "../../components/admin/AdminReviewDeleteModal";
import { reviewApi } from "../../services/reviewApi";

const normalizeReview = (item, index) => {
  return {
    id: item.id || item._id || `rev-${index}`,
    book: item.book || item.bookTitle || item.title || "Buku Tidak Didefinisikan",
    bookAuthor: item.bookAuthor || item.author || "",
    user: item.user || item.userName || item.name || "Pengguna",
    userEmail: item.userEmail || item.email || "",
    userAvatar: item.userAvatar || item.avatar || null,
    rating: typeof item.rating === "number" ? item.rating : 4,
    comment: item.comment || item.content || item.text || "-",
    status: item.status || "Menunggu",
    createdAt: item.createdAt || item.date || null,
  };
};

export default function AdminReviewsPage() {
  // Main data state ready for backend Review Service (No hardcoded dummy data)
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRating, setSelectedRating] = useState("Semua");
  const [selectedStatus, setSelectedStatus] = useState("Semua");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal & Notification states
  const [selectedDetailReview, setSelectedDetailReview] = useState(null);
  const [deletingReview, setDeletingReview] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "warning") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Fetch reviews from API
  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await reviewApi.getReviews();
      const reviewList = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : [];
      setReviews(reviewList.map(normalizeReview));
    } catch (err) {
      setError(err?.message || "Gagal mengambil data ulasan dari server.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Filter logic
  const filteredReviews = useMemo(() => {
    return reviews.filter((rev) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        rev.book.toLowerCase().includes(term) ||
        rev.user.toLowerCase().includes(term) ||
        rev.comment.toLowerCase().includes(term);

      const matchesRating =
        selectedRating === "Semua" ||
        Math.floor(rev.rating) === parseInt(selectedRating, 10);

      const matchesStatus =
        selectedStatus === "Semua" || rev.status === selectedStatus;

      return matchesSearch && matchesRating && matchesStatus;
    });
  }, [reviews, searchTerm, selectedRating, selectedStatus]);

  // Pagination logic
  const totalPages = Math.max(
    1,
    Math.ceil(filteredReviews.length / itemsPerPage)
  );

  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredReviews.slice(start, start + itemsPerPage);
  }, [filteredReviews, currentPage, itemsPerPage]);

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    selectedRating !== "Semua" ||
    selectedStatus !== "Semua";

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedRating("Semua");
    setSelectedStatus("Semua");
    setCurrentPage(1);
  };

  // Statistics
  const totalReviewsCount = reviews.length;
  const approvedReviewsCount = reviews.filter(
    (r) => r.status === "Disetujui" || r.status === "Approved"
  ).length;
  const pendingReviewsCount = reviews.filter(
    (r) => r.status === "Menunggu" || r.status === "Pending"
  ).length;
  const avgRatingScore =
    totalReviewsCount > 0
      ? (
          reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) /
          totalReviewsCount
        ).toFixed(1)
      : "0.0";

  // Handlers for Delete & Moderation
  const handleConfirmDelete = async (reviewId) => {
    try {
      await reviewApi.deleteReview(reviewId);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      showNotification("Ulasan berhasil dihapus.", "success");
    } catch (err) {
      showNotification(
        "Penghapusan ulasan memerlukan integrasi backend Review Service.",
        "warning"
      );
    } finally {
      setDeletingReview(null);
    }
  };

  const handleModerateStatus = async (review, newStatus) => {
    try {
      await reviewApi.moderateReview(review.id, { status: newStatus });
      setReviews((prev) =>
        prev.map((r) => (r.id === review.id ? { ...r, status: newStatus } : r))
      );
      showNotification(`Status ulasan berhasil diubah menjadi ${newStatus}.`, "success");
    } catch (err) {
      showNotification(
        `Modifikasi status ulasan memerlukan integrasi backend Review Service.`,
        "warning"
      );
    }
  };

  const renderStars = (rating) => {
    const num = Number(rating) || 0;
    return (
      <div className="flex items-center gap-0.5 text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            name="star"
            className={`h-3.5 w-3.5 ${
              star <= num ? "fill-amber-400 text-amber-400" : "text-slate-200"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-slate-900">
            Daftar Ulasan
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            Moderasi dan kelola ulasan pengguna sebelum ditampilkan ke publik.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchReviews}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs disabled:opacity-50"
            title="Refresh Ulasan"
          >
            <Icon
              name="refresh"
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>Refresh Data</span>
          </button>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 border border-amber-200">
            <Icon name="info" className="h-3.5 w-3.5" />
            Review Service Ready
          </span>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div
          className={`rounded-2xl p-4 text-xs sm:text-sm font-medium border flex items-center justify-between shadow-xs transition-all animate-fadeIn ${
            notification.type === "success"
              ? "bg-emerald-50 text-emerald-900 border-emerald-200"
              : notification.type === "warning"
              ? "bg-amber-50 text-amber-900 border-amber-200"
              : "bg-rose-50 text-rose-900 border-rose-200"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`rounded-lg p-1.5 ${
                notification.type === "success"
                  ? "bg-emerald-100 text-emerald-800"
                  : notification.type === "warning"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-rose-100 text-rose-800"
              }`}
            >
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

      {/* Error State Banner */}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-900 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-rose-100 p-2.5 text-rose-700">
              <Icon name="info" className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold">
                Gagal Memuat Data Ulasan
              </p>
              <p className="text-xs text-rose-700">{error}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={fetchReviews}
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 transition-colors"
          >
            <Icon name="refresh" className="h-3.5 w-3.5" />
            Coba Lagi
          </button>
        </div>
      )}

      {/* Backend Integration Readiness Banner */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-amber-900 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-amber-100 p-2.5 text-amber-700">
            <Icon name="info" className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-semibold">
              Persiapan Integrasi Review Service Backend
            </p>
            <p className="text-xs text-amber-700">
              Public API Open Library tidak menyediakan endpoint ulasan pengguna. Halaman ini telah disiapkan dengan tabel modern, pencarian, filter rating & status, pagination, modal detail, serta modal hapus yang siap langsung terhubung ke Review Service backend.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center rounded-full bg-amber-200/90 px-3 py-1 text-[11px] font-bold text-amber-900 uppercase tracking-wider">
          Available after Backend Integration
        </span>
      </div>

      {/* Summary Statistics Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-4">
        {/* Card 1: Total Ulasan */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center gap-4">
          <div className="rounded-xl bg-amber-50 p-3 text-amber-600 border border-amber-100">
            <Icon name="star" className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Total Ulasan
            </p>
            <h3 className="font-playfair text-2xl font-bold text-slate-900 mt-0.5">
              {totalReviewsCount}
            </h3>
          </div>
        </div>

        {/* Card 2: Rating Rata-rata */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center gap-4">
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600 border border-blue-100">
            <Icon name="star" className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Rata-rata Rating
            </p>
            <h3 className="font-playfair text-2xl font-bold text-slate-900 mt-0.5">
              {avgRatingScore} ★
            </h3>
          </div>
        </div>

        {/* Card 3: Disetujui */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center gap-4">
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 border border-emerald-100">
            <Icon name="check" className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Disetujui
            </p>
            <h3 className="font-playfair text-2xl font-bold text-slate-900 mt-0.5">
              {approvedReviewsCount}
            </h3>
          </div>
        </div>

        {/* Card 4: Menunggu Moderasi */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center gap-4">
          <div className="rounded-xl bg-orange-50 p-3 text-orange-600 border border-orange-100">
            <Icon name="clock" className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Menunggu Moderasi
            </p>
            <h3 className="font-playfair text-2xl font-bold text-slate-900 mt-0.5">
              {pendingReviewsCount}
            </h3>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Filters */}
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
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari ulasan, buku, atau nama..."
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

          {/* Filter Rating Dropdown */}
          <div>
            <select
              value={selectedRating}
              onChange={(e) => {
                setSelectedRating(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            >
              <option value="Semua">Semua Rating</option>
              <option value="5">5 Bintang (Sangat Baik)</option>
              <option value="4">4 Bintang (Baik)</option>
              <option value="3">3 Bintang (Cukup)</option>
              <option value="2">2 Bintang (Kurang)</option>
              <option value="1">1 Bintang (Sangat Kurang)</option>
            </select>
          </div>

          {/* Filter Status Dropdown */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            >
              <option value="Semua">Semua Status</option>
              <option value="Disetujui">Disetujui (Approved)</option>
              <option value="Menunggu">Menunggu (Pending)</option>
              <option value="Ditolak">Ditolak (Rejected)</option>
            </select>
          </div>
        </div>

        {/* Reset Active Filters */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-500">
              Menampilkan filter ulasan aktif
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

      {/* Loading State View */}
      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 shadow-sm text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600 animate-spin">
            <Icon name="refresh" className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-slate-700">
            Memuat data ulasan...
          </p>
          <p className="text-xs text-slate-400">
            Menghubungkan ke Review Service endpoint
          </p>
        </div>
      ) : reviews.length > 0 ? (
        filteredReviews.length > 0 ? (
          /* Main Table Structure */
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold">Buku</th>
                    <th className="px-5 py-3.5 font-semibold">Pengguna</th>
                    <th className="px-5 py-3.5 font-semibold">Rating</th>
                    <th className="px-5 py-3.5 font-semibold">Komentar / Ulasan</th>
                    <th className="px-5 py-3.5 font-semibold">Status</th>
                    <th className="px-5 py-3.5 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedReviews.map((review) => {
                    const initials = review.user
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((n) => n[0].toUpperCase())
                      .join("") || "U";
                    const isApproved =
                      review.status === "Disetujui" || review.status === "Approved";
                    const isRejected =
                      review.status === "Ditolak" || review.status === "Rejected";

                    return (
                      <tr
                        key={review.id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        {/* Buku */}
                        <td className="px-5 py-3.5 font-semibold text-slate-900 max-w-[180px]">
                          <div className="truncate" title={review.book}>
                            {review.book}
                          </div>
                          {review.bookAuthor && (
                            <div className="text-xs text-slate-400 font-normal truncate">
                              {review.bookAuthor}
                            </div>
                          )}
                        </td>

                        {/* Pengguna */}
                        <td className="px-5 py-3.5 text-slate-700">
                          <div className="flex items-center gap-2.5">
                            {review.userAvatar ? (
                              <img
                                src={review.userAvatar}
                                alt={review.user}
                                className="h-7 w-7 rounded-full object-cover border border-slate-200"
                              />
                            ) : (
                              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-white shadow-2xs">
                                {initials}
                              </div>
                            )}
                            <span className="font-semibold text-slate-900 text-xs sm:text-sm">
                              {review.user}
                            </span>
                          </div>
                        </td>

                        {/* Rating */}
                        <td className="px-5 py-3.5">
                          <div className="space-y-0.5">
                            {renderStars(review.rating)}
                            <span className="text-[11px] font-semibold text-slate-500">
                              {review.rating}/5
                            </span>
                          </div>
                        </td>

                        {/* Komentar */}
                        <td className="px-5 py-3.5 text-slate-600 max-w-xs">
                          <p className="line-clamp-2 text-xs leading-relaxed italic font-serif">
                            &ldquo;{review.comment}&rdquo;
                          </p>
                        </td>

                        {/* Status Badge */}
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold border ${
                              isApproved
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : isRejected
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : "bg-orange-50 text-orange-700 border-orange-200"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                isApproved
                                  ? "bg-emerald-500"
                                  : isRejected
                                  ? "bg-rose-500"
                                  : "bg-orange-500"
                              }`}
                            />
                            {review.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3.5 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            {/* View Detail Button */}
                            <button
                              type="button"
                              onClick={() => setSelectedDetailReview(review)}
                              className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors border border-slate-200"
                              title="Lihat Detail Ulasan"
                            >
                              <Icon name="eye" className="h-3.5 w-3.5" />
                            </button>

                            {/* Delete Review Button */}
                            <button
                              type="button"
                              onClick={() => setDeletingReview(review)}
                              className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors border border-rose-200"
                              title="Hapus Ulasan"
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
              totalItems={filteredReviews.length}
              itemsPerPage={itemsPerPage}
            />
          </div>
        ) : (
          /* Empty Search / Filter Results */
          <EmptyState
            icon="search"
            title="Tidak Ada Ulasan Ditemukan"
            description="Tidak ada ulasan yang sesuai dengan kata kunci atau filter yang Anda pilih."
            action={true}
            actionLabel="Reset Filter"
            onAction={handleResetFilters}
          />
        )
      ) : (
        /* Empty State View explaining Backend Review Service dependency */
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center space-y-6">
          {/* Table Header Preview Structure */}
          <div className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50/50 opacity-60">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-xs uppercase tracking-wide text-slate-400">
                <thead className="border-b border-slate-200 bg-slate-100/80">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Buku</th>
                    <th className="px-5 py-3 font-semibold">Pengguna</th>
                    <th className="px-5 py-3 font-semibold">Rating</th>
                    <th className="px-5 py-3 font-semibold">Komentar / Ulasan</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
              </table>
            </div>
          </div>

          <EmptyState
            icon="star"
            title="Fitur Manajemen Ulasan Akan Tersedia Setelah Backend Review Service Selesai Dibuat"
            description="Karena Public API Open Library tidak menyediakan endpoint atau data ulasan pengguna, fitur ini disiapkan dengan struktur tabel modern, pencarian, filter rating & status, pagination, modal detail, dan modal hapus ulasan yang siap terhubung secara langsung saat Review Service backend diimplementasikan."
          />

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 border border-slate-200">
              <Icon name="search" className="h-3.5 w-3.5" />
              Pencarian Ulasan Siap
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 border border-slate-200">
              <Icon name="filter" className="h-3.5 w-3.5" />
              Filter Rating & Status Siap
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 border border-slate-200">
              <Icon name="eye" className="h-3.5 w-3.5" />
              Modal Detail Ulasan Siap
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 border border-slate-200">
              <Icon name="trash" className="h-3.5 w-3.5" />
              Aksi Hapus & Moderasi Siap
            </span>
          </div>
        </div>
      )}

      {/* View Detail Review Modal */}
      <AdminReviewDetailModal
        isOpen={Boolean(selectedDetailReview)}
        onClose={() => setSelectedDetailReview(null)}
        review={selectedDetailReview}
        onDelete={(rev) => setDeletingReview(rev)}
        onModerateStatus={handleModerateStatus}
      />

      {/* Delete Review Confirmation Modal */}
      <AdminReviewDeleteModal
        isOpen={Boolean(deletingReview)}
        onClose={() => setDeletingReview(null)}
        onConfirm={handleConfirmDelete}
        review={deletingReview}
      />
    </div>
  );
}
