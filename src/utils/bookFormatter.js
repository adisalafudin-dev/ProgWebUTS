import { getBookGenres } from "./genreMapper";

const uniqueText = (values, limit = 3) =>
  [...new Set((Array.isArray(values) ? values : [values]).map((value) => value?.trim()).filter(Boolean))].slice(
    0,
    limit,
  );

const getFirstSentence = (book) => {
  const sentence = Array.isArray(book.first_sentence)
    ? book.first_sentence[0]
    : book.first_sentence;

  return typeof sentence === "string" ? sentence.replace(/\s+/g, " ").trim() : "";
};

export const formatOpenLibraryBook = (book, index) => {
  const subjects = uniqueText([...(book.subject || []), ...(book.subject_facet || [])]);
  const genres = getBookGenres(book);
  const title = book.title || "Judul tidak tersedia";
  const cover = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : book.cover_edition_key
      ? `https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-M.jpg`
      : "";

  return {
    // This shape is deliberately independent from the Open Library response,
    // so a NestJS response can use the same contract later.
    id: book.key || book.cover_edition_key || `${title}-${book.first_publish_year || index}`,
    key: book.key || "",
    workKey: book.key || "",
    title,
    author: uniqueText(book.author_name, 5).join(", ") || "Penulis tidak diketahui",
    year: book.first_publish_year || "-",
    publisher: uniqueText(book.publisher, 2).join(", ") || null,
    isbn: book.isbn?.[0] || null,
    subjects,
    genre: genres[0] || "Umum",
    genres,
    tags: subjects.filter((subject) => !genres.includes(subject)).slice(0, 3),
    languages: uniqueText(book.language, 4),
    rating: Number(book.ratings_average) || 0,
    available: ["public", "borrowable"].includes(book.ebook_access),
    featured: false,
    cover,
    pages: book.number_of_pages_median || book.edition_count || null,
    synopsis: getFirstSentence(book),
  };
};
