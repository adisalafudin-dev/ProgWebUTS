import { SERVICE_KEYS } from "../config/services.js";
import { getServiceClient } from "./httpClient.js";

const client = getServiceClient(SERVICE_KEYS.BOOK);

const unwrap = (response) => response.data;

export const getBooks = (params) =>
  client.get("/books", { params }).then(unwrap);

export const getBookById = (id) => client.get(`/books/${id}`).then(unwrap);

export const createBook = (payload) =>
  client.post("/books", payload).then(unwrap);

export const updateBook = (id, payload) =>
  client.put(`/books/${id}`, payload).then(unwrap);

export const patchBook = (id, payload) =>
  client.patch(`/books/${id}`, payload).then(unwrap);

export const deleteBook = (id) => client.delete(`/books/${id}`).then(unwrap);

export const searchBooks = (params) =>
  client.get("/books/search", { params }).then(unwrap);

export const bookApi = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  patchBook,
  deleteBook,
  searchBooks,
};

export default bookApi;
