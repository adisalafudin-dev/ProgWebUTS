import Icon from './Icon'

export default function Header() {
  const navLinks = [
    { href: '#beranda',    label: 'Beranda',         icon: 'home' },
    { href: '#katalog',    label: 'Katalog API',      icon: 'cloud' },
    { href: '#tentang',    label: 'Tentang',          icon: 'info' },
  ]

  return (

    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          <a href="#beranda" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-ink rounded-lg flex items-center justify-center
                            shadow-book group-hover:bg-amber-600 transition-colors duration-200">
              <Icon name="bookOpen" className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-playfair font-extrabold text-xl tracking-tight text-ink">
                Folio
              </span>
              <span className="hidden sm:block text-[10px] tracking-[0.16em] uppercase
                               text-slate-400 -mt-0.5">
                Book Library
              </span>
            </div>
          </a>

          <nav aria-label="Navigasi utama" className="hidden md:flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold
                           font-crimson rounded-md text-slate-600
                           hover:bg-white hover:text-amber-600 hover:shadow-sm
                           transition-all duration-200"
              >
                <Icon name={link.icon} className="w-4 h-4" />
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#katalog"
              className="hidden sm:flex items-center gap-2 border border-slate-200 bg-white
                         px-3 py-2 text-sm font-semibold font-crimson text-slate-600 rounded-lg
                         hover:border-amber-300 hover:bg-amber-50 hover:text-amber-600
                         transition-all duration-200 shadow-sm"
            >
              <Icon name="search" className="w-3.5 h-3.5" strokeWidth={2} />
              Cari Buku
            </a>

            <div className="md:hidden relative group">
              <button
                type="button"
                aria-label="Buka menu navigasi"
                className="p-2 rounded-lg text-ink hover:bg-slate-100 transition-colors"
              >
                <div className="w-5 flex flex-col gap-1.5 pointer-events-none">
                  <span className="block h-0.5 bg-ink rounded" />
                  <span className="block h-0.5 bg-ink rounded" />
                  <span className="block h-0.5 bg-ink rounded" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <nav
        aria-label="Navigasi mobile"
        className="md:hidden border-t border-slate-100 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 py-2 flex gap-1">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="flex-1 flex flex-col items-center gap-1 py-2 text-xs font-semibold
                         font-crimson text-slate-500 rounded-lg
                         hover:bg-amber-50 hover:text-amber-600 transition-colors duration-200"
            >
              <Icon name={link.icon} className="w-4 h-4" />
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  )
}
