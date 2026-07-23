import Icon from "../Icon";

const typeIcon = {
  info: "info",
  reminder: "clock",
  system: "bell",
  favorite: "heart",
};

export default function NotificationCard({ notification, onMarkAsRead }) {
  const isUnread = !notification.isRead;

  return (
    <article
      className={`flex items-start gap-3 rounded-lg border p-3.5 transition-colors ${
        isUnread ? "border-accent/40 bg-cream" : "border-borderSoft bg-white"
      }`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          isUnread ? "bg-accent text-white" : "bg-cream text-secondary"
        }`}
      >
        <Icon
          name={typeIcon[notification.type] || "bell"}
          className="h-4 w-4"
          strokeWidth={2}
        />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-sm font-semibold text-textMain">
            {notification.title}
          </h3>
          {isUnread && (
            <span
              className="h-2 w-2 shrink-0 rounded-full bg-accent"
              aria-label="Belum dibaca"
            />
          )}
        </div>
        <p className="mt-0.5 text-xs leading-relaxed text-textSecondary line-clamp-2">
          {notification.message}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[11px] text-textSecondary">
            {notification.time}
          </span>
          {isUnread && onMarkAsRead && (
            <button
              type="button"
              className="text-[11px] font-semibold text-accentHover hover:text-accent"
              onClick={() => onMarkAsRead(notification.id)}
            >
              Tandai dibaca
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
