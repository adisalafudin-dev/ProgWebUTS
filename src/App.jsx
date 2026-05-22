import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LibraryPage from "./pages/LibraryPage";
import AboutPage from "./pages/AboutPage";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-parchment-50 font-crimson">
      <Header />
import { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "./BookCard";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [dataStore, setDataStore] = useState([]);
  const [error, setError] = useState(null);

  async function fetchData() {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://openlibrary.org/search.json?q=programming&limit=10&language=eng",
      );

      setDataStore(response.data.docs);
    } catch (err) {
      setError("Gagal memuat produk. Coba lagi.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

      <main id="main-content" className="flex-1" role="main">
        <HomePage />

        <LibraryPage />
  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-row gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
          <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.3s]"></div>
          <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
        </div>
      </div>
    );

        <AboutPage />
      </main>

      <Footer />
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Books</h1>
      {/* fix: grid = row layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {dataStore.map((book, index) => (
          <BookCard key={book.key || index} book={book} />
        ))}
      </div>
    </div>
  );
}
