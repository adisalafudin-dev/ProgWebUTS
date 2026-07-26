import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useFavorites } from "../contexts/FavoriteContext.jsx";

/* ─── helpers ─────────────────────────────────────────────────── */

/**
 * Safely formats a timestamp / date-string.
 * Returns `fallback` when the value is missing or produces an Invalid Date.
 */
function safeFormatDate(value, options = {}, fallback = "Belum tersedia") {
  if (!value) return fallback;
  const d = new Date(value);
  if (isNaN(d.getTime())) return fallback;
  return d.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  });
}

/** Derives up-to-2-character initials from a name or e-mail. */
function getInitials(name, email) {
  const source = name || email || "";
  const words = source
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .map((w) => w[0]?.toUpperCase())
    .filter(Boolean);
  if (words.length >= 2) return words[0] + words[1];
  if (words.length === 1) return words[0];
  return "?";
}

/* ─── sub-components ──────────────────────────────────────────── */

/** Skeleton block that pulses while data is loading */
function SkeletonBlock({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`rounded-md skeleton-shimmer ${className}`}
    />
  );
}

/** Full-page skeleton layout that mirrors the real profile card */
function ProfileSkeleton() {
  return (
    <section
      className="mx-auto min-h-[70vh] max-w-5xl px-4 py-14 sm:px-6 lg:px-8"
      aria-busy="true"
      aria-label="Memuat profil…"
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left – main card */}
        <div className="rounded-xl border border-borderSoft bg-white p-8 shadow-book">
          <SkeletonBlock className="h-3 w-28 mb-6" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
            <SkeletonBlock className="h-20 w-20 rounded-full flex-shrink-0" />
            <div className="space-y-3 flex-1">
              <SkeletonBlock className="h-7 w-48" />
              <SkeletonBlock className="h-4 w-36" />
              <SkeletonBlock className="h-5 w-24 rounded-full" />
            </div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <SkeletonBlock className="h-4 w-4 rounded" />
                <SkeletonBlock className="h-4 w-64" />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-8">
            <SkeletonBlock className="h-10 w-32 rounded-lg" />
            <SkeletonBlock className="h-10 w-36 rounded-lg" />
          </div>
        </div>

        {/* Right – stats card */}
        <div className="rounded-xl border border-borderSoft bg-white p-6 shadow-book">
          <SkeletonBlock className="h-3 w-28 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg bg-cream p-4">
                <SkeletonBlock className="h-3 w-24 mb-2" />
                <SkeletonBlock className="h-7 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Empty / unauthenticated state */
function ProfileEmptyState() {
  return (
    <section
      className="mx-auto min-h-[70vh] max-w-5xl px-4 py-14 sm:px-6 lg:px-8 flex items-center justify-center"
      aria-label="Profil tidak tersedia"
    >
      <div className="rounded-xl border border-borderSoft bg-white p-12 shadow-book text-center max-w-md w-full">
        <div
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
          style={{ background: "rgba(184,137,45,0.10)" }}
          aria-hidden="true"
        >
          <Icon name="user" className="h-10 w-10" style={{ color: "#b8892d" }} />
        </div>
        <h1 className="font-playfair text-2xl font-bold text-textMain mb-3">
          Profil Tidak Aktif
        </h1>
        <p className="text-sm text-textSecondary mb-8 leading-relaxed">
          Anda belum masuk ke akun. Silakan login untuk mengakses profil,
          koleksi favorit, dan pengaturan akun Anda.
        </p>
        <Link
          to="/login"
          className="btn-primary"
          aria-label="Masuk ke akun AksaraHub"
        >
          <Icon name="users" className="h-4 w-4" aria-hidden="true" />
          Masuk Sekarang
        </Link>
      </div>
    </section>
  );
}

/** Role badge chip */
function RoleBadge({ role }) {
  const isAdmin = role === "admin" || role === "ADMIN";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold profile-role-badge ${isAdmin ? "profile-role-badge--admin" : "profile-role-badge--user"}`}
      aria-label={`Role: ${isAdmin ? "Administrator" : "Regular User"}`}
    >
      <Icon
        name={isAdmin ? "shield" : "user"}
        className="h-3 w-3"
        aria-hidden="true"
      />
      {isAdmin ? "Administrator" : "Regular User"}
    </span>
  );
}

/** Status badge chip */
function StatusBadge({ status }) {
  const isActive = !status || status === "active" || status === "ACTIVE";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold profile-status-badge ${isActive ? "profile-status-badge--active" : "profile-status-badge--inactive"}`}
      aria-label={`Status akun: ${isActive ? "Aktif" : "Tidak aktif"}`}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: "currentColor" }}
        aria-hidden="true"
      />
      {isActive ? "Aktif" : "Tidak Aktif"}
    </span>
  );
}

/** Single info row inside the profile card */
function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <Icon
        name={icon}
        className="h-4 w-4 mt-0.5 flex-shrink-0 profile-info-icon"
        aria-hidden="true"
      />
      <div className="min-w-0">
        <span className="font-semibold text-textMain mr-1.5">{label}:</span>
        <span className="text-textSecondary break-words">{value}</span>
      </div>
    </div>
  );
}

/** Stat card used in the right column */
function StatCard({ icon, label, value, to }) {
  const inner = (
    <div className="profile-stat-card rounded-xl p-4 flex items-center gap-4 transition-all duration-200 hover:scale-[1.02]">
      <div
        className="profile-stat-icon-wrap flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
        aria-hidden="true"
      >
        <Icon name={icon} className="h-5 w-5 profile-accent-icon" />
      </div>
      <div className="min-w-0">
        <p className="profile-stat-label text-xs mb-0.5">{label}</p>
        <p className="text-lg font-bold text-textMain leading-tight truncate">
          {value}
        </p>
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block" aria-label={`${label}: ${value}`}>
        {inner}
      </Link>
    );
  }
  return <div aria-label={`${label}: ${value}`}>{inner}</div>;
}

/** "Coming Soon" action button */
function ComingSoonButton({ icon, label, id }) {
  return (
    <button
      id={id}
      type="button"
      disabled
      aria-disabled="true"
      aria-label={`${label} – segera hadir`}
      title="Fitur ini belum tersedia, segera hadir!"
      className="profile-coming-soon-btn inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold
                 cursor-not-allowed opacity-60 select-none"
    >
      <Icon name={icon} className="h-4 w-4" aria-hidden="true" />
      {label}
      <span
        className="profile-coming-soon-badge ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
        aria-hidden="true"
      >
        Segera
      </span>
    </button>
  );
}

/* ─── main component ──────────────────────────────────────────── */

export default function ProfilePage() {
  const { user, authSession, initializing } = useAuth();
  const { favoriteCount } = useFavorites();

  /* ── skeleton while auth is being resolved ── */
  if (initializing) return <ProfileSkeleton />;

  /* ── empty / unauthenticated state ── */
  if (!user) return <ProfileEmptyState />;

  /* ── derive display data from auth state ── */
  const displayName  = user.name  || user.username || "—";
  const displayEmail = user.email || "—";
  const role         = user.role  || "user";
  const status       = user.status;
  const initials     = getInitials(user.name, user.email);

  /*
   * joinedAt  : prefer `user.createdAt` (backend field), fall back to "-".
   * loggedInAt: prefer `user.lastLoginAt`, fall back to `authSession.issuedAt`.
   */
  const joinedAt    = safeFormatDate(user.createdAt || user.created_at);
  const loggedInAt  = safeFormatDate(
    user.lastLoginAt || user.last_login_at || authSession?.issuedAt,
    { hour: "2-digit", minute: "2-digit" },
  );

  return (
    <section
      className="mx-auto min-h-[70vh] max-w-5xl px-4 py-14 sm:px-6 lg:px-8"
      aria-label="Halaman Profil Pengguna"
    >
      {/* Visually hidden page heading for screen readers */}
      <h1 className="sr-only">Profil Pengguna – {displayName}</h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">

        {/* ── Left column: main profile card ─────────────────── */}
        <div
          className="rounded-xl border border-borderSoft bg-white shadow-book overflow-hidden"
          role="region"
          aria-label="Informasi Profil"
        >
          {/* Top accent strip */}
          <div
            className="h-2 w-full"
            style={{
              background:
                "linear-gradient(90deg, #18332f 0%, #b8892d 50%, #7a2e2e 100%)",
            }}
            aria-hidden="true"
          />

          <div className="p-8">
            <p className="section-label mb-6">Profil Pengguna</p>

            {/* ── Avatar + Name ─────────────────────────────── */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
              {/* Avatar: photo (if available) or initials */}
              <div
                className="relative flex-shrink-0"
                aria-label={`Avatar ${displayName}`}
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={`Foto profil ${displayName}`}
                    className="h-20 w-20 rounded-full object-cover"
                    style={{ boxShadow: "0 0 0 4px rgba(184,137,45,0.20)" }}
                  />
                ) : (
                  <div
                    className="h-20 w-20 rounded-full flex items-center justify-center text-2xl font-bold select-none"
                    style={{
                      background: "#18332f",
                      color: "#f6f1e8",
                      boxShadow: "0 0 0 4px rgba(184,137,45,0.20)",
                    }}
                    aria-hidden="true"
                  >
                    {initials}
                  </div>
                )}
              </div>

              {/* Name + email + badges */}
              <div className="flex-1 min-w-0">
                <h2 className="font-playfair text-2xl font-bold text-textMain mb-1 truncate">
                  {displayName}
                </h2>
                <p className="text-sm text-textSecondary mb-3 truncate">
                  {displayEmail}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <RoleBadge role={role} />
                  <StatusBadge status={status} />
                </div>
              </div>
            </div>

            {/* ── Info rows ─────────────────────────────────── */}
            <div className="space-y-3 mb-8">
              <InfoRow icon="user"    label="Nama Lengkap"   value={displayName} />
              <InfoRow icon="globe"   label="Email"          value={displayEmail} />
              <InfoRow icon="shield"  label="Role"           value={role === "admin" || role === "ADMIN" ? "Administrator" : "Regular User"} />
              <InfoRow icon="clock"   label="Login Terakhir" value={loggedInAt} />
              <InfoRow icon="heart"   label="Buku Favorit"   value={`${favoriteCount} buku`} />
            </div>

            {/* ── Action buttons (Coming Soon) ──────────────── */}
            <div
              className="flex flex-wrap gap-3"
              role="group"
              aria-label="Tindakan akun"
            >
              <ComingSoonButton
                id="btn-edit-profile"
                icon="pen"
                label="Edit Profil"
              />
              <ComingSoonButton
                id="btn-change-password"
                icon="settings"
                label="Ubah Password"
              />
            </div>
          </div>
        </div>

        {/* ── Right column: account stats ─────────────────────── */}
        <div
          className="rounded-xl border border-borderSoft bg-white p-6 shadow-book"
          role="region"
          aria-label="Statistik Akun"
        >
          <p className="section-label mb-5">Statistik Akun</p>

          <div className="space-y-3 mb-6">
            <StatCard
              icon="heart"
              label="Buku Favorit"
              value={`${favoriteCount} buku`}
              to="/favorites"
            />
            <StatCard
              icon="clock"
              label="Bergabung Sejak"
              value={joinedAt}
            />
            <StatCard
              icon="userCheck"
              label="Status Akun"
              value={
                !status || status === "active" || status === "ACTIVE"
                  ? "Aktif"
                  : "Tidak Aktif"
              }
            />
          </div>

          {/* ── Quick links ───────────────────────────────────── */}
          <div>
            <p className="section-label mb-3">Akses Cepat</p>
            <nav aria-label="Navigasi cepat profil">
              <ul className="space-y-1">
                {[
                  { to: "/favorites", icon: "heart",    label: "Rak Favorit" },
                  { to: "/library",   icon: "bookOpen", label: "Perpustakaan" },
                  { to: "/settings",  icon: "settings", label: "Pengaturan" },
                ].map(({ to, icon, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-textSecondary
                                 transition-all duration-150 hover:bg-cream hover:text-textMain group"
                      aria-label={label}
                    >
                      <Icon
                        name={icon}
                        className="h-4 w-4 profile-accent-icon transition-colors"
                        aria-hidden="true"
                      />
                      {label}
                      <Icon
                        name="chevronRight"
                        className="h-3.5 w-3.5 ml-auto opacity-0 group-hover:opacity-60 transition-opacity"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
