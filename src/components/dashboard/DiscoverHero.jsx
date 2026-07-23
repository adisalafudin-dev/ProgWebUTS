import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Icon from "../Icon";
import { GENRES } from "../../constants/books";

export default function DiscoverHero({ userName }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("Semua");

  const handleSubmit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (genre !== "Semua") params.set("genre", genre);
    navigate(`/books${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <section className="rounded-3xl border border-borderSoft bg-white/60 p-6 shadow-book sm:p-8">
      <p className="section-label mb-1">Discover</p>
      <h1 className="font-playfair text-3xl font-extrabold text-textMain sm:text-4xl">
        {userName ? `Halo, ${userName} 👋` : "Temukan bacaan berikutnya"}
      </h1>
      <p className="mt-2 max-w-md font-crimson text-sm text-textSecondary sm:text-base">
        Jelajahi rekomendasi dan kategori buku pilihan hari ini.
      </p>

      <form
        onSubmit={handleSubmit}
        role="search"
        aria-label="Cari buku"
        className="mt-6 flex flex-col gap-2 rounded-2xl border border-borderSoft bg-white p-2 shadow-sm sm:flex-row sm:items-center sm:gap-0"
      >
        <div className="relative sm:border-r sm:border-borderSoft">
          <select
            aria-label="Pilih kategori"
            value={genre}
            onChange={(event) => setGenre(event.target.value)}
            className="w-full cursor-pointer appearance-none rounded-xl bg-transparent py-2.5 pl-4 pr-8 text-sm font-semibold text-textMain outline-none sm:w-44"
          >
            {GENRES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <Icon
            name="filter"
            className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-textSecondary"
          />
        </div>

        <div className="relative flex-1">
          <Icon
            name="search"
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-textSecondary"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari judul buku yang kamu suka..."
            className="w-full rounded-xl bg-transparent py-2.5 pl-11 pr-4 text-sm text-textMain outline-none placeholder:text-textSecondary"
          />
        </div>

        <button type="submit" className="btn-primary sm:ml-2">
          <Icon name="search" className="h-4 w-4" strokeWidth={2} />
          Cari
        </button>
      </form>
    </section>
  );
}
