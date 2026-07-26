/**
 * useDashboardData
 *
 * Hook untuk mengambil semua data yang dibutuhkan Admin Dashboard Perpustakaan.
 * Data bersumber dari Open Library Public API melalui dashboardService.
 *
 * Migrasi ke NestJS:
 *   1. Ganti import fungsi dari dashboardService dengan endpoint NestJS.
 *   2. Sesuaikan normalisasi data di dashboardService.js jika shape berbeda.
 *   3. Hook ini dan komponen yang menggunakannya TIDAK perlu diubah.
 */

import { useState, useEffect, useCallback } from "react";
import {
  getDashboardStats,
  getRecentBooks,
  getPopularBooks,
  getPopularCategories,
  getSearchHistory,
} from "../services/dashboardService";

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Format timestamp ISO menjadi label relatif / lokal.
 * @param {string} iso
 * @returns {string}
 */
const formatTime = (iso) => {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now - d;
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "Baru saja";
    if (diffMin < 60) return `${diffMin} menit lalu`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour} jam lalu`;
    const diffDay = Math.floor(diffHour / 24);
    if (diffDay < 7) return `${diffDay} hari lalu`;
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  } catch {
    return "-";
  }
};

// ── Shape Defaults ─────────────────────────────────────────────────────────────

const DEFAULT_DATA = {
  stats: [],
  recentBooks: [],
  popularBooks: [],
  popularCategories: [],
  recentActivity: [],
};

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useDashboardData() {
  const [data, setData] = useState(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // ── Parallel fetch dari semua service ──────────────────────────────────
      // Promise.allSettled: satu kegagalan tidak membatalkan yang lain.
      const [statsRes, recentRes, popularRes, categoriesRes] =
        await Promise.allSettled([
          getDashboardStats(),
          getRecentBooks(8),
          getPopularBooks(8),
          getPopularCategories(12),
        ]);

      // ── Data Extraction ────────────────────────────────────────────────────
      const statsRaw =
        statsRes.status === "fulfilled" && statsRes.value
          ? statsRes.value
          : {
              totalBooks: 0,
              totalCategories: 0,
              totalSearchResults: 0,
              totalDisplayed: 0,
              topRating: 0,
              latestYear: "-",
            };

      const recentBooks =
        recentRes.status === "fulfilled" && Array.isArray(recentRes.value)
          ? recentRes.value
          : [];

      const popularBooks =
        popularRes.status === "fulfilled" && Array.isArray(popularRes.value)
          ? popularRes.value
          : [];

      const popularCategories =
        categoriesRes.status === "fulfilled" &&
        Array.isArray(categoriesRes.value)
          ? categoriesRes.value
          : [];

      // ── Aktivitas Terakhir (dari localStorage) ─────────────────────────────
      // Ini adalah riwayat pencarian yang dilakukan admin di halaman Buku.
      // Tidak memerlukan endpoint backend — tersimpan di browser lokal.
      const rawHistory = getSearchHistory();
      const recentActivity = rawHistory.slice(0, 8).map((entry) => ({
        id: entry.id || `act-${entry.timestamp}`,
        query: entry.query || "Pencarian tidak diketahui",
        resultCount:
          typeof entry.resultCount === "number" ? entry.resultCount : 0,
        timeLabel: formatTime(entry.timestamp),
        timestamp: entry.timestamp,
      }));

      // ── Stats Array (untuk Stat Cards) ────────────────────────────────────
      // Semua data bersumber dari fetch default yang sama dengan halaman USER.
      const stats = [
        {
          id: "total-books",
          label: "Total Buku",
          value: statsRaw.totalBooks.toLocaleString("id-ID"),
          sub: "Koleksi Open Library",
          icon: "BookOpen",
          accent: "blue",
        },
        {
          id: "total-categories",
          label: "Total Kategori",
          value: statsRaw.totalCategories.toLocaleString("id-ID"),
          sub: "Genre tersedia",
          icon: "Tag",
          accent: "emerald",
        },
        {
          id: "latest-year",
          label: "Buku Terbaru",
          value: String(statsRaw.latestYear),
          sub: "Tahun terbit tertinggi",
          icon: "CalendarDays",
          accent: "violet",
        },
        {
          id: "top-rating",
          label: "Rating Tertinggi",
          value: statsRaw.topRating > 0 ? `${statsRaw.topRating} ★` : "N/A",
          sub: "Dari koleksi tersedia",
          icon: "Star",
          accent: "amber",
        },
        {
          id: "search-results",
          label: "Hasil Pencarian",
          value: statsRaw.totalSearchResults.toLocaleString("id-ID"),
          sub: "Buku ditemukan",
          icon: "Search",
          accent: "indigo",
        },
        {
          id: "displayed-books",
          label: "Buku Tersedia",
          value: statsRaw.totalDisplayed.toLocaleString("id-ID"),
          sub: "Status: Available",
          icon: "Library",
          accent: "rose",
        },
      ];

      setData({ stats, recentBooks, popularBooks, popularCategories, recentActivity });
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
