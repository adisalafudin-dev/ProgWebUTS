import { SERVICE_KEYS } from "../config/services.js";
import { getServiceClient } from "./httpClient.js";

const client = getServiceClient(SERVICE_KEYS.REVIEW);

const unwrap = (response) => response.data;

export const getReviews = (params) =>
  client.get("/reviews", { params }).then(unwrap);

export const getReviewById = (id) =>
  client.get(`/reviews/${id}`).then(unwrap);

export const getReviewsByBook = (bookId, params) =>
  client.get(`/books/${bookId}/reviews`, { params }).then(unwrap);

export const createReview = (payload) =>
  client.post("/reviews", payload).then(unwrap);

export const updateReview = (id, payload) =>
  client.put(`/reviews/${id}`, payload).then(unwrap);

export const deleteReview = (id) =>
  client.delete(`/reviews/${id}`).then(unwrap);

export const moderateReview = (id, payload) =>
  client.patch(`/reviews/${id}/moderate`, payload).then(unwrap);

export const reviewApi = {
  getReviews,
  getReviewById,
  getReviewsByBook,
  createReview,
  updateReview,
  deleteReview,
  moderateReview,
};

export default reviewApi;
