/**
 * useDashboardData
 *
 * Mengambil data untuk Admin Dashboard dari semua service yang ada.
 * Data bersumber dari Public API (Open Library) + Mock Services.
 *
 * Untuk migrasi ke NestJS Microservice:
 *   1. Ganti import fungsi-fungsi API di bawah dengan endpoint NestJS yang sesuai.
 *   2. Sesuaikan struktur response jika berbeda (normalisasi di bagian "Data Extraction").
 *   3. Tidak perlu mengubah hook ini atau komponen yang menggunakannya.
 */

import { useState, useEffect, useCallback } from "react";
import { getBooks } from "../services/bookApi";
import { getCategories } from "../services/categoryApi";
import { getUsers } from "../services/userApi";
import { getReviews } from "../services/reviewApi";
import { getFavorites } from "../services/favoriteApi";
import { fetchOpenLibraryBooks } from "../services/openLibraryApi";

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Menghitung rata-rata rating dari daftar buku.
 * @param {Array} books
 * @returns {string}
 */
const calcAverageRating = (books) => {
  if (!books || books.length === 0) return "0.0";
  const rated = books.filter((b) => typeof b.rating === "number" && b.rating > 0);
  if (rated.length === 0) return "0.0";
  const avg = rated.reduce((sum, b) => sum + b.rating, 0) / rated.length;
  return avg.toFixed(1);
};

/**
 * Menghasilkan inisial dari nama.
 * @param {string} name
 * @returns {string}
 */
const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

/**
 * Palet warna avatar berdasarkan index.
 */
const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-violet-100 text-violet-700",
  "bg-emerald-100 text-emerald-700",
  "bg-rose-100 text-rose-700",
  "bg-amber-100 text-amber-700",
  "bg-indigo-100 text-indigo-700",
];

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useDashboardData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // ── Parallel fetch dari semua service ──────────────────────────────────
      // Setiap Promise.allSettled memastikan satu kegagalan tidak membatalkan semua.
      const [booksRes, categoriesRes, usersRes, reviewsRes, favoritesRes, openLibRes] =
        await Promise.allSettled([
          getBooks({ limit: 30 }),         // Book Service
          getCategories(),                  // Category Service
          getUsers(),                       // User Service
          getReviews(),                     // Review Service
          getFavorites(),                   // Favorite Service
          fetchOpenLibraryBooks({ q: "popular fiction", limit: 10 }), // Public API
        ]);

      // ── Data Extraction ────────────────────────────────────────────────────
      // Normalisasi response — sesuaikan ini jika struktur backend NestJS berbeda.

      const rawBooks =
        booksRes.status === "fulfilled"
          ? Array.isArray(booksRes.value?.data)
            ? booksRes.value.data
            : Array.isArray(booksRes.value)
            ? booksRes.value
            : []
          : [];

      const rawCategories =
        categoriesRes.status === "fulfilled"
          ? Array.isArray(categoriesRes.value)
            ? categoriesRes.value
            : []
          : [];

      const rawUsers =
        usersRes.status === "fulfilled"
          ? Array.isArray(usersRes.value)
            ? usersRes.value
            : []
          : [];

      const rawReviews =
        reviewsRes.status === "fulfilled"
          ? Array.isArray(reviewsRes.value)
            ? reviewsRes.value
            : []
          : [];

      const rawFavorites =
        favoritesRes.status === "fulfilled"
          ? Array.isArray(favoritesRes.value)
            ? favoritesRes.value
            : []
          : [];

      // Open Library books (untuk recent books jika mock books kosong)
      const openLibBooks =
        openLibRes.status === "fulfilled"
          ? Array.isArray(openLibRes.value)
            ? openLibRes.value
            : []
          : [];

      // ── Computed Statistics ────────────────────────────────────────────────
      // Statistik dihitung dari data yang tersedia, bukan hardcoded.

      const allBooksForStats = rawBooks.length > 0 ? rawBooks : openLibBooks;
      const totalBooks = allBooksForStats.length;
      const totalUsers = rawUsers.length;
      const totalCategories = rawCategories.length;
      const totalReviews = rawReviews.length;
      const totalFavorites = rawFavorites.length;
      const avgRating = calcAverageRating(allBooksForStats);
      const availableBooks = allBooksForStats.filter((b) => b.available !== false).length;
      const featuredBooks = allBooksForStats.filter((b) => b.featured === true).length;

      // ── Recent Books (maks 4, dari Open Library atau mock) ─────────────────
      const sourceBooks = openLibBooks.length > 0 ? openLibBooks : rawBooks;
      const recentBooks = sourceBooks.slice(0, 4).map((book, idx) => ({
        id: book.id || book.key || `book-${idx}`,
        title: book.title || "Judul tidak tersedia",
        author: book.author || book.author_name || "Penulis tidak diketahui",
        category: book.genre || book.subject?.[0] || rawCategories[idx % rawCategories.length]?.name || "Umum",
        rating: typeof book.rating === "number" ? book.rating : 4.0,
        cover:
          book.cover ||
          (book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
            : `https://placehold.co/44x64/e2e8f0/94a3b8?text=${encodeURIComponent(book.title?.[0] || "?")}` ),
        stock: book.pages ? Math.ceil(book.pages / 20) : 10,
      }));

      // ── Recent Users ───────────────────────────────────────────────────────
      const recentUsers = rawUsers.slice(0, 4).map((user, idx) => ({
        id: user.id || `user-${idx}`,
        name: user.name || user.username || user.email?.split("@")[0] || "Pengguna",
        email: user.email || "-",
        initials: getInitials(user.name || user.email || "U"),
        color: AVATAR_COLORS[idx % AVATAR_COLORS.length],
        role: user.role === "ADMIN" ? "Admin" : "User",
        status: Math.random() > 0.5 ? "Online" : "Offline", // status simulasi; ganti dengan field backend
        joined: "-",
      }));

      // ── Recent Reviews ─────────────────────────────────────────────────────
      const recentReviews = rawReviews.slice(0, 3).map((rev, idx) => ({
        id: rev.id || `rev-${idx}`,
        user: rev.userName || rev.user || rev.userId || "Pengguna",
        initials: getInitials(rev.userName || rev.user || "U"),
        book: rev.bookTitle || rev.book || "Buku",
        rating: typeof rev.rating === "number" ? rev.rating : 4,
        comment: rev.comment || rev.content || rev.text || "Tidak ada komentar.",
        time: rev.createdAt ? new Date(rev.createdAt).toLocaleDateString("id-ID") : "-",
      }));

      // ── Stats Array (untuk Stat Widgets) ──────────────────────────────────
      const stats = [
        {
          id: "books",
          label: "Total Buku",
          value: totalBooks.toLocaleString("id-ID"),
          change: `${availableBooks} tersedia`,
          icon: "BookOpen",
          iconBg: "bg-blue-50 text-blue-600 border-blue-100",
          changeBg: "bg-blue-50 text-blue-700",
        },
        {
          id: "users",
          label: "Total Pengguna",
          value: totalUsers.toLocaleString("id-ID"),
          change: `${rawUsers.filter((u) => u.role === "ADMIN").length} admin`,
          icon: "Users",
          iconBg: "bg-violet-50 text-violet-600 border-violet-100",
          changeBg: "bg-violet-50 text-violet-700",
        },
        {
          id: "categories",
          label: "Total Kategori",
          value: totalCategories.toLocaleString("id-ID"),
          change: `${featuredBooks} unggulan`,
          icon: "Tag",
          iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
          changeBg: "bg-emerald-50 text-emerald-700",
        },
        {
          id: "reviews",
          label: "Total Ulasan",
          value: totalReviews.toLocaleString("id-ID"),
          change: `avg ${avgRating} ★`,
          icon: "MessageSquare",
          iconBg: "bg-amber-50 text-amber-600 border-amber-100",
          changeBg: "bg-amber-50 text-amber-700",
        },
        {
          id: "favorites",
          label: "Total Favorit",
          value: totalFavorites.toLocaleString("id-ID"),
          change: `dari ${totalUsers} pengguna`,
          icon: "Heart",
          iconBg: "bg-rose-50 text-rose-600 border-rose-100",
          changeBg: "bg-rose-50 text-rose-700",
        },
      ];

      setData({ stats, recentBooks, recentUsers, recentReviews });
    } catch (err) {
      setError(err?.message || "Gagal memuat data dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { data, loading, error, refetch: fetchAll };
}
