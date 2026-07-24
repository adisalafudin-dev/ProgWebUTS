/**
 * dashboardService.js
 *
 * Aggregator service untuk Admin Dashboard Perpustakaan.
 *
 * Sumber data: Open Library Public API melalui fetchOpenLibraryBooks —
 * query yang digunakan SAMA dengan yang dipakai App.jsx (default fetch tanpa filter),
 * sehingga data Dashboard konsisten dengan data yang dilihat pengguna di halaman USER.
 *
 * Buku di-fetch sekali lalu diolah secara lokal (sort, filter) di tiap fungsi.
 *
 * Migrasi ke NestJS:
 *   Ganti body setiap fungsi di bawah dengan pemanggilan axios ke endpoint NestJS.
 *   Struktur return value tidak perlu berubah selama shape datanya sama.
 */

import { fetchOpenLibraryBooks } from "./openLibraryApi";

// ── Konstanta ─────────────────────────────────────────────────────────────────

/** Key localStorage untuk riwayat pencarian admin */
export const SEARCH_HISTORY_KEY = "lib_admin_search_history";

/** Jumlah maksimum riwayat yang disimpan */
const MAX_HISTORY = 10;

/**
 * Query default yang SAMA dengan yang digunakan App.jsx (fetchData tanpa filter).
 * Menghasilkan buku yang sama persis dengan yang ditampilkan di halaman USER.
 */
const DEFAULT_QUERY = {};

// ── Internal Cache ────────────────────────────────────────────────────────────
// Hindari multiple request ke Open Library dalam satu sesi dashboard.
let _cachedBooks = null;
let _cacheTime = 0;
let _cachePromise = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 menit

/**
 * Ambil semua buku dari Open Library dengan query default (sama seperti USER pages).
 * Hasil di-cache selama 5 menit untuk efisiensi.
 * @returns {Promise<import('../utils/bookFormatter').FormattedBook[]>}
 */
const fetchDefaultBooks = async () => {
  const now = Date.now();
  if (_cachedBooks && now - _cacheTime < CACHE_TTL_MS) {
    return _cachedBooks;
  }

  // The dashboard cards request data in parallel; share one identical request
  // so every card is derived from the same user-catalogue dataset.
  if (!_cachePromise) {
    _cachePromise = fetchOpenLibraryBooks(DEFAULT_QUERY)
      .then((books) => {
        _cachedBooks = books;
        _cacheTime = Date.now();
        return books;
      })
      .finally(() => {
        _cachePromise = null;
      });
  }

  return _cachePromise;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Normalise satu buku ke shape konsisten yang dipakai Dashboard.
 * Shape mengikuti hasil formatOpenLibraryBook persis (sama seperti USER).
 * @param {object} book
 * @returns {DashboardBook}
 */
const normalizeBook = (book) => ({
  id: book.id || book.key || "",
  key: book.key || book.id || "",
  title: book.title || "Judul tidak tersedia",
  author: book.author || "Penulis tidak diketahui",
  genre: book.genre || "Fiction",
  genres: Array.isArray(book.genres) ? book.genres : [],
  tags: Array.isArray(book.tags) ? book.tags : [],
  year: book.year ?? "-",
  rating: typeof book.rating === "number" ? book.rating : 0,
  pages: book.pages || "-",
  synopsis: book.synopsis || "",
  available: book.available === true,
  featured: book.featured === true,
  cover: book.cover || "",
});

const getCategoriesFromBooks = (books) => {
  const counts = new Map();

  books.forEach((book) => {
    const categories = book.subjects?.length ? book.subjects : [book.genre];
    [...new Set(categories.filter(Boolean))].forEach((name) => {
      counts.set(name, (counts.get(name) || 0) + 1);
    });
  });

  return [...counts.entries()]
    .map(([name, bookCount]) => ({
      id: `subject-${name.toLowerCase().replace(/[^\w]+/g, "-")}`,
      name,
      bookCount,
      slug: name.toLowerCase().replace(/[^\w]+/g, "-"),
    }))
    .sort((a, b) => b.bookCount - a.bookCount || a.name.localeCompare(b.name));
};

// ── Public API ─────────────────────────────────────────────────────────────────

/**
 * Ambil buku terbaru — diurutkan berdasarkan tahun terbit terbaru.
 * Menggunakan data yang sama dengan halaman USER (query default).
 * @param {number} limit
 * @returns {Promise<DashboardBook[]>}
 */
export const getRecentBooks = async (limit = 8) => {
  const books = await fetchDefaultBooks();
  return [...books]
    .filter((b) => b.year && b.year !== "-" && Number(b.year) > 1800)
    .sort((a, b) => Number(b.year) - Number(a.year))
    .slice(0, limit)
    .map(normalizeBook);
};

/**
 * Ambil buku populer — diurutkan berdasarkan rating tertinggi.
 * Menggunakan data yang sama dengan halaman USER (query default).
 * @param {number} limit
 * @returns {Promise<DashboardBook[]>}
 */
export const getPopularBooks = async (limit = 8) => {
  const books = await fetchDefaultBooks();
  return [...books]
    .filter((b) => typeof b.rating === "number" && b.rating > 0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
    .map(normalizeBook);
};

/**
 * Ambil kategori populer berdasarkan bookCount terbanyak.
 * @param {number} limit
 * @returns {Promise<DashboardCategory[]>}
 */
export const getPopularCategories = async (limit = 10) => {
  const books = await fetchDefaultBooks();
  return getCategoriesFromBooks(books).slice(0, limit);
};

/**
 * Hitung statistik ringkasan dashboard dari data yang sama dengan USER.
 * @returns {Promise<DashboardStats>}
 */
export const getDashboardStats = async () => {
  const books = await fetchDefaultBooks();
  const categories = getCategoriesFromBooks(books);

  const ratedBooks = books.filter(
    (b) => typeof b.rating === "number" && b.rating > 0
  );
  const topRating =
    ratedBooks.length > 0
      ? Math.max(...ratedBooks.map((b) => b.rating)).toFixed(1)
      : "0.0";

  const yearsValid = books
    .map((b) => Number(b.year))
    .filter((y) => !isNaN(y) && y > 1800);
  const latestYear = yearsValid.length > 0 ? Math.max(...yearsValid) : "-";

  return {
    // Total buku = semua buku dari fetch default (sama seperti yang dilihat USER)
    totalBooks: books.length,
    // Total kategori dari categoryService
    totalCategories: categories.length,
    // Total hasil = jumlah buku yang berhasil di-fetch
    totalSearchResults: books.length,
    // Total ditampilkan = buku yang available (sama dengan filter USER)
    totalDisplayed: books.filter((b) => b.available === true).length,
    topRating: parseFloat(topRating),
    latestYear,
  };
};

// ── localStorage Search History ───────────────────────────────────────────────

/**
 * Simpan satu entri riwayat pencarian admin ke localStorage.
 * @param {string} query       Kata kunci pencarian
 * @param {number} resultCount Jumlah hasil ditemukan
 */
export const saveSearchHistory = (query, resultCount) => {
  if (!query || typeof window === "undefined") return;
  try {
    const existing = getSearchHistory();
    const entry = {
      id: `sh-${Date.now()}`,
      query: query.trim(),
      resultCount,
      timestamp: new Date().toISOString(),
    };
    const updated = [
      entry,
      ...existing.filter((e) => e.query !== entry.query),
    ].slice(0, MAX_HISTORY);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
  } catch {
    /* localStorage mungkin tidak tersedia */
  }
};

/**
 * Ambil riwayat pencarian admin dari localStorage.
 * @returns {SearchHistoryEntry[]}
 */
export const getSearchHistory = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/**
 * Hapus semua riwayat pencarian admin.
 */
export const clearSearchHistory = () => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
    // Invalidate cache agar stats terupdate saat refresh
    _cachedBooks = null;
  } catch {
    /* noop */
  }
};

/**
 * Invalidate cache manual (misal: setelah logout atau refresh paksa).
 */
export const invalidateDashboardCache = () => {
  _cachedBooks = null;
  _cacheTime = 0;
  _cachePromise = null;
};
