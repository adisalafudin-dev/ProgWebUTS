import { SERVICE_KEYS } from "../config/services.js";
import { getServiceClient } from "./httpClient.js";

const client = getServiceClient(SERVICE_KEYS.CATEGORY);

const unwrap = (response) => response.data;

export const getCategories = (params) =>
  client.get("/categories", { params }).then(unwrap);

export const getCategoryById = (id) =>
  client.get(`/categories/${id}`).then(unwrap);

export const createCategory = (payload) =>
  client.post("/categories", payload).then(unwrap);

export const updateCategory = (id, payload) =>
  client.put(`/categories/${id}`, payload).then(unwrap);

export const patchCategory = (id, payload) =>
  client.patch(`/categories/${id}`, payload).then(unwrap);

export const deleteCategory = (id) =>
  client.delete(`/categories/${id}`).then(unwrap);

export const categoryApi = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  patchCategory,
  deleteCategory,
};

export default categoryApi;
