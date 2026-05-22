import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-1">
        <HomePage />
      </main>

      <Footer />
    </div>
  );
}
