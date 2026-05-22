import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LibraryPage from "./pages/LibraryPage";
import AboutPage from "./pages/AboutPage";
import { useEffect, useState } from "react";
import axios from "axios";

const formatOpenLibraryBook = (book, index) => {
  const title = book.title || "Judul tidak tersedia";
  const author = book.author_name?.join(", ") || "Penulis tidak diketahui";
  const genre = book.subject?.[0] || book.subject_facet?.[0] || "General";
  const cover = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
    : "";

  return {
    id: book.key || `api-book-${index}`,
    key: book.key || `api-book-${index}`,
    title,
    author,
    genre,
    year: book.first_publish_year || "-",
    rating: Number((3.8 + (index % 10) / 10).toFixed(1)),
    pages: book.number_of_pages_median || book.edition_count || "-",
    available: index % 3 !== 0,
    cover,
    tags: book.subject?.slice(0, 3) || [genre],
  };
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [dataStore, setDataStore] = useState([]);
  const [error, setError] = useState(null);

  async function fetchData() {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "https://openlibrary.org/search.json?q=programming&limit=10&language=eng",
      );

      setDataStore(response.data.docs.map(formatOpenLibraryBook));
    } catch (err) {
      setError("Gagal memuat produk. Coba lagi.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-row gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
          <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.3s]"></div>
          <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-parchment-50 px-4">
        <div className="max-w-md rounded-lg border border-red-100 bg-white p-6 text-center shadow-book">
          <p className="font-playfair text-xl font-semibold text-ink mb-2">
            Data belum bisa dimuat
          </p>
          <p className="font-crimson text-slate-500 mb-4">{error}</p>
          <button type="button" className="btn-primary" onClick={fetchData}>
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-parchment-50 font-crimson">
      <Header />
      <main id="main-content" className="flex-1" role="main">
        <HomePage books={dataStore} />

        <LibraryPage books={dataStore} />

        <AboutPage />
      </main>

      <Footer />
    </div>
  );
}
