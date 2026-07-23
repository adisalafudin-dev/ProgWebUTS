import Icon from "../../components/Icon";

// ── Mock Data ──────────────────────────────────────────
const stats = [
  {
    label: "Total Buku",
    value: "128",
    icon: "bookOpen",
    tone: "bg-blue-50 text-blue-700",
  },
  {
    label: "Total Pengguna",
    value: "56",
    icon: "users",
    tone: "bg-violet-50 text-violet-700",
  },
  {
    label: "Total Kategori",
    value: "12",
    icon: "tag",
    tone: "bg-emerald-50 text-emerald-700",
  },
  {
    label: "Total Ulasan",
    value: "342",
    icon: "star",
    tone: "bg-amber-50 text-amber-700",
  },
];

const popularBooks = [
  {
    id: 1,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    rating: 4.7,
    cover: "https://covers.openlibrary.org/b/id/8231856-L.jpg",
  },
  {
    id: 2,
    title: "Frankenstein",
    author: "Mary Shelley",
    rating: 4.5,
    cover: "https://covers.openlibrary.org/b/id/8305841-L.jpg",
  },
  {
    id: 3,
    title: "Nineteen Eighty-Four",
    author: "George Orwell",
    rating: 4.8,
    cover: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
  },
  {
    id: 4,
    title: "The Hobbit",
    author: "J. R. R. Tolkien",
    rating: 4.6,
    cover: "https://covers.openlibrary.org/b/id/6979861-L.jpg",
  },
];

const recentUsers = [
  {
    name: "Budi Santoso",
    email: "budi@example.com",
    joined: "2 jam lalu",
    role: "USER",
  },
  {
    name: "Siti Rahma",
    email: "siti@example.com",
    joined: "5 jam lalu",
    role: "USER",
  },
  {
    name: "Demo Reader",
    email: "demo@aksarahub.local",
    joined: "Kemarin",
    role: "USER",
  },
];

const recentReviews = [
  {
    user: "Budi Santoso",
    book: "Pride and Prejudice",
    rating: 5,
    text: "Karya yang luar biasa abadi. Sangat saya rekomendasikan!",
  },
  {
    user: "Siti Rahma",
    book: "The Hobbit",
    rating: 4,
    text: "Petualangan yang seru dan mengasyikkan dari awal hingga akhir.",
  },
  {
    user: "Demo Reader",
    book: "Frankenstein",
    rating: 4,
    text: "Cerita yang mendalam dan penuh makna tentang penciptaan.",
  },
];

const quickActions = [
  {
    label: "Tambah Buku",
    icon: "bookOpen",
    href: "/admin/books",
    tone: "bg-blue-50 text-blue-700 hover:bg-blue-100",
  },
  {
    label: "Kelola Kategori",
    icon: "tag",
    href: "/admin/categories",
    tone: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
  },
  {
    label: "Kelola Pengguna",
    icon: "users",
    href: "/admin/users",
    tone: "bg-violet-50 text-violet-700 hover:bg-violet-100",
  },
  {
    label: "Lihat Laporan",
    icon: "database",
    href: "/admin/analytics",
    tone: "bg-amber-50 text-amber-700 hover:bg-amber-100",
  },
];

function RatingStars({ value }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`h-3.5 w-3.5 ${star <= Math.round(value) ? "text-amber-400" : "text-slate-200"}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="m12 2 2.9 6.4 7 .8-5.2 4.7 1.4 6.9-6.1-3.5-6.1 3.5 1.4-6.9L2.1 9.2l7-.8L12 2Z" />
        </svg>
      ))}
      <span className="ml-1 text-xs font-semibold text-slate-600">{value}</span>
    </span>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* ── Welcome / Ringkasan ── */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">
          Ringkasan
        </p>
        <h2 className="mt-1 font-playfair text-2xl font-bold text-slate-900">
          Selamat datang di panel admin
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Kelola buku, kategori, pengguna, dan ulasan dari satu tempat. Data di
          halaman ini masih contoh karena backend belum tersedia.
        </p>
      </section>

      {/* ── Statistik ── */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <article
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">{item.label}</p>
                <p className="mt-2 font-playfair text-3xl font-bold text-slate-900">
                  {item.value}
                </p>
              </div>
              <span
                className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${item.tone}`}
              >
                <Icon name={item.icon} className="h-5 w-5" />
              </span>
            </div>
          </article>
        ))}
      </section>

      {/* ── Popular Books + Recent User berjejer ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Popular Books */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-playfair text-xl font-bold text-slate-900">
              Buku Populer
            </h3>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700">
              <Icon name="flame" className="h-4 w-4" />
              Teratas
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {popularBooks.map((book) => (
              <div
                key={book.id}
                className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-3 transition-colors hover:bg-slate-100"
              >
                <img
                  src={book.cover}
                  alt={book.title}
                  className="h-14 w-10 flex-shrink-0 rounded-lg object-cover shadow-sm"
                  loading="lazy"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-900">
                    {book.title}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {book.author}
                  </p>
                  <RatingStars value={book.rating} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Users */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-playfair text-xl font-bold text-slate-900">
              Pengguna Terbaru
            </h3>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400">
              <Icon name="clock" className="h-4 w-4" />
              Terdaftar
            </span>
          </div>
          <ul className="mt-4 divide-y divide-slate-100">
            {recentUsers.map((user) => (
              <li
                key={user.email}
                className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600">
                    {user.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
                <span className="whitespace-nowrap text-xs font-medium text-slate-400">
                  {user.joined}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* ── Recent Reviews + Quick Actions berjejer ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Reviews */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-playfair text-xl font-bold text-slate-900">
            Ulasan Terbaru
          </h3>
          <div className="mt-4 space-y-4">
            {recentReviews.map((review, idx) => (
              <div
                key={idx}
                className="border-b border-slate-100 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
                      {review.user.charAt(0)}
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      {review.user}
                    </span>
                  </div>
                  <RatingStars value={review.rating} />
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  pada{" "}
                  <span className="font-medium text-slate-700">
                    {review.book}
                  </span>
                </p>
                <p className="mt-1 text-sm italic text-slate-600 line-clamp-2">
                  &ldquo;{review.text}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-playfair text-xl font-bold text-slate-900">
            Tindakan Cepat
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Akses cepat ke halaman kelola utama.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <a
                key={action.label}
                href={action.href}
                className={`flex flex-col items-center gap-2 rounded-xl border border-slate-200 p-4 text-center transition-colors ${action.tone}`}
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                  <Icon name={action.icon} className="h-5 w-5" />
                </span>
                <span className="text-xs font-semibold">{action.label}</span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
