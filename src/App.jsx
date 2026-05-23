import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LibraryPage from "./pages/LibraryPage";
import AboutPage from "./pages/AboutPage";
import { useEffect, useState } from "react";
import axios from "axios";
import { FALLBACK_BOOKS } from "./data/books";

const toText = (value) => {
  if (Array.isArray(value)) return value.join(" ");
  return value || "";
};

const GENRE_RULES = [
  { genre: "Chemistry", words: ["chemistry", "chemical", "molecule"] },
  {
    genre: "Physics",
    words: [
      "physics",
      "relativity",
      "quantum",
      "mechanics",
      "einstein",
      "thermodynamics",
      "astronomy",
    ],
  },
  {
    genre: "Mathematics",
    words: ["mathematics", "math", "algebra", "geometry", "calculus"],
  },
  {
    genre: "Science Fiction",
    words: ["science fiction", "sci-fi", "space fiction"],
  },
  { genre: "Science", words: ["science", "biology", "botany", "zoology"] },
  { genre: "Fantasy", words: ["fantasy", "magic", "myth"] },
  { genre: "Adventure", words: ["adventure", "journey", "exploration"] },
  { genre: "Mystery", words: ["mystery", "detective", "crime", "suspense"] },
  { genre: "Romance", words: ["romance", "love", "courtship"] },
  { genre: "History", words: ["history", "historical", "civilization"] },
  { genre: "Biography", words: ["biography", "autobiography", "memoir"] },
  { genre: "Religion", words: ["religion", "christian", "islam", "bible"] },
  { genre: "Art", words: ["art", "painting", "music", "design"] },
  { genre: "Business", words: ["business", "economics", "finance"] },
  { genre: "Poetry", words: ["poetry", "poem", "poems"] },
  { genre: "Children", words: ["children", "juvenile", "picture book"] },
  { genre: "Horror", words: ["horror", "ghost", "supernatural"] },
  { genre: "Dystopia", words: ["dystopia", "dystopian"] },
  { genre: "Philosophy", words: ["philosophy", "ethics", "logic"] },
  { genre: "Classic", words: ["classic", "literature"] },
  { genre: "Nonfiction", words: ["essay", "education", "reference"] },
];

const RELATED_GENRES = {
  Chemistry: ["Science"],
  Physics: ["Science"],
  Mathematics: ["Science"],
  Biography: ["Nonfiction"],
  History: ["Nonfiction"],
  Business: ["Nonfiction"],
  Art: ["Nonfiction"],
  Religion: ["Nonfiction"],
  Philosophy: ["Nonfiction"],
  Dystopia: ["Fiction"],
  Fantasy: ["Fiction"],
  Mystery: ["Fiction"],
  Romance: ["Fiction"],
  Horror: ["Fiction"],
  Adventure: ["Fiction"],
  "Science Fiction": ["Fiction", "Science"],
};

const buildSearchText = (book) =>
  [
    book.title,
    book.subtitle,
    toText(book.author_name),
    toText(book.subject),
    toText(book.subject_facet),
    toText(book.person),
    toText(book.place),
    toText(book.time),
    book.type,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

const getBookGenres = (book) => {
  const searchableText = buildSearchText(book);

  const matchedGenres = GENRE_RULES.filter((rule) =>
    rule.words.some((word) => searchableText.includes(word)),
  ).map((rule) => rule.genre);

  const primaryGenres = matchedGenres.length > 0 ? matchedGenres : ["Fiction"];
  const relatedGenres = primaryGenres.flatMap(
    (genre) => RELATED_GENRES[genre] || [],
  );

  return [...new Set([...primaryGenres, ...relatedGenres])].slice(0, 4);
};

const formatSubjectTags = (book, genres) => {
  const genreSet = new Set(genres.map((genre) => genre.toLowerCase()));
  const rawTags = [...(book.subject || []), ...(book.subject_facet || [])];

  return rawTags
    .map((tag) => tag?.trim())
    .filter(Boolean)
    .filter((tag) => !genreSet.has(tag.toLowerCase()))
    .filter((tag) => tag.length <= 24)
    .slice(0, 2);
};

const formatTags = (book, genres) => {
  const subjectTags = formatSubjectTags(book, genres);
  return [...new Set([...genres, ...subjectTags])].slice(0, 4);
};

const GENRE_SYNOPSIS = {
  Chemistry:
    "membahas konsep kimia, struktur materi, reaksi, dan penerapan ilmu kimia dalam memahami perubahan zat.",
  Physics:
    "membahas prinsip fisika seperti gerak, energi, ruang, waktu, dan cara kerja alam semesta.",
  Mathematics:
    "membahas pola, angka, logika, dan metode pemecahan masalah secara terstruktur.",
  "Science Fiction":
    "menggabungkan imajinasi, teknologi, dan kemungkinan masa depan dalam cerita spekulatif.",
  Science:
    "membahas pengetahuan ilmiah, pengamatan, dan cara memahami fenomena alam.",
  Fantasy:
    "menghadirkan dunia imajinatif dengan petualangan, mitos, dan unsur magis.",
  Adventure:
    "mengikuti perjalanan, tantangan, dan pengalaman tokoh dalam menghadapi situasi baru.",
  Mystery:
    "berpusat pada teka-teki, penyelidikan, dan rahasia yang perlahan terungkap.",
  Romance:
    "mengangkat relasi, perasaan, konflik, dan perkembangan hubungan antar tokoh.",
  History:
    "membahas peristiwa, tokoh, dan konteks masa lalu yang membentuk kehidupan manusia.",
  Biography:
    "menceritakan kehidupan, pengalaman, dan perjalanan seorang tokoh.",
  Religion:
    "membahas kepercayaan, nilai spiritual, praktik, dan pemikiran keagamaan.",
  Art: "membahas ekspresi kreatif, karya seni, desain, musik, atau budaya visual.",
  Business:
    "membahas organisasi, ekonomi, strategi, keuangan, dan pengambilan keputusan.",
  Poetry:
    "menggunakan bahasa padat dan ritmis untuk mengekspresikan pengalaman, emosi, dan gagasan.",
  Children:
    "dirancang untuk pembaca muda dengan bahasa yang lebih ringan dan tema yang mudah diikuti.",
  Horror:
    "membangun suasana takut, tegang, dan misterius melalui konflik atau unsur menyeramkan.",
  Dystopia:
    "menggambarkan masyarakat bermasalah sebagai kritik terhadap kuasa, aturan, atau masa depan.",
  Philosophy:
    "membahas pertanyaan mendasar tentang pengetahuan, nilai, pikiran, dan kehidupan.",
  Classic:
    "merupakan karya yang bertahan lama karena tema, gaya, dan pengaruhnya dalam sastra.",
  Nonfiction:
    "menyajikan gagasan, informasi, atau pengetahuan berdasarkan topik faktual.",
  Fiction:
    "menghadirkan cerita rekaan dengan tokoh, konflik, dan tema yang dapat dinikmati pembaca.",
};

const getFirstSentence = (book) => {
  const firstSentence = Array.isArray(book.first_sentence)
    ? book.first_sentence[0]
    : book.first_sentence;

  return firstSentence ? firstSentence.replace(/\s+/g, " ").trim() : "";
};

const buildBookSynopsis = (book, title, author, genres) => {
  const firstSentence = getFirstSentence(book);
  if (firstSentence) return firstSentence;

  const mainGenre = genres[0] || "Fiction";
  const focus = GENRE_SYNOPSIS[mainGenre] || GENRE_SYNOPSIS.Fiction;
  const subjectTags = formatSubjectTags(book, genres);
  const subjectText =
    subjectTags.length > 0
      ? ` Topik yang menonjol meliputi ${subjectTags
          .slice(0, 2)
          .join(" dan ")}.`
      : "";

  return `${title} karya ${author} ${focus}${subjectText}`;
};

const formatOpenLibraryBook = (book, index) => {
  const title = book.title || "Judul tidak tersedia";
  const author = book.author_name?.join(", ") || "Penulis tidak diketahui";
  const genres = getBookGenres(book);
  const genre = genres[0];
  const cover = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
    : "";

  return {
    id: book.key || `api-book-${index}`,
    key: book.key || `api-book-${index}`,
    workKey: book.key,
    title,
    author,
    genre,
    genres,
    year: book.first_publish_year || "-",
    rating: Number((3.8 + (index % 10) / 10).toFixed(1)),
    pages: book.number_of_pages_median || book.edition_count || "-",
    available: index % 3 !== 0,
    featured: index < 5,
    cover,
    synopsis: buildBookSynopsis(book, title, author, genres),
    tags: formatTags(book, genres),
  };
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [dataStore, setDataStore] = useState([]);
  const [error, setError] = useState(null);

  async function fetchData(filters = {}) {
    setIsLoading(true);
    setError(null);
    try {
      // Bangun query params dari filters
      const params = new URLSearchParams();

      // q: gabungkan title + author jika ada
      const q =
        [filters.q, filters.author].filter(Boolean).join(" ") || "general";
      params.set("q", q);

      // genre → subject
      if (filters.genre && filters.genre !== "Semua") {
        params.set("subject", filters.genre.toLowerCase());
      }

      // sort
      const sortMap = {
        "title-asc": "title",
        "title-desc": "title", // ← tambah ini
        "rating-desc": "rating",
        "year-desc": "new",
        "year-asc": "old", // ← tambah ini
      };
      if (sortMap[filters.sort]) params.set("sort", sortMap[filters.sort]);

      params.set("limit", "30");
      params.set("language", "eng");

      const response = await axios.get(
        `https://openlibrary.org/search.json?${params.toString()}`,
      );

      let books = response.data.docs.map(formatOpenLibraryBook);

      // Filter lokal (yearMin, minRating, available — tidak didukung API)
      if (filters.yearMin > 1800)
        books = books.filter(
          (b) => b.year === "-" || b.year >= filters.yearMin,
        );
      if (filters.minRating > 0)
        books = books.filter((b) => b.rating >= filters.minRating);
      if (filters.available) books = books.filter((b) => b.available);

      setDataStore(books);
    } catch (err) {
      setDataStore((currentBooks) =>
        currentBooks.length > 0 ? currentBooks : FALLBACK_BOOKS,
      );
      setError("API Open Library belum bisa diakses, menampilkan data contoh.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (error && dataStore.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream px-4">
        <div className="max-w-md rounded-lg border border-borderSoft bg-white p-6 text-center shadow-book">
          <p className="font-playfair text-xl font-semibold text-textMain mb-2">
            Data belum bisa dimuat
          </p>
          <p className="font-crimson text-textSecondary mb-4">{error}</p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => fetchData()}
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream font-crimson">
      <Header />
      <main id="main-content" className="flex-1" role="main">
        <HomePage
          books={dataStore}
          error={error}
          fetchData={fetchData}
          isLoading={isLoading}
        />

        <LibraryPage books={dataStore} isLoading={isLoading} />

        <AboutPage />
      </main>

      <Footer />
    </div>
  );
}
