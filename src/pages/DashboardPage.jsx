import { useState } from "react";
import BookCard from "../components/BookCard";
import BookModal from "../components/BookModal";
import Icon from "../components/Icon";
import SectionHeader from "../components/dashboard/SectionHeader";
import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import ReadingProgressCard from "../components/dashboard/ReadingProgressCard";
import ReviewCard from "../components/dashboard/ReviewCard";
import NotificationCard from "../components/dashboard/NotificationCard";

const getBookId = (book) =>
  book?.key || book?.id || book?.workKey || book?.title;

function EmptyState({ icon, text }) {
  return (
    <div className="rounded-lg border border-borderSoft bg-white p-6 text-center shadow-book">
      <Icon name={icon} className="mx-auto mb-2 h-6 w-6 text-accent" />
      <p className="text-sm text-textSecondary">{text}</p>
    </div>
  );
}

export default function DashboardPage({
  currentUser,
  books = [],
  favoriteBooks = [],
  favoriteIds = new Set(),
  onToggleFavorite,
  continueReadingBooks = [],
  recentReviews = [],
  notifications = [],
  onMarkNotificationRead,
  onToast,
}) {
  const [selectedBook, setSelectedBook] = useState(null);
  const isBookFavorite = (book) => favoriteIds.has(getBookId(book));

  const popularBooks = [...books]
    .sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0))
    .slice(0, 8);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const stats = {
    reading: continueReadingBooks.length,
    favorites: favoriteBooks.length,
    reviews: recentReviews.length,
  };

  return (
    <section className="mx-auto min-h-[70vh] max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
      <WelcomeBanner currentUser={currentUser} stats={stats} />

      <div>
        <SectionHeader
          label="Lanjutkan"
          title="Continue Reading"
          actionTo="/library"
          actionLabel="Rak Baca"
          actionIcon="bookOpen"
        />
        {continueReadingBooks.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {continueReadingBooks.map((book, i) => (
              <ReadingProgressCard
                key={getBookId(book) || i}
                book={book}
                onSelect={setSelectedBook}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="bookOpen"
            text="Belum ada buku yang sedang dibaca."
          />
        )}
      </div>

      <div>
        <SectionHeader
          label="Trending"
          title="Popular Books"
          actionTo="/books"
          actionIcon="eye"
        />
        {popularBooks.length > 0 ? (
          <div className="book-grid">
            {popularBooks.map((book, i) => (
              <BookCard
                key={getBookId(book) || i}
                book={book}
                onSelect={setSelectedBook}
                isFavorite={isBookFavorite(book)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <EmptyState icon="collection" text="Belum ada data buku populer." />
        )}
      </div>

      <div>
        <SectionHeader
          label="Rak Pribadi"
          title="Favorite Books"
          actionTo="/favorites"
          actionIcon="heart"
        />
        {favoriteBooks.length > 0 ? (
          <div className="book-grid">
            {favoriteBooks.slice(0, 8).map((book, i) => (
              <BookCard
                key={getBookId(book) || i}
                book={book}
                onSelect={setSelectedBook}
                isFavorite
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
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
        onToggleFavorite={onToggleFavorite}
        onToast={onToast}
      />
    </section>
  );
}
