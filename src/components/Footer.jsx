export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <section>
            <h2 className="text-xl font-bold text-slate-900">Folio</h2>
            <p className="mt-3 text-sm leading-relaxed">
              Platform perpustakaan digital sederhana untuk mencari dan mengenal
              koleksi buku.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-900">
              Navigasi
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a className="transition hover:text-amber-600" href="#home">
                  Beranda
                </a>
              </li>
              <li>
                <a className="transition hover:text-amber-600" href="#library">
                  Katalog Buku
                </a>
              </li>
              <li>
                <a className="transition hover:text-amber-600" href="#search">
                  Cari Buku
                </a>
              </li>
              <li>
                <a className="transition hover:text-amber-600" href="#about">
                  Tentang
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-900">
              Genre
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a className="transition hover:text-amber-600" href="#library">
                  Fiction
                </a>
              </li>
              <li>
                <a className="transition hover:text-amber-600" href="#library">
                  Education
                </a>
              </li>
              <li>
                <a className="transition hover:text-amber-600" href="#library">
                  Technology
                </a>
              </li>
              <li>
                <a className="transition hover:text-amber-600" href="#library">
                  Self Development
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-900">
              Newsletter
            </h3>
            <p className="mt-4 text-sm leading-relaxed">
              Masukkan email untuk mendapat info rekomendasi buku terbaru.
            </p>
            <form className="mt-4 flex gap-2">
              <label htmlFor="newsletter-email" className="sr-only">
                Email
              </label>
              <input
                id="newsletter-email"
                name="newsletterEmail"
                type="email"
                placeholder="Email kamu..."
                className="input-field"
              />
              <button type="submit" className="btn-primary px-4">
                Kirim
              </button>
            </form>
          </section>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6 text-center text-xs text-slate-400 sm:flex sm:items-center sm:justify-between sm:text-left">
          <p>Copyright 2026 Folio Book Library.</p>
          <p className="mt-2 sm:mt-0">Project UTS Pemrograman Web.</p>
        </div>
      </div>
    </footer>
  );
}
