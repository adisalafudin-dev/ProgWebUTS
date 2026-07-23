/**
 * Utility functions for book-related operations
 */

/**
 * Get a unique identifier for a book
 * Handles different data structures from various APIs
 * @param {Object} book - The book object
 * @returns {string} A unique identifier for the book
 */
export const getBookId = (book) =>
  book?.key || book?.id || book?.workKey || book?._id || book?.title;
