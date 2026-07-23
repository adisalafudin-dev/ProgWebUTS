import axios from "axios";
import { getServiceConfig } from "../config/services.js";
import {
  clearAuthSession,
  getAuthSession,
  isRefreshTokenValid,
  refreshAuthSession,
  saveAuthSession,
} from "./authService.js";

const clients = new Map();
let refreshPromise = null;

export class ApiError extends Error {
  constructor({ message, status = 0, data = null, originalError = null }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.originalError = originalError;
  }
}

export const normalizeApiError = (error) => {
  if (error instanceof ApiError) {
    return error;
  }

  if (error?.response) {
    return new ApiError({
      message:
        error.response.data?.message ||
        error.response.statusText ||
        "Permintaan gagal.",
      status: error.response.status,
      data: error.response.data,
      originalError: error,
    });
  }

  if (error?.request) {
    return new ApiError({
      message: "Tidak dapat terhubung ke server.",
      status: 0,
      originalError: error,
    });
  }

  return new ApiError({
    message: error?.message || "Terjadi kesalahan tidak terduga.",
    status: 0,
    originalError: error,
  });
};

const refreshAccessToken = async () => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const session = getAuthSession();
    if (!session || !isRefreshTokenValid(session)) {
      throw new ApiError({ message: "Sesi tidak valid.", status: 401 });
    }

    const refreshed = refreshAuthSession(session, session.refreshToken);
    saveAuthSession(refreshed);
    return refreshed;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
};

const attachInterceptors = (client) => {
  client.interceptors.request.use(
    (config) => {
      const session = getAuthSession();
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(normalizeApiError(error)),
  );

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const status = error.response?.status;

      if (
        status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        !originalRequest.skipAuthRefresh
      ) {
        originalRequest._retry = true;

        try {
          const refreshed = await refreshAccessToken();
          originalRequest.headers.Authorization = `Bearer ${refreshed.accessToken}`;
          return client(originalRequest);
        } catch (refreshError) {
          clearAuthSession();
          return Promise.reject(normalizeApiError(refreshError));
        }
      }

      return Promise.reject(normalizeApiError(error));
    },
  );
};

export const createServiceClient = (serviceKey) => {
  const { baseURL, timeout } = getServiceConfig(serviceKey);

  const client = axios.create({
    baseURL,
    timeout,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  attachInterceptors(client);
  return client;
};

export const getServiceClient = (serviceKey) => {
  if (!clients.has(serviceKey)) {
    clients.set(serviceKey, createServiceClient(serviceKey));
  }
  return clients.get(serviceKey);
};

export const apiClient = createServiceClient;
