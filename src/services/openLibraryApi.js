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

const getTextValue = (value) => {
  if (typeof value === "string") return value.trim();
  if (typeof value?.value === "string") return value.value.trim();
  return "";
};

const getYear = (value) => value?.match(/\b(1[5-9]\d{2}|20\d{2})\b/)?.[1] || "";

const getKeyValue = (value) => value?.replace(/^\//, "") || "";

const uniqueText = (values, limit = 3) =>
  [...new Set((Array.isArray(values) ? values : [values]).map((value) => value?.trim()).filter(Boolean))].slice(
    0,
    limit,
  );

export const fetchOpenLibraryBookDetail = async (rawWorkId) => {
  const workId = rawWorkId?.replace(/^\/works\//, "").replace(/\.json$/, "");
  if (!workId) throw new Error("Open Library Work ID tidak valid.");

  const [workResponse, editionsResponse] = await Promise.all([
    openLibraryClient.get(`/works/${workId}.json`),
    openLibraryClient.get(`/works/${workId}/editions.json`, { params: { limit: 12 } }),
  ]);

  const work = workResponse.data || {};
  const edition = (editionsResponse.data?.entries || []).find(
    (entry) =>
      entry.isbn_13?.length ||
      entry.isbn_10?.length ||
      entry.publishers?.length ||
      entry.number_of_pages,
  ) || (editionsResponse.data?.entries || [])[0] || {};

  const authorResponses = await Promise.allSettled(
    (work.authors || []).slice(0, 5).map(({ author }) =>
      author?.key ? openLibraryClient.get(`${author.key}.json`) : null,
    ),
  );
  const authors = authorResponses
    .filter((result) => result.status === "fulfilled" && result.value)
    .map((result) => result.value.data?.name)
    .filter(Boolean);

  const languages = uniqueText(
    (edition.languages || work.languages || []).map((language) =>
      getKeyValue(language?.key),
    ),
    5,
  );
  const isbn = uniqueText([...(edition.isbn_13 || []), ...(edition.isbn_10 || [])], 3);
  const coverId = work.covers?.[0] || edition.covers?.[0];

  return {
    id: work.key || `/works/${workId}`,
    workId,
    editionKey: getKeyValue(edition.key),
    title: work.title || edition.title || "",
    subtitle: work.subtitle || edition.subtitle || "",
    author: authors.join(", "),
    publisher: uniqueText(edition.publishers || work.publishers, 4),
    year: getYear(work.first_publish_date) || getYear(edition.publish_date),
    isbn,
    subjects: uniqueText(work.subjects || edition.subjects, 12),
    languages,
    pages: edition.number_of_pages || "",
    description: getTextValue(work.description) || getTextValue(edition.description),
    cover: coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : "",
    openLibraryUrl: `https://openlibrary.org/works/${workId}`,
  };
};

export const fetchOpenLibraryBooks = async (filters = {}) => {
  const response = await openLibraryClient.get("/search.json", {
    params: buildSearchParams(filters),
  });

  return applyLocalSort((response.data?.docs || []).map(formatOpenLibraryBook), filters.sort);
};

export const openLibraryApi = {
  fetchBooks: fetchOpenLibraryBooks,
  fetchBookDetail: fetchOpenLibraryBookDetail,
};

export default openLibraryApi;
