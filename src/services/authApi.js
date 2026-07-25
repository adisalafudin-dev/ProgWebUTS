import { SERVICE_KEYS } from "../config/services.js";
import { getServiceClient } from "./httpClient.js";

const client = getServiceClient(SERVICE_KEYS.AUTH);

const unwrap = (response) => response.data;

export const login = (credentials) =>
  client.post("/auth/login", credentials).then(unwrap);

export const register = (payload) =>
  client.post("/auth/register", payload).then(unwrap);

export const logout = () =>
  client.post("/auth/logout", {}, { skipAuthRefresh: true }).then(unwrap);

export const refreshToken = (payload) =>
  client
    .post("/auth/refresh", payload, { skipAuthRefresh: true })
    .then(unwrap);

export const getProfile = () => client.get("/auth/me").then(unwrap);

export const updateProfile = (payload) =>
  client.patch("/auth/me", payload).then(unwrap);

export const changePassword = (payload) =>
  client.post("/auth/change-password", payload).then(unwrap);

export const authApi = {
  login,
  register,
  logout,
  refreshToken,
  getProfile,
  updateProfile,
  changePassword,
};

export default authApi;
