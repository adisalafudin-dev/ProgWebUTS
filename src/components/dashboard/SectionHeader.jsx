import { Link } from "react-router-dom";
import Icon from "../Icon";

export default function SectionHeader({
  label,
  title,
  actionLabel = "Lihat Semua",
  actionTo,
  actionIcon = "eye",
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="section-label">{label}</p>
        <h2 className="font-playfair text-2xl font-bold text-textMain">
          {title}
        </h2>
      </div>
      {actionTo && (
        <Link
          to={actionTo}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-accentHover transition-colors hover:text-accent"
        >
          {actionLabel}
          <Icon name={actionIcon} className="h-4 w-4" strokeWidth={2} />
        </Link>
      )}
    </div>
  );
}
