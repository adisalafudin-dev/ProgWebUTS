import { fetchOpenLibraryBooks } from "./openLibraryApi";
import { GENRES } from "../constants/books";

/**
 * Service to manage category data.
 * Dynamically extracts categories & book counts from Open Library Public API books.
 * Designed with standard CRUD methods ready for backend integration (POST/PUT/DELETE /api/categories).
 */
export const categoryService = {
  /**
   * Fetch categories list dynamically from Open Library Public API book data.
   */
  getCategories: async () => {
    // Query books from Open Library Public API
    const books = await fetchOpenLibraryBooks({ q: "general", limit: 50 });

    const categoryMap = new Map();

    // Initialize map with known genres from constants to ensure good coverage
    GENRES.filter((g) => g !== "Semua").forEach((genreName) => {
      const slug = genreName
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-");

      categoryMap.set(genreName, {
        id: `cat-${slug}`,
        name: genreName,
        slug: slug,
        description: `Koleksi buku bergenre ${genreName} bersumber dari Open Library Public API.`,
        bookCount: 0,
      });
    });

    // Populate book counts dynamically based on live Public API books
    books.forEach((book) => {
      const bookGenres = [
        book.genre,
        ...(book.genres || []),
        ...(book.tags || []),
      ].filter(Boolean);

      const uniqueBookGenres = [...new Set(bookGenres)];

      uniqueBookGenres.forEach((genreName) => {
        const trimmed = genreName.trim();
        if (!trimmed) return;

        // Match case-insensitively with existing categories or create new ones
        let existingCategoryKey = null;
        for (const key of categoryMap.keys()) {
          if (key.toLowerCase() === trimmed.toLowerCase()) {
            existingCategoryKey = key;
            break;
          }
        }

        if (existingCategoryKey) {
          const item = categoryMap.get(existingCategoryKey);
          item.bookCount += 1;
        } else {
          const slug = trimmed
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-");

          categoryMap.set(trimmed, {
            id: `cat-${slug}`,
            name: trimmed,
            slug: slug,
            description: `Koleksi buku bergenre ${trimmed} bersumber dari Open Library Public API.`,
            bookCount: 1,
          });
        }
      });
    });

    // Filter categories that have at least 1 book or are standard genres, sorted by bookCount desc
    const categoryList = Array.from(categoryMap.values())
      .filter((cat) => cat.bookCount > 0 || GENRES.includes(cat.name))
      .sort((a, b) => b.bookCount - a.bookCount);

    return categoryList;
  },

  /**
   * Backend Integration Placeholder: Create Category
   */
  createCategory: async (payload) => {
    // Placeholder for API call e.g., await axios.post('/api/categories', payload)
    throw new Error(
      "Aksi Tambah Kategori memerlukan integrasi Backend API."
    );
  },

  /**
   * Backend Integration Placeholder: Update Category
   */
  updateCategory: async (id, payload) => {
    // Placeholder for API call e.g., await axios.put(`/api/categories/${id}`, payload)
    throw new Error(
      "Aksi Edit Kategori memerlukan integrasi Backend API."
    );
  },

  /**
   * Backend Integration Placeholder: Delete Category
   */
  deleteCategory: async (id) => {
    // Placeholder for API call e.g., await axios.delete(`/api/categories/${id}`)
    throw new Error(
      "Aksi Hapus Kategori memerlukan integrasi Backend API."
    );
  },
};
