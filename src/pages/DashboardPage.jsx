import { useState } from "react";
import BookModal from "../components/BookModal";
import Icon from "../components/Icon";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useFavorites } from "../contexts/FavoriteContext.jsx";
import { useNotification } from "../contexts/NotificationContext.jsx";
import SectionHeader from "../components/dashboard/SectionHeader";
import ReviewCard from "../components/dashboard/ReviewCard";
import NotificationCard from "../components/dashboard/NotificationCard";
import DiscoverHero from "../components/dashboard/DiscoverHero";
import BookCarousel from "../components/dashboard/BookCarousel";
import CategoryGrid from "../components/dashboard/CategoryGrid";
import { getBookId } from "../utils/bookHelpers.js";

function EmptyState({ icon, text }) {
  return (
    <div className="rounded-lg border border-borderSoft bg-white p-6 text-center shadow-book">
      <Icon name={icon} className="mx-auto mb-2 h-6 w-6 text-accent" />
      <p className="text-sm text-textSecondary">{text}</p>
    </div>
  );
}

export default function DashboardPage({
  books = [],
  recentReviews = [],
  notifications = [],
  onMarkNotificationRead,
}) {
  const { user } = useAuth();
  const { favoriteBooks, favoriteIds, toggleFavorite } = useFavorites();
  const { showToast } = useNotification();
  const [selectedBook, setSelectedBook] = useState(null);
  const isBookFavorite = (book) => favoriteIds.has(getBookId(book));

  const popularBooks = [...books]
    .sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0))
    .slice(0, 10);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <section className="mx-auto min-h-[70vh] max-w-6xl space-y-12 pb-4">
      <DiscoverHero userName={user?.name?.split(" ")[0]} />

      <div>
        <SectionHeader
          label="Rekomendasi"
          title="Book Recommendation"
          actionTo="/books"
          actionLabel="Lihat Semua"
          actionIcon="eye"
        />
        {popularBooks.length > 0 ? (
          <BookCarousel
            books={popularBooks}
            onSelect={setSelectedBook}
            isBookFavorite={isBookFavorite}
            onToggleFavorite={toggleFavorite}
          />
        ) : (
          <EmptyState icon="collection" text="Belum ada data buku populer." />
        )}
      </div>

      <CategoryGrid books={books} />

      <div>
        <SectionHeader
          label="Rak Pribadi"
          title="Favorite Books"
          actionTo="/favorites"
          actionIcon="heart"
        />
        {favoriteBooks.length > 0 ? (
          <BookCarousel
            books={favoriteBooks.slice(0, 10)}
            onSelect={setSelectedBook}
            isBookFavorite={() => true}
            onToggleFavorite={toggleFavorite}
          />
        ) : (
          <EmptyState
            icon="heart"
            text="Belum ada buku favorit. Yuk simpan beberapa dari koleksi."
          />
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <SectionHeader
            label="Aktivitas"
            title="Recent Review"
            actionTo="/profile"
            actionIcon="pen"
          />
          {recentReviews.length > 0 ? (
            <div className="space-y-3">
              {recentReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <EmptyState icon="pen" text="Kamu belum menulis ulasan." />
          )}
        </div>

        <div>
          <SectionHeader
            label={`${unreadCount} Belum Dibaca`}
            title="Notifikasi"
            actionIcon="bell"
          />
          {notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={onMarkNotificationRead}
                />
              ))}
            </div>
          ) : (
            <EmptyState icon="bell" text="Tidak ada notifikasi baru." />
          )}
        </div>
      </div>

      <BookModal
        key={selectedBook ? getBookId(selectedBook) : "dashboard-book-modal"}
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        isFavorite={isBookFavorite(selectedBook)}
        onToggleFavorite={toggleFavorite}
        onToast={showToast}
      />
    </section>
  );
}
