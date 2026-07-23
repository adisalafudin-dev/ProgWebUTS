import { SERVICE_KEYS } from "../config/services.js";
import { getServiceClient } from "./httpClient.js";

const client = getServiceClient(SERVICE_KEYS.NOTIFICATION);

const unwrap = (response) => response.data;

export const getNotifications = (params) =>
  client.get("/notifications", { params }).then(unwrap);

export const getNotificationById = (id) =>
  client.get(`/notifications/${id}`).then(unwrap);

export const getUnreadCount = () =>
  client.get("/notifications/unread-count").then(unwrap);

export const markAsRead = (id) =>
  client.patch(`/notifications/${id}/read`).then(unwrap);

export const markAllAsRead = () =>
  client.patch("/notifications/read-all").then(unwrap);

export const deleteNotification = (id) =>
  client.delete(`/notifications/${id}`).then(unwrap);

export const notificationApi = {
  getNotifications,
  getNotificationById,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};

export default notificationApi;
