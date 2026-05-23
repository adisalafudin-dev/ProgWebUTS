import { useState } from 'react'
import Icon from './Icon'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { href: '#beranda',    label: 'Beranda',         icon: 'home' },
    { href: '#katalog',    label: 'Katalog API',      icon: 'cloud' },
    { href: '#tentang',    label: 'Tentang',          icon: 'info' },
  ]

  const handleNavClick = () => setMenuOpen(false)

  return (

    <header className="sticky top-0 z-40 border-b border-accent/30 bg-primary/95 backdrop-blur-sm shadow-book">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          <a href="#beranda" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center
                            shadow-book group-hover:bg-accentHover transition-colors duration-200">
              <Icon name="bookOpen" className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-playfair font-extrabold text-xl tracking-tight text-white">
                Folio
              </span>
              <span className="hidden sm:block text-[10px] tracking-[0.16em] uppercase
                               text-white/55 -mt-0.5">
                Book Library
              </span>
            </div>
          </a>

          <nav aria-label="Navigasi utama" className="hidden md:flex items-center gap-1 bg-white/10 rounded-lg p-1">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold
                           font-crimson rounded-md text-white/75
                           hover:bg-white hover:text-primary hover:shadow-sm
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
              className="hidden sm:flex items-center gap-2 border border-white/15 bg-white/10
                         px-3 py-2 text-sm font-semibold font-crimson text-white/80 rounded-lg
                         hover:border-accent hover:bg-white hover:text-primary
                         transition-all duration-200 shadow-sm"
            >
              <Icon name="search" className="w-3.5 h-3.5" strokeWidth={2} />
              Cari Buku
            </a>

            {/* Hamburger — md:hidden, toggle menuOpen */}
            <button
              type="button"
              aria-label={menuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen(prev => !prev)}
              className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              <div className="w-5 flex flex-col gap-1.5">
                <span
                  className={`block h-0.5 bg-white rounded transition-all duration-300
                    ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}
                />
                <span
                  className={`block h-0.5 bg-white rounded transition-all duration-300
                    ${menuOpen ? 'opacity-0' : ''}`}
                />
                <span
                  className={`block h-0.5 bg-white rounded transition-all duration-300
                    ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav — hanya tampil saat menuOpen = true */}
      <nav
        id="mobile-nav"
        aria-label="Navigasi mobile"
        className={`md:hidden border-t border-white/10 bg-primary
                    transition-all duration-300 overflow-hidden
                    ${menuOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="max-w-7xl mx-auto px-4 py-2 flex gap-1">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleNavClick}
              className="flex-1 flex flex-col items-center gap-1 py-2 text-xs font-semibold
                         font-crimson text-white/70 rounded-lg
                         hover:bg-white/10 hover:text-accent transition-colors duration-200"
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
