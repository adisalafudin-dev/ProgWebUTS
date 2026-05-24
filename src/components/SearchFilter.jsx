import { useState } from "react";
import { GENRES, SORT_OPTIONS } from "../data/books";

export default function SearchFilter({ onFilter, onToast }) {
  const defaults = {
    q: "",
    author: "",
    genre: "Semua",
    yearMin: 1800,
    minRating: 0,
    available: false,
    featured: false,
    sort: "default",
  };

  const [values, setValues] = useState(defaults);
  const set = (key, val) =>
    setValues((current) => ({ ...current, [key]: val }));

  const handleSubmit = (event) => {
    event.preventDefault();
    onFilter(values);
  };

  const handleReset = () => {
    setValues(defaults);
    onFilter(null);
    onToast?.(
      "Filter direset",
      "Koleksi buku kembali ke tampilan awal.",
      "info",
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Form pencarian dan filter buku"
      noValidate
      className="bg-white border border-borderSoft rounded-lg shadow-book p-5"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-playfair font-semibold text-textMain">
            Cari Filter
          </h2>
          <p className="text-xs text-textSecondary mt-0.5 font-crimson">
            Gunakan filter di bawah untuk menemukan buku
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="text-xs font-semibold font-crimson text-textSecondary hover:text-accentHover transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="search-query" className="section-label block mb-1.5">
            Judul Buku
          </label>
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              id="search-query"
              type="search"
              name="q"
              placeholder="Cari judul buku..."
              autoComplete="off"
              className="input-field pl-9"
              value={values.q}
              onChange={(event) => set("q", event.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="search-author" className="section-label block mb-1.5">
            Nama Penulis
          </label>
          <input
            id="search-author"
            type="text"
            name="author"
            placeholder="Cari nama penulis..."
            autoComplete="off"
            className="input-field"
            value={values.author}
            onChange={(event) => set("author", event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="genre-select" className="section-label block mb-1.5">
            Genre
          </label>
          <div className="relative">
            <select
              id="genre-select"
              name="genre"
              className="select-field"
              value={values.genre}
              onChange={(event) => set("genre", event.target.value)}
            >
              {GENRES.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        <div>
          <label htmlFor="year-range" className="section-label block mb-1.5">
            Tahun Terbit Minimum:{" "}
            <span className="text-accentHover normal-case">
              {values.yearMin}
            </span>
          </label>
          <input
            id="year-range"
            type="range"
            min="1800"
            max="2024"
            step="10"
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-borderSoft accent-accent"
            value={values.yearMin}
            onChange={(event) => set("yearMin", Number(event.target.value))}
          />
          <div className="flex justify-between text-xs text-textSecondary font-crimson mt-1">
            <span>1800</span>
            <span>2024</span>
          </div>
        </div>

        <div>
          <label htmlFor="min-rating" className="section-label block mb-1.5">
            Rating Minimum
          </label>
          <input
            id="min-rating"
            type="number"
            min="0"
            max="5"
            step="0.5"
            className="input-field"
            value={values.minRating}
            onChange={(event) => set("minRating", Number(event.target.value))}
          />
        </div>

        <fieldset>
          <legend className="section-label mb-2">Filter Tambahan</legend>
          <div className="space-y-2">
            {[
              { key: "available", label: "Hanya yang tersedia" },
              { key: "featured", label: "Unggulan saja" },
            ].map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-accent cursor-pointer"
                  checked={values[key]}
                  onChange={(event) => set(key, event.target.checked)}
                />
                <span className="text-sm font-crimson text-secondary group-hover:text-textMain transition-colors">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="section-label mb-2">Urutkan</legend>
          <div className="space-y-1.5">
            {SORT_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="sort"
                  className="w-4 h-4 accent-accent cursor-pointer"
                  checked={values.sort === option.value}
                  onChange={() => set("sort", option.value)}
                />
                <span className="text-sm font-crimson text-secondary group-hover:text-textMain transition-colors">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <button type="submit" className="btn-primary w-full mt-5">
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        Terapkan Filter
      </button>
    </form>
  );
}
