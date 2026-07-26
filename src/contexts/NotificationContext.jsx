import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { notificationApi } from "../services/notificationApi.js";
import { useAuth } from "./AuthContext.jsx";
import { toast } from "sonner";
import { showToast as sonnerShowToast } from "../utils/toast.js";

const NotificationContext = createContext(null);

let toastIdCounter = 0;

export function NotificationProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [toasts, setToasts] = useState([]);
  const [backendNotifications, setBackendNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load backend notifications when authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setBackendNotifications([]);
      setUnreadCount(0);
      return;
    }

    const loadNotifications = async () => {
      try {
        const response = await notificationApi.getNotifications();
        const data = response.data || response;
        const notifications = Array.isArray(data)
          ? data
          : data?.notifications || data?.data || [];
        setBackendNotifications(notifications);

        const countResponse = await notificationApi.getUnreadCount();
        const countData = countResponse.data || countResponse;
        const count =
          typeof countData === "number"
            ? countData
            : countData?.count || countData?.unreadCount || 0;
        setUnreadCount(count);
      } catch {
        // Backend tidak tersedia—hanya gunakan toast lokal
      }
    };

    loadNotifications();
  }, [isAuthenticated]);

  const dismissToast = useCallback((id) => {
    toast.dismiss(id);
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (title, message, type = "info", duration) => {
      const toastId = sonnerShowToast(title, message, type, duration);
      return toastId;
    },
    [],
  );

  const markAsRead = useCallback(
    async (id) => {
      if (isAuthenticated) {
        try {
          await notificationApi.markAsRead(id);
          setBackendNotifications((prev) =>
            prev.map((n) =>
              n.id === id || n._id === id ? { ...n, read: true } : n,
            ),
          );
          setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch {
          // Silent fallback
        }
      }
    },
    [isAuthenticated],
  );

  const markAllAsRead = useCallback(async () => {
    if (isAuthenticated) {
      try {
        await notificationApi.markAllAsRead();
        setBackendNotifications((prev) =>
          prev.map((n) => ({ ...n, read: true })),
        );
        setUnreadCount(0);
      } catch {
        // Silent fallback
      }
    }
  }, [isAuthenticated]);

  const value = useMemo(
    () => ({
      toasts,
      showToast,
      dismissToast,
      backendNotifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
    }),
    [
      toasts,
      showToast,
      dismissToast,
      backendNotifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
    ],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
}
