import { SERVICE_KEYS } from "../config/services.js";
import { getServiceClient } from "./httpClient.js";

const client = getServiceClient(SERVICE_KEYS.USER);

const unwrap = (response) => response.data;

export const getUsers = (params) =>
  client.get("/users", { params }).then(unwrap);

export const getUserById = (id) => client.get(`/users/${id}`).then(unwrap);

export const createUser = (payload) =>
  client.post("/users", payload).then(unwrap);

export const updateUser = (id, payload) =>
  client.put(`/users/${id}`, payload).then(unwrap);

export const patchUser = (id, payload) =>
  client.patch(`/users/${id}`, payload).then(unwrap);

export const deleteUser = (id) => client.delete(`/users/${id}`).then(unwrap);

export const updateUserRole = (id, payload) =>
  client.patch(`/users/${id}/role`, payload).then(unwrap);

export const userApi = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  patchUser,
  deleteUser,
  updateUserRole,
};

export default userApi;
