export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <a href="#home" className="group flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-lg font-bold text-amber-400 shadow-sm transition group-hover:scale-105">
            F
          </span>
          <span>
            <span className="block text-2xl font-extrabold tracking-tight text-slate-900">
              Folio
            </span>
            <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Book Library
            </span>
          </span>
        </a>

        <ul className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-600 md:gap-3">
          <li>
            <a
              className="rounded-full px-4 py-2 transition hover:bg-amber-50 hover:text-amber-600"
              href="#home"
            >
              Beranda
            </a>
          </li>
          <li>
            <a
              className="rounded-full px-4 py-2 transition hover:bg-amber-50 hover:text-amber-600"
              href="#library"
            >
              Katalog Buku
            </a>
          </li>
          <li>
            <a
              className="rounded-full px-4 py-2 transition hover:bg-amber-50 hover:text-amber-600"
              href="#search"
            >
              Cari Buku
            </a>
          </li>
          <li>
            <a
              className="rounded-full px-4 py-2 transition hover:bg-amber-50 hover:text-amber-600"
              href="#about"
            >
              Tentang
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
