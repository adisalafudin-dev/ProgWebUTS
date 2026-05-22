export default function SearchFilter() {
  return (
    <form
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      aria-label="Form pencarian dan filter buku"
    >
      <div className="mb-6">
        <p className="section-label">Form Pencarian</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Cari dan Filter Buku
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Form ini memakai beberapa tipe input agar struktur halaman memenuhi
          standar Semantic HTML.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label htmlFor="book-title" className="form-label">
            Judul Buku
          </label>
          <input
            id="book-title"
            name="bookTitle"
            type="search"
            placeholder="Cari judul buku..."
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="book-author" className="form-label">
            Nama Penulis
          </label>
          <input
            id="book-author"
            name="bookAuthor"
            type="text"
            placeholder="Contoh: James Clear"
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="book-category" className="form-label">
            Kategori Buku
          </label>
          <select
            id="book-category"
            name="bookCategory"
            className="select-field"
          >
            <option value="">Semua Kategori</option>
            <option value="fiction">Fiction</option>
            <option value="education">Education</option>
            <option value="technology">Technology</option>
            <option value="self-development">Self Development</option>
          </select>
        </div>

        <div>
          <label htmlFor="publish-year" className="form-label">
            Tahun Terbit
          </label>
          <input
            id="publish-year"
            name="publishYear"
            type="number"
            min="1800"
            max="2026"
            placeholder="Contoh: 2024"
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="minimum-rating" className="form-label">
            Rating Minimum
          </label>
          <input
            id="minimum-rating"
            name="minimumRating"
            type="range"
            min="0"
            max="5"
            step="0.5"
            className="w-full accent-amber-500"
          />
          <div className="mt-1 flex justify-between text-xs text-slate-400">
            <span>0</span>
            <span>5</span>
          </div>
        </div>

        <fieldset className="rounded-xl border border-slate-200 p-4">
          <legend className="px-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            Filter Tambahan
          </legend>

          <div className="mt-2 space-y-2">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                name="availableOnly"
                className="h-4 w-4 accent-amber-500"
              />
              Hanya buku tersedia
            </label>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                name="recommendedOnly"
                className="h-4 w-4 accent-amber-500"
              />
              Buku rekomendasi
            </label>
          </div>
        </fieldset>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button type="submit" className="btn-primary">
          Terapkan Filter
        </button>
        <button type="reset" className="btn-secondary">
          Reset
        </button>
      </div>
    </form>
  );
}
