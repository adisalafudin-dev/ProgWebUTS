import axios from "axios";
import { formatOpenLibraryBook } from "../utils/bookFormatter";

// Keep Open Library isolated behind this service so it can be replaced by a
// NestJS book service without changing page components.
const openLibraryClient = axios.create({
  baseURL: import.meta.env.DEV ? "/openlibrary" : "https://openlibrary.org",
  timeout: 15000,
  headers: { Accept: "application/json" },
});

const DEFAULT_QUERY = "general";

const SORT_MAP = {
  "title-asc": "title",
  "title-desc": "title",
  "rating-desc": "rating",
  "year-desc": "new",
  "year-asc": "old",
};

const buildSearchParams = ({ q = "", author = "", genre = "Semua", sort, limit = 30 } = {}) => {
  const keyword = [q, author].filter(Boolean).join(" ").trim() || DEFAULT_QUERY;
  const params = {
    // Keep this query behaviour identical to the user catalogue.
    q: `${keyword} language:eng`,
    limit,
    fields:
      "key,title,author_name,first_publish_year,publisher,isbn,subject,subject_facet,language,cover_i,cover_edition_key,number_of_pages_median,edition_count,first_sentence,ratings_average,ebook_access",
  };

  if (genre && genre !== "Semua") params.subject = genre;
  if (SORT_MAP[sort]) params.sort = SORT_MAP[sort];

  return params;
};

const applyLocalSort = (books, sort) => {
  const result = [...books];
  if (sort === "title-asc") return result.sort((a, b) => a.title.localeCompare(b.title));
  if (sort === "title-desc") return result.sort((a, b) => b.title.localeCompare(a.title));
  if (sort === "rating-desc") return result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  if (sort === "year-desc") return result.sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0));
  if (sort === "year-asc") return result.sort((a, b) => (Number(a.year) || Number.MAX_SAFE_INTEGER) - (Number(b.year) || Number.MAX_SAFE_INTEGER));
  return result;
};

export const fetchOpenLibraryBooks = async (filters = {}) => {
  const response = await openLibraryClient.get("/search.json", {
    params: buildSearchParams(filters),
  });

  return applyLocalSort((response.data?.docs || []).map(formatOpenLibraryBook), filters.sort);
};

export const openLibraryApi = {
  fetchBooks: fetchOpenLibraryBooks,
};

export default openLibraryApi;
