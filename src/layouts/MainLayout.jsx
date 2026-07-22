import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ToastContainer from "../components/ToastContainer";

const getActivePage = (pathname) => {
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

  return (
    <div className="min-h-screen flex flex-col bg-cream font-crimson transition-colors duration-300">
      <Header
        favoriteCount={favoriteCount}
        isDarkMode={isDarkMode}
        onToggleTheme={onToggleTheme}
        activePage={activePage}
        currentUser={currentUser}
        onLogout={onLogout}
      />
      <main id="main-content" className="flex-1" role="main">
        <Outlet />
      </main>
      <Footer onToast={onToast} activePage={activePage} />
      <ToastContainer toasts={toasts} onDismiss={onDismissToast} />
    </div>
  );
}
