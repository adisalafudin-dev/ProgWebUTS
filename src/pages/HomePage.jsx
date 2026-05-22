import SearchFilter from "../components/SearchFilter";

export default function HomePage() {
  return (
    <>
      <section id="home" className="overflow-hidden bg-slate-900 text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-20">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
              Modern Digital Library
            </p>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Temukan Buku Favoritmu dengan Tampilan yang Rapi dan Responsif
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Folio adalah halaman perpustakaan digital yang menerapkan Semantic
              HTML dan Tailwind CSS sebagai fondasi awal project Pemrograman
              Web.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#search" className="btn-primary">
                Cari Buku
              </a>
              <a
                href="#library"
                className="rounded-lg border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Lihat Katalog
              </a>
            </div>
          </div>

          <figure className="rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl transition duration-300 hover:-translate-y-1 hover:shadow-amber-500/20">
            <img
              src="https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=80"
              alt="Tumpukan buku di perpustakaan"
              className="h-72 w-full rounded-2xl object-cover shadow-lg transition duration-300 hover:scale-[1.02]"
            />
            <figcaption className="mt-3 text-sm text-slate-300">
              Tampilan hero menggunakan gambar, shadow, transition, dan efek
              hover.
            </figcaption>
          </figure>
        </div>
      </section>

      <section id="library" className="bg-slate-50 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-3xl">
            <p className="section-label">Katalog Buku</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Koleksi Buku Pilihan
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Bagian ini memakai layout grid responsif. Data masih statis karena
              tahap ini belum menerapkan React Hooks dan API.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <article className="card">
              <img
                src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=80"
                alt="Buku Atomic Habits"
                className="mb-4 h-48 w-full rounded-xl object-cover shadow-sm transition duration-300 hover:scale-[1.02]"
              />
              <h3 className="text-lg font-bold text-slate-900">
                Atomic Habits
              </h3>
              <p className="mt-1 text-sm text-slate-500">James Clear</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Buku tentang membangun kebiasaan kecil yang memberi dampak
                besar.
              </p>
            </article>

            <article className="card">
              <img
                src="https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=700&q=80"
                alt="Buku The Psychology of Money"
                className="mb-4 h-48 w-full rounded-xl object-cover shadow-sm transition duration-300 hover:scale-[1.02]"
              />
              <h3 className="text-lg font-bold text-slate-900">
                The Psychology of Money
              </h3>
              <p className="mt-1 text-sm text-slate-500">Morgan Housel</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Buku yang membahas perilaku manusia dalam mengambil keputusan
                finansial.
              </p>
            </article>

            <article className="card">
              <img
                src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80"
                alt="Buku Clean Code"
                className="mb-4 h-48 w-full rounded-xl object-cover shadow-sm transition duration-300 hover:scale-[1.02]"
              />
              <h3 className="text-lg font-bold text-slate-900">Clean Code</h3>
              <p className="mt-1 text-sm text-slate-500">Robert C. Martin</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Buku populer tentang cara menulis kode yang rapi dan mudah
                dirawat.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="search" className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SearchFilter />
        </div>
      </section>

      <section
        id="about"
        className="border-t border-slate-200 bg-slate-50 py-14"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <article className="max-w-3xl">
            <p className="section-label">Tentang Project</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Tahap Awal Project Folio
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              Project ini baru menerapkan standar Semantic HTML dan Tailwind
              CSS. Struktur utama sudah memakai header, main, footer, section,
              article, figure, form, label, dan berbagai tipe input.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
