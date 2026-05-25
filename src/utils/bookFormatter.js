import { getBookGenres } from "./genreMapper";

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

export const formatSubjectTags = (book, genres) => {
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

export const formatOpenLibraryBook = (book, index) => {
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
