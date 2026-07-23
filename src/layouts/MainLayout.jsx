import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ToastContainer from "../components/ToastContainer";
import Sidebar from "../components/Sidebar";
import Breadcrumb from "../components/Breadcrumb";

const getActivePage = (pathname) => {
  if (pathname === "/dashboard") return "dashboard";
  if (pathname.startsWith("/books")) return "katalog";
  if (pathname === "/favorites") return "favorit";
  if (pathname === "/about") return "tentang";
  if (pathname === "/login" || pathname === "/register") return "login";
  if (pathname === "/profile") return "profile";
  if (pathname === "/settings") return "settings";
  return "home";
};

export default function MainLayout({
  favoriteCount,
  isDarkMode,
  onToggleTheme,
  currentUser,
  onLogout,
  onToast,
  toasts,
  onDismissToast,
}) {
  const location = useLocation();
  const activePage = getActivePage(location.pathname);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-cream font-crimson transition-colors duration-300">
      <Header
        favoriteCount={favoriteCount}
        isDarkMode={isDarkMode}
        onToggleTheme={onToggleTheme}
        activePage={activePage}
        currentUser={currentUser}
        onLogout={onLogout}
        drawerOpen={drawerOpen}
        onToggleDrawer={() => setDrawerOpen((value) => !value)}
      />

      <main id="main-content" className="flex-1" role="main">
        <div className="relative">
          <div
            className={`fixed inset-0 z-40 bg-slate-950/40 transition-opacity duration-300 lg:hidden ${
              drawerOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
            aria-hidden={!drawerOpen}
            onClick={() => setDrawerOpen(false)}
          />

          <div
            id="mobile-drawer"
            className={`fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto border-r border-borderSoft bg-white shadow-2xl transition-transform duration-300 lg:hidden ${
              drawerOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            role="dialog"
            aria-modal="true"
            aria-label="Navigasi aplikasi"
          >
            <div className="flex items-center justify-between border-b border-borderSoft px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-textMain">AksaraHub</p>
                <p className="text-xs text-textSecondary">Navigasi cepat</p>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-borderSoft text-textSecondary transition-colors duration-200 hover:bg-cream"
                aria-label="Tutup menu"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="p-5">
              <Sidebar
                activePage={activePage}
                favoriteCount={favoriteCount}
                currentUser={currentUser}
                onLogout={() => {
                  setDrawerOpen(false);
                  onLogout?.();
                }}
                onClose={() => setDrawerOpen(false)}
              />
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[minmax(16rem,19rem)_minmax(0,1fr)]">
              <aside className="hidden lg:block">
                <Sidebar
                  activePage={activePage}
                  favoriteCount={favoriteCount}
                  currentUser={currentUser}
                  onLogout={onLogout}
                />
              </aside>

              <div className="min-w-0 space-y-6">
                <Breadcrumb />
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer onToast={onToast} activePage={activePage} />
      <ToastContainer toasts={toasts} onDismiss={onDismissToast} />
    </div>
  );
}
