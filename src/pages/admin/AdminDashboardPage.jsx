import React from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Users,
  Tag,
  MessageSquare,
  Heart,
  Plus,
  FolderPlus,
  UserPlus,
  BarChart3,
  Clock,
  Star,
  ArrowUpRight,
  Activity,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  Zap,
  AlertTriangle,
  RefreshCw,
  InboxIcon,
} from "lucide-react";
import { useDashboardData } from "../../hooks/useDashboardData";

// ── Icon Map (untuk stat widgets dari hook) ───────────────────────────────────
const ICON_MAP = { BookOpen, Users, Tag, MessageSquare, Heart };

// ── Static Data (tidak bergantung API) ────────────────────────────────────────

const quickActions = [
  {
    label: "Tambah Buku",
    description: "Input judul & detail buku baru",
    href: "/admin/books",
    icon: Plus,
    iconBg: "bg-blue-100 text-blue-700",
  },
  {
    label: "Kelola Kategori",
    description: "Atur taksonomi & genre",
    href: "/admin/categories",
    icon: FolderPlus,
    iconBg: "bg-emerald-100 text-emerald-700",
  },
  {
    label: "Kelola Pengguna",
    description: "Atur hak akses & perizinan",
    href: "/admin/users",
    icon: UserPlus,
    iconBg: "bg-violet-100 text-violet-700",
  },
  {
    label: "Lihat Laporan",
    description: "Analisis statistik perpustakaan",
    href: "/admin/analytics",
    icon: BarChart3,
    iconBg: "bg-amber-100 text-amber-700",
  },
];

// ── Helper Components ─────────────────────────────────────────────────────────

function RatingStars({ value }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3.5 w-3.5 ${
            star <= Math.round(value)
              ? "fill-amber-400 text-amber-400"
              : "fill-slate-100 text-slate-300"
          }`}
        />
      ))}
      <span className="ml-1 text-xs font-semibold text-slate-700">
        {Number(value).toFixed(1)}
      </span>
    </div>
  );
}

// ── Skeleton Components ───────────────────────────────────────────────────────

function SkeletonPulse({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded bg-slate-200 ${className}`}
      aria-hidden="true"
    />
  );
}

function StatCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <SkeletonPulse className="h-11 w-11 rounded-xl" />
        <SkeletonPulse className="h-5 w-16 rounded-full" />
      </div>
      <div className="mt-4 space-y-2">
        <SkeletonPulse className="h-3 w-20" />
        <SkeletonPulse className="h-7 w-14" />
      </div>
    </div>
  );
}

function BookRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-3.5 px-2">
      <SkeletonPulse className="h-16 w-11 flex-shrink-0 rounded-lg" />
      <div className="flex-1 space-y-2">
        <SkeletonPulse className="h-4 w-3/4" />
        <SkeletonPulse className="h-3 w-1/2" />
        <div className="flex gap-2">
          <SkeletonPulse className="h-4 w-16 rounded-md" />
          <SkeletonPulse className="h-4 w-20 rounded-md" />
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <SkeletonPulse className="h-5 w-14 rounded-full" />
        <SkeletonPulse className="h-3 w-16" />
      </div>
    </div>
  );
}

function UserRowSkeleton() {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <div className="flex items-center gap-3">
        <SkeletonPulse className="h-10 w-10 rounded-full" />
        <div className="space-y-1.5">
          <SkeletonPulse className="h-3.5 w-28" />
          <SkeletonPulse className="h-3 w-36" />
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <SkeletonPulse className="h-4 w-12 rounded-full" />
        <SkeletonPulse className="h-3 w-16" />
      </div>
    </div>
  );
}

function ReviewCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SkeletonPulse className="h-7 w-7 rounded-full" />
          <SkeletonPulse className="h-3.5 w-24" />
        </div>
        <SkeletonPulse className="h-4 w-20 rounded-md" />
      </div>
      <SkeletonPulse className="h-3 w-32" />
      <SkeletonPulse className="h-3 w-full" />
      <SkeletonPulse className="h-3 w-4/5" />
    </div>
  );
}

// ── Loading State ─────────────────────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="space-y-8 pb-10" aria-label="Memuat dashboard…" aria-busy="true">
      {/* Stats Skeleton */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <SkeletonPulse className="h-6 w-48" />
          <SkeletonPulse className="h-4 w-28" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      </section>

      {/* Row 1 Skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="space-y-2">
              <SkeletonPulse className="h-5 w-32" />
              <SkeletonPulse className="h-3 w-40" />
            </div>
          </div>
          <div className="mt-4 divide-y divide-slate-100">
            {Array.from({ length: 4 }).map((_, i) => (
              <BookRowSkeleton key={i} />
            ))}
          </div>
        </section>
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4 space-y-2">
            <SkeletonPulse className="h-5 w-36" />
            <SkeletonPulse className="h-3 w-44" />
          </div>
          <div className="mt-5 space-y-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3.5">
                <SkeletonPulse className="h-8 w-8 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-1.5 pt-0.5">
                  <SkeletonPulse className="h-3 w-32" />
                  <SkeletonPulse className="h-3 w-full" />
                  <SkeletonPulse className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Row 2 Skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4 space-y-2">
            <SkeletonPulse className="h-5 w-32" />
            <SkeletonPulse className="h-3 w-40" />
          </div>
          <div className="mt-4 divide-y divide-slate-100">
            {Array.from({ length: 4 }).map((_, i) => (
              <UserRowSkeleton key={i} />
            ))}
          </div>
        </section>
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4 space-y-2">
            <SkeletonPulse className="h-5 w-32" />
            <SkeletonPulse className="h-3 w-40" />
          </div>
          <div className="mt-4 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <ReviewCardSkeleton key={i} />
            ))}
          </div>
        </section>
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4 space-y-2">
            <SkeletonPulse className="h-5 w-32" />
            <SkeletonPulse className="h-3 w-40" />
          </div>
          <div className="mt-4 space-y-2.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonPulse key={i} className="h-[64px] w-full rounded-xl" />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// ── Error State ───────────────────────────────────────────────────────────────

function DashboardError({ message, onRetry }) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50/50 p-10 text-center space-y-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
        <AlertTriangle className="h-7 w-7 text-red-500" />
      </div>
      <div className="space-y-1">
        <h2 className="text-base font-bold text-red-700">Gagal Memuat Dashboard</h2>
        <p className="max-w-xs text-sm text-red-500">{message || "Terjadi kesalahan saat mengambil data."}</p>
      </div>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-red-700 active:scale-95"
      >
        <RefreshCw className="h-4 w-4" />
        Coba Lagi
      </button>
    </div>
  );
}

// ── Empty State (per-section) ─────────────────────────────────────────────────

function EmptyState({ icon: Icon, message }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
      <InboxIcon className="h-8 w-8 text-slate-300" />
      <p className="text-sm text-slate-400">{message || "Belum ada data."}</p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const { data, loading, error, refetch } = useDashboardData();

  // ── Loading State ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-8 pb-10">
        {/* Welcome Banner tetap ditampilkan saat loading */}
        <WelcomeBanner />
        <DashboardSkeleton />
      </div>
    );
  }

  // ── Error State ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="space-y-8 pb-10">
        <WelcomeBanner />
        <DashboardError message={error} onRetry={refetch} />
      </div>
    );
  }

  const { stats = [], recentBooks = [], recentUsers = [], recentReviews = [] } = data || {};

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8 pb-10">

      {/* ══ Welcome Banner ══════════════════════════════ */}
      <WelcomeBanner />

      {/* ══ 5 Stat Widgets ══════════════════════════════ */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <BarChart3 className="h-5 w-5 text-indigo-600" />
            Ringkasan Statistik
          </h2>
          <span className="text-xs font-medium text-slate-400">
            Dihitung dari data aktual
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {stats.length === 0 ? (
            <div className="col-span-full">
              <EmptyState message="Tidak ada data statistik tersedia." />
            </div>
          ) : (
            stats.map((s) => {
              const Ico = ICON_MAP[s.icon] || BookOpen;
              return (
                <div
                  key={s.id}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  {/* subtle gradient blob */}
                  <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-slate-50 blur-2xl" />

                  <div className="relative flex items-start justify-between">
                    <span
                      className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border ${s.iconBg} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Ico className="h-5 w-5" />
                    </span>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${s.changeBg}`}>
                      <TrendingUp className="h-3 w-3" />
                      {s.change}
                    </span>
                  </div>

                  <div className="relative mt-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      {s.label}
                    </p>
                    <p className="mt-1 font-playfair text-2xl font-bold text-slate-900">
                      {s.value}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* ══ Row 1: Recent Books + Activity Timeline ════ */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Recent Books (2 cols) */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Recent Books
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Buku dari Open Library API
              </p>
            </div>
            <Link
              to="/admin/books"
              className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
            >
              Lihat Semua <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {recentBooks.length === 0 ? (
              <EmptyState message="Tidak ada buku yang tersedia saat ini." />
            ) : (
              recentBooks.map((book) => (
                <div
                  key={book.id}
                  className="flex flex-col gap-3 py-3.5 first:pt-0 last:pb-0 hover:bg-slate-50/70 sm:flex-row sm:items-center sm:justify-between rounded-xl px-2 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="h-16 w-11 flex-shrink-0 rounded-lg border border-slate-200 object-cover shadow-sm"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/44x64/e2e8f0/94a3b8?text=?";
                      }}
                    />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">
                        {book.title}
                      </p>
                      <p className="truncate text-xs text-slate-500 mt-0.5">
                        oleh{" "}
                        <span className="font-medium text-slate-700">
                          {book.author}
                        </span>
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        <span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                          {book.category}
                        </span>
                        <RatingStars value={book.rating} />
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center justify-between sm:flex-col sm:items-end gap-1">
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                      Stok: {book.stock}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="h-3 w-3" /> Open Library
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Activity Timeline (1 col) — Tetap static (tidak ada API khusus aktivitas) */}
        <ActivityTimelineSection recentBooks={recentBooks} recentUsers={recentUsers} />
      </div>

      {/* ══ Row 2: Recent Users + Recent Reviews + Quick Actions ══ */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Recent Users */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <Users className="h-5 w-5 text-violet-600" />
                Recent Users
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Pengguna yang terdaftar
              </p>
            </div>
            <Link
              to="/admin/users"
              className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-violet-600 hover:bg-violet-50 transition-colors"
            >
              Kelola <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {recentUsers.length === 0 ? (
              <EmptyState message="Belum ada pengguna terdaftar." />
            ) : (
              recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <span
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${user.color}`}
                      >
                        {user.initials}
                      </span>
                      <span
                        className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${
                          user.status === "Online"
                            ? "bg-emerald-500"
                            : "bg-slate-300"
                        }`}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        user.role === "Admin"
                          ? "bg-purple-50 text-purple-700 border border-purple-200"
                          : "border border-slate-200 bg-slate-100 text-slate-600"
                      }`}
                    >
                      {user.role}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {user.joined}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Recent Reviews */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <MessageSquare className="h-5 w-5 text-amber-600" />
              Recent Reviews
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Ulasan terbaru dari pembaca
            </p>
          </div>

          <div className="mt-4 space-y-3">
            {recentReviews.length === 0 ? (
              <EmptyState message="Belum ada ulasan dari pembaca." />
            ) : (
              recentReviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 transition-colors hover:bg-slate-100/60 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
                        {review.initials}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {review.user}
                      </span>
                    </div>
                    <RatingStars value={review.rating} />
                  </div>

                  <p className="text-[11px] text-slate-500">
                    Ulasan untuk{" "}
                    <span className="font-semibold text-indigo-600">
                      {review.book}
                    </span>
                  </p>

                  <p className="line-clamp-2 text-xs italic leading-relaxed text-slate-600">
                    &ldquo;{review.comment}&rdquo;
                  </p>

                  <div className="flex justify-end">
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="h-3 w-3" /> {review.time}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <Zap className="h-5 w-5 text-indigo-600" />
              Quick Actions
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Navigasi cepat ke halaman utama
            </p>
          </div>

          <div className="mt-4 flex-1 space-y-2.5">
            {quickActions.map((action) => {
              const ActionIcon = action.icon;
              return (
                <Link
                  key={action.label}
                  to={action.href}
                  className="group flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5 transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50/40 hover:shadow-sm"
                >
                  <span
                    className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${action.iconBg} transition-transform duration-200 group-hover:scale-110`}
                  >
                    <ActionIcon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 transition-colors group-hover:text-indigo-700">
                      {action.label}
                    </p>
                    <p className="truncate text-[11px] text-slate-500 mt-0.5">
                      {action.description}
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-indigo-600" />
                </Link>
              );
            })}
          </div>

          <div className="mt-5 rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-blue-50 p-3.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0 text-indigo-600" />
              <p className="text-xs font-semibold text-indigo-900">
                Mode Administrator Aktif
              </p>
            </div>
            <p className="mt-0.5 text-[11px] text-indigo-700 leading-relaxed">
              Anda memiliki akses penuh ke semua fitur manajemen.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

/**
 * Welcome Banner — selalu ditampilkan (tidak bergantung data API).
 */
function WelcomeBanner() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
      <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            Admin Control Center
          </span>
          <h1 className="font-playfair text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Selamat Datang di Admin Dashboard
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-slate-300">
            Pantau statistik perpustakaan, kelola buku, pengguna, kategori, ulasan, dan aktivitas terkini dari satu tempat.
          </p>
        </div>

        <div className="shrink-0">
          <span className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-2.5 text-xs font-medium text-slate-200 backdrop-blur-md">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            Sistem Normal
          </span>
        </div>
      </div>
    </section>
  );
}

/**
 * Activity Timeline — dibangun dari data recent books & users yang sudah di-fetch.
 * Tidak perlu endpoint khusus; cukup derivasi dari data yang ada.
 */
function ActivityTimelineSection({ recentBooks, recentUsers }) {
  // Bangun timeline dari data aktual
  const timeline = [
    ...recentBooks.slice(0, 3).map((book, i) => ({
      id: `book-act-${i}`,
      title: "Buku Tersedia di Katalog",
      description: `"${book.title}" oleh ${book.author} tersedia.`,
      icon: BookOpen,
      iconColor: "text-blue-600 bg-blue-50 border-blue-100",
    })),
    ...recentUsers.slice(0, 2).map((user, i) => ({
      id: `user-act-${i}`,
      title: "Pengguna Terdaftar",
      description: `${user.name} (${user.role}) terdaftar di sistem.`,
      icon: Users,
      iconColor: "text-violet-600 bg-violet-50 border-violet-100",
    })),
  ];

  return (
    <section className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
          <Activity className="h-5 w-5 text-indigo-600" />
          Activity Timeline
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Derivasi dari data buku &amp; pengguna
        </p>
      </div>

      <div className="relative mt-5 flex-1">
        {timeline.length === 0 ? (
          <EmptyState message="Belum ada aktivitas tercatat." />
        ) : (
          <>
            {/* vertical line */}
            <span className="absolute left-[15px] top-0 h-full w-px bg-slate-100" />
            <div className="space-y-5">
              {timeline.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <div key={item.id} className="relative flex items-start gap-3.5">
                    <span
                      className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${item.iconColor}`}
                    >
                      <ItemIcon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <p className="text-xs font-semibold text-slate-900">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
