import Icon from "../../components/Icon";

const stats = [
  { label: "Total Buku", value: "128", icon: "bookOpen", tone: "bg-blue-50 text-blue-700" },
  { label: "Kategori", value: "12", icon: "tag", tone: "bg-emerald-50 text-emerald-700" },
  { label: "Pengguna", value: "56", icon: "users", tone: "bg-violet-50 text-violet-700" },
  { label: "Ulasan", value: "342", icon: "star", tone: "bg-amber-50 text-amber-700" },
];

const recentActivity = [
  { action: "Buku baru ditambahkan", detail: "Sejarah Nusantara", time: "2 jam lalu" },
  { action: "Ulasan menunggu moderasi", detail: "5 ulasan baru", time: "4 jam lalu" },
  { action: "Pengguna terdaftar", detail: "demo@aksarahub.local", time: "Kemarin" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
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

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-playfair text-xl font-bold text-slate-900">
          Aktivitas Terbaru
        </h3>
        <ul className="mt-4 divide-y divide-slate-100">
          {recentActivity.map((item) => (
            <li
              key={`${item.action}-${item.detail}`}
              className="flex flex-wrap items-center justify-between gap-2 py-4 first:pt-0 last:pb-0"
            >
              <div>
                <p className="font-semibold text-slate-900">{item.action}</p>
                <p className="text-sm text-slate-500">{item.detail}</p>
              </div>
              <span className="text-xs font-medium text-slate-400">{item.time}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
