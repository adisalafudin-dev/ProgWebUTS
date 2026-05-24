import { useEffect } from "react";
import Icon from "./Icon";

const toastStyles = {
  success: "border-primary/20 bg-white text-textMain",
  info: "border-accent/30 bg-white text-textMain",
  error: "border-accentHover/30 bg-white text-textMain",
};

const toastIcons = {
  success: "check",
  info: "info",
  error: "close",
};

export default function ToastContainer({ toasts = [], onDismiss }) {
  useEffect(() => {
    if (toasts.length === 0) return undefined;

    const timers = toasts.map((toast) =>
      window.setTimeout(() => onDismiss(toast.id), 3200),
    );

    return () => timers.forEach((timerId) => window.clearTimeout(timerId));
  }, [toasts, onDismiss]);

  return (
    <div
      className="fixed right-4 top-20 z-[60] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast-enter flex items-start gap-3 rounded-lg border p-3 shadow-book ${toastStyles[toast.type] || toastStyles.info}`}
          role="status"
        >
          <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-white">
            <Icon
              name={toastIcons[toast.type] || "info"}
              className="h-4 w-4"
              strokeWidth={2}
            />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{toast.title}</p>
            {toast.message && (
              <p className="mt-0.5 text-xs leading-relaxed text-textSecondary">
                {toast.message}
              </p>
            )}
          </div>
          <button
            type="button"
            className="rounded-md p-1 text-textSecondary transition-colors hover:bg-cream hover:text-textMain"
            aria-label="Tutup notifikasi"
            onClick={() => onDismiss(toast.id)}
          >
            <Icon name="close" className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      ))}
    </div>
  );
}
