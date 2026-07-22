import axios from "axios";
import { FALLBACK_BOOKS } from "../constants/books";
import { formatOpenLibraryBook } from "../utils/bookFormatter";

const OPEN_LIBRARY_SEARCH_URL = import.meta.env.DEV
  ? "/openlibrary/search.json"
  : "https://openlibrary.org/search.json";

const SORT_MAP = {
  "title-asc": "title",
  "title-desc": "title",
  "rating-desc": "rating",
  "year-desc": "new",
  "year-asc": "old",
};

const buildOpenLibrarySearchParams = (filters = {}) => {
  const params = new URLSearchParams();
  const qParts =
    [filters.q, filters.author].filter(Boolean).join(" ") || "general";

  // language dimasukkan ke dalam query string pakai sintaks Solr,
  // bukan sebagai parameter terpisah (itu yang bikin 500 sebelumnya)
  const q = `${qParts} language:eng`;

  params.set("q", q);

  if (filters.genre && filters.genre !== "Semua") {
    params.set("subject", filters.genre.toLowerCase());
  }

  if (SORT_MAP[filters.sort]) {
    params.set("sort", SORT_MAP[filters.sort]);
  }

  params.set("limit", "30");

  return params;
};

const applyLocalFilters = (books, filters = {}) => {
  let filteredBooks = books;

  if (filters.yearMin > 1800) {
    filteredBooks = filteredBooks.filter(
      (book) => book.year === "-" || book.year >= filters.yearMin,
    );
  }

  if (filters.minRating > 0) {
    filteredBooks = filteredBooks.filter(
      (book) => book.rating >= filters.minRating,
    );
  }

  if (filters.available) {
    filteredBooks = filteredBooks.filter((book) => book.available);
  }

  if (filters.featured) {
    filteredBooks = filteredBooks.filter((book) => book.featured);
  }

  if (filters.sort === "title-asc") {
    return [...filteredBooks].sort((a, b) => a.title.localeCompare(b.title));
  }

  if (filters.sort === "title-desc") {
    return [...filteredBooks].sort((a, b) => b.title.localeCompare(a.title));
  }

  if (filters.sort === "rating-desc") {
    return [...filteredBooks].sort((a, b) => b.rating - a.rating);
  }

  if (filters.sort === "year-desc") {
    return [...filteredBooks].sort((a, b) => {
      const yearA = Number(a.year) || 0;
      const yearB = Number(b.year) || 0;
      return yearB - yearA;
    });
  }

  if (filters.sort === "year-asc") {
    return [...filteredBooks].sort((a, b) => {
      const yearA = Number(a.year) || Number.MAX_SAFE_INTEGER;
      const yearB = Number(b.year) || Number.MAX_SAFE_INTEGER;
      return yearA - yearB;
    });
  }

  return filteredBooks;
};

export const fetchOpenLibraryBooks = async (rawFilters = {}) => {
  const filters = rawFilters || {};
  const params = buildOpenLibrarySearchParams(filters);

  try {
    const response = await axios.get(
      `${OPEN_LIBRARY_SEARCH_URL}?${params.toString()}`,
    );
    const books = response.data.docs.map(formatOpenLibraryBook);
    return applyLocalFilters(books, filters);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn(
        "Open Library request failed, using fallback data.",
        error?.message || error,
      );
    }
    return applyLocalFilters(FALLBACK_BOOKS, filters);
  }
};
