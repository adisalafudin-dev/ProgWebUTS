import axios from "axios";
import { getServiceConfig } from "../config/services.js";
import {
  clearAuthSession,
  getAuthSession,
  isRefreshTokenValid,
  refreshAuthSession,
  saveAuthSession,
} from "./authService.js";
import {
  mockAuth,
  mockBooks,
  mockFavorites,
  mockReviews,
  mockCategories,
  mockNotifications,
  mockUsers,
} from "./mockData.js";

const clients = new Map();
let refreshPromise = null;

// Use mock data by default (set to false to use real backend)
const USE_MOCK_DATA = true;

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

    const refreshed = await refreshAuthSession(session, session.refreshToken);
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

const createMockClient = (serviceKey) => {
  const mockHandlers = {
    auth: mockAuth,
    book: mockBooks,
    favorite: mockFavorites,
    review: mockReviews,
    category: mockCategories,
    notification: mockNotifications,
    user: mockUsers,
  };

  const handler = mockHandlers[serviceKey];

  // Wrap response to match axios response structure
  const wrapResponse = (data) => ({ data });

  return {
    get: (url, config) => {
      const endpoint = url.replace(/^\//, "");
      if (endpoint === "books" || endpoint === "books/search") {
        return handler.getBooks(config?.params).then(wrapResponse);
      }
      if (endpoint.startsWith("books/")) {
        const id = endpoint.split("/")[1];
        return handler.getBookById(id).then(wrapResponse);
      }
      if (endpoint === "auth/me") {
        return handler.getProfile().then(wrapResponse);
      }
      if (endpoint === "favorites") {
        return handler.getFavorites().then(wrapResponse);
      }
      if (endpoint === "reviews") {
        return handler.getReviews().then(wrapResponse);
      }
      if (endpoint === "categories") {
        return handler.getCategories().then(wrapResponse);
      }
      if (endpoint === "notifications") {
        return handler.getNotifications().then(wrapResponse);
      }
      if (endpoint === "users") {
        return handler.getUsers().then(wrapResponse);
      }
      return Promise.reject(new Error("Mock endpoint not found"));
    },
    post: (url, data, config) => {
      const endpoint = url.replace(/^\//, "");
      if (endpoint === "auth/login") {
        return handler.login(data).then(wrapResponse);
      }
      if (endpoint === "auth/register") {
        return handler.register(data).then(wrapResponse);
      }
      if (endpoint === "auth/logout") {
        return handler.logout().then(wrapResponse);
      }
      if (endpoint === "auth/refresh") {
        return handler.refreshToken(data).then(wrapResponse);
      }
      if (endpoint === "auth/change-password") {
        return handler.changePassword(data).then(wrapResponse);
      }
      if (endpoint === "books") {
        return handler.createBook(data).then(wrapResponse);
      }
      if (endpoint === "favorites") {
        return handler.addFavorite(data.bookId).then(wrapResponse);
      }
      if (endpoint === "reviews") {
        return handler.createReview(data).then(wrapResponse);
      }
      return Promise.reject(new Error("Mock endpoint not found"));
    },
    put: (url, data) => {
      const endpoint = url.replace(/^\//, "");
      if (endpoint.startsWith("books/")) {
        const id = endpoint.split("/")[1];
        return handler.updateBook(id, data).then(wrapResponse);
      }
      return Promise.reject(new Error("Mock endpoint not found"));
    },
    patch: (url, data) => {
      const endpoint = url.replace(/^\//, "");
      if (endpoint === "auth/me") {
        return handler.updateProfile(data).then(wrapResponse);
      }
      if (endpoint.startsWith("books/")) {
        const id = endpoint.split("/")[1];
        return handler.patchBook(id, data).then(wrapResponse);
      }
      if (endpoint.startsWith("users/")) {
        const id = endpoint.split("/")[1];
        return handler.updateUser(id, data).then(wrapResponse);
      }
      if (endpoint.startsWith("notifications/")) {
        const id = endpoint.split("/")[1];
        return handler.markAsRead(id).then(wrapResponse);
      }
      return Promise.reject(new Error("Mock endpoint not found"));
    },
    delete: (url) => {
      const endpoint = url.replace(/^\//, "");
      if (endpoint.startsWith("books/")) {
        const id = endpoint.split("/")[1];
        return handler.deleteBook(id).then(wrapResponse);
      }
      if (endpoint.startsWith("favorites/")) {
        const id = endpoint.split("/")[1];
        return handler.removeFavorite(id).then(wrapResponse);
      }
      return Promise.reject(new Error("Mock endpoint not found"));
    },
    interceptors: {
      request: { use: () => {} },
      response: { use: () => {} },
    },
  };
};

export const createServiceClient = (serviceKey) => {
  if (USE_MOCK_DATA) {
    return createMockClient(serviceKey);
  }

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
