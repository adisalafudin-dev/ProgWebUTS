import { fetchOpenLibraryBooks } from "./openLibraryApi";

const slugify = (value) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-") || "subject";

/**
 * Builds the category view from the subjects returned with Open Library books.
 * Open Library has no category endpoint, so no local or seeded categories are used.
 */
export const buildCategoriesFromBooks = (books = []) => {
  const subjects = new Map();

  books.forEach((book) => {
    const subjectsInBook = new Map();

    (book.subjects || []).forEach((subject) => {
      const name = subject?.trim();
      if (name) subjectsInBook.set(name.toLocaleLowerCase(), name);
    });

    subjectsInBook.forEach((name, normalizedName) => {
      const existing = subjects.get(normalizedName);
      subjects.set(normalizedName, {
        id: existing?.id || `subject-${encodeURIComponent(normalizedName)}`,
        name: existing?.name || name,
        slug: existing?.slug || slugify(name),
        bookCount: (existing?.bookCount || 0) + 1,
      });
    });
  });

  return {
    totalBooks: books.length,
    categories: [...subjects.values()],
  };
};

export const categoryService = {
  async getCategories() {
    // Same default query as Admin Books and Admin Dashboard.
    const books = await fetchOpenLibraryBooks();
    return buildCategoriesFromBooks(books);
  },
};
