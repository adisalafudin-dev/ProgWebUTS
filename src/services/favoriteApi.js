import { SERVICE_KEYS } from "../config/services.js";
import { getServiceClient } from "./httpClient.js";

const client = getServiceClient(SERVICE_KEYS.FAVORITE);

const unwrap = (response) => response.data;

export const getFavorites = (params) =>
  client.get("/favorites", { params }).then(unwrap);

export const getFavoriteById = (id) =>
  client.get(`/favorites/${id}`).then(unwrap);

export const addFavorite = (payload) =>
  client.post("/favorites", payload).then(unwrap);

export const removeFavorite = (id) =>
  client.delete(`/favorites/${id}`).then(unwrap);

export const removeFavoriteByBook = (bookId) =>
  client.delete(`/favorites/book/${bookId}`).then(unwrap);

export const checkFavorite = (bookId) =>
  client.get(`/favorites/check/${bookId}`).then(unwrap);

export const favoriteApi = {
  getFavorites,
  getFavoriteById,
  addFavorite,
  removeFavorite,
  removeFavoriteByBook,
  checkFavorite,
};

export default favoriteApi;
