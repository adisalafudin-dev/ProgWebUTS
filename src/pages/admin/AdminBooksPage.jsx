import { useEffect, useMemo, useState } from "react";
import Icon from "../../components/Icon";
import EmptyState from "../../components/EmptyState";
import Pagination from "../../components/Pagination";
import AdminBookDetailModal from "../../components/admin/AdminBookDetailModal";
import { fetchOpenLibraryBooks } from "../../services/openLibraryApi";
import { useDebounce } from "../../hooks/useDebounce";

const ITEMS_PER_PAGE = 10;

const SORT_OPTIONS = [
  { value: "default", label: "Urutan relevansi" },
  { value: "title-asc", label: "Judul A–Z" },
  { value: "year-desc", label: "Tahun terbit: terbaru" },
  { value: "year-asc", label: "Tahun terbit: terlama" },
];

function BookTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" aria-label="Memuat data buku">
      <div className="overflow-x-auto">
        <table className="min-w-[1180px] w-full">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>{Array.from({ length: 9 }).map((_, index) => <th key={index} className="px-5 py-4"><div className="h-3 w-20 animate-pulse rounded bg-slate-200" /></th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {Array.from({ length: 6 }).map((_, row) => (
              <tr key={row}>
                {Array.from({ length: 9 }).map((__, column) => (
                  <td key={column} className="px-5 py-3.5">
                    <div className={`${column === 0 ? "h-14 w-10" : "h-4 w-full max-w-[170px]"} animate-pulse rounded-md bg-slate-100`} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const displayValue = (value) => value || "—";

export default function AdminBooksPage() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedBook, setSelectedBook] = useState(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  useEffect(() => {
    let isCurrentRequest = true;

    const loadBooks = async () => {
      setIsLoading(true);
      setError("");

      try {
        const data = await fetchOpenLibraryBooks({
          q: debouncedSearchTerm,
          genre: selectedSubject || "Semua",
        });
        if (isCurrentRequest) setBooks(data);
      } catch (requestError) {
        if (isCurrentRequest) {
          setBooks([]);
          setError(
            requestError?.message ||
              "Data buku dari Open Library tidak dapat dimuat. Silakan coba lagi.",
          );
        }
      } finally {
        if (isCurrentRequest) setIsLoading(false);
      }
    };

    loadBooks();
    return () => {
      isCurrentRequest = false;
    };
  }, [debouncedSearchTerm, selectedSubject, refreshKey]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedSubject, sortBy]);

  const subjectOptions = useMemo(() => {
    const subjects = books.flatMap((book) => book.subjects || []);
    const uniqueSubjects = [...new Set(subjects)].sort((a, b) => a.localeCompare(b));
    return selectedSubject && !uniqueSubjects.includes(selectedSubject)
      ? [selectedSubject, ...uniqueSubjects]
      : uniqueSubjects;
  }, [books, selectedSubject]);

  const sortedBooks = useMemo(() => {
    const result = [...books];

    if (sortBy === "title-asc") {
      return result.sort((a, b) => a.title.localeCompare(b.title, "id"));
    }

    if (sortBy === "year-desc") {
      return result.sort((a, b) => (b.year || 0) - (a.year || 0));
    }

    if (sortBy === "year-asc") {
      return result.sort((a, b) => (a.year || Number.MAX_SAFE_INTEGER) - (b.year || Number.MAX_SAFE_INTEGER));
    }

    return result;
  }, [books, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedBooks.length / ITEMS_PER_PAGE));
  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedBooks.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, sortedBooks]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const hasActiveFilters = Boolean(searchTerm.trim() || selectedSubject || sortBy !== "default");

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedSubject("");
    setSortBy("default");
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-playfair text-2xl font-bold text-slate-900 sm:text-3xl">Manajemen Buku</h2>
            <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" /> Open Library API
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-600">Katalog buku publik untuk Sistem Informasi Perpustakaan.</p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <button type="button" disabled className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-400">
            <Icon name="plus" className="h-4 w-4" /> Tambah Buku
          </button>
          <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[11px] font-semibold text-amber-800">
            Tersedia setelah Backend selesai
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/60 px-4 py-3 text-sm text-indigo-900">
        <div className="flex items-center gap-2">
          <Icon name="info" className="h-4 w-4 shrink-0" />
          <span>Mode baca saja: data diambil langsung dari katalog Open Library.</span>
        </div>
        <button type="button" onClick={() => setRefreshKey((key) => key + 1)} disabled={isLoading} className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60">
          <Icon name="refresh" className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} /> Refresh Data
        </button>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <label className="relative block">
            <span className="sr-only">Cari buku</span>
            <Icon name="search" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Cari judul atau penulis..." className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-9 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
            {searchTerm && <button type="button" onClick={() => setSearchTerm("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-700" aria-label="Hapus pencarian"><Icon name="close" className="h-3.5 w-3.5" /></button>}
          </label>

          <label className="relative block">
            <span className="sr-only">Filter subject</span>
            <select value={selectedSubject} onChange={(event) => setSelectedSubject(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-9 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
              <option value="">Semua subject</option>
              {subjectOptions.map((subject) => <option key={subject} value={subject}>{subject}</option>)}
            </select>
            <Icon name="chevronDown" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </label>

          <label className="relative block">
            <span className="sr-only">Urutkan buku</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-9 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
              {SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <Icon name="sort" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </label>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <p className="text-xs text-slate-500"><span className="font-semibold text-slate-800">{sortedBooks.length}</span> buku ditemukan</p>
          {hasActiveFilters && <button type="button" onClick={resetFilters} className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700"><Icon name="refresh" className="h-3.5 w-3.5" /> Reset filter</button>}
        </div>
      </section>

      {isLoading ? <BookTableSkeleton /> : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600"><Icon name="info" className="h-6 w-6" /></div>
          <h3 className="mt-3 font-playfair text-xl font-bold text-slate-900">Gagal memuat data buku</h3>
          <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600">{error}</p>
          <button type="button" onClick={() => setRefreshKey((key) => key + 1)} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"><Icon name="refresh" className="h-4 w-4" /> Coba lagi</button>
        </div>
      ) : sortedBooks.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <EmptyState icon="bookOpen" title="Buku tidak ditemukan" description={hasActiveFilters ? "Tidak ada buku yang sesuai dengan kata kunci atau subject yang dipilih." : "Open Library belum mengembalikan data buku untuk saat ini."} />
          {hasActiveFilters && <div className="mt-4 text-center"><button type="button" onClick={resetFilters} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Reset semua filter</button></div>}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-[1180px] w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="w-20 px-5 py-3.5 font-semibold">Cover</th><th className="min-w-48 px-5 py-3.5 font-semibold">Judul</th><th className="min-w-40 px-5 py-3.5 font-semibold">Penulis</th><th className="px-5 py-3.5 font-semibold">Tahun</th><th className="min-w-40 px-5 py-3.5 font-semibold">Publisher</th><th className="min-w-36 px-5 py-3.5 font-semibold">ISBN</th><th className="min-w-48 px-5 py-3.5 font-semibold">Subject / Kategori</th><th className="min-w-28 px-5 py-3.5 font-semibold">Bahasa</th><th className="px-5 py-3.5 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedBooks.map((book) => (
                  <tr key={book.id} className="transition-colors hover:bg-slate-50/80">
                    <td className="px-5 py-3"><div className="h-14 w-10 overflow-hidden rounded-md border border-slate-200 bg-slate-100">{book.cover ? <img src={book.cover} alt={`Sampul ${book.title}`} loading="lazy" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center p-1 text-center text-[8px] font-semibold text-slate-400">No cover</div>}</div></td>
                    <td className="px-5 py-3"><p className="max-w-56 font-semibold text-slate-900 line-clamp-2">{book.title}</p></td>
                    <td className="px-5 py-3 text-slate-600"><p className="max-w-44 line-clamp-2">{book.author}</p></td>
                    <td className="px-5 py-3 font-medium text-slate-700">{displayValue(book.year)}</td>
                    <td className="px-5 py-3 text-slate-600"><p className="max-w-40 line-clamp-2">{displayValue(book.publisher)}</p></td>
                    <td className="px-5 py-3 font-mono text-xs text-slate-600">{displayValue(book.isbn)}</td>
                    <td className="px-5 py-3"><div className="flex max-w-52 flex-wrap gap-1">{book.subjects?.length ? book.subjects.slice(0, 2).map((subject) => <span key={subject} className="rounded-md bg-indigo-50 px-2 py-1 text-[11px] font-medium text-indigo-700">{subject}</span>) : <span className="text-slate-400">—</span>}</div></td>
                    <td className="px-5 py-3 text-xs text-slate-600">{book.languages?.join(", ") || "—"}</td>
                    <td className="px-5 py-3"><div className="flex justify-end gap-1.5"><button type="button" onClick={() => setSelectedBook(book)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"><Icon name="eye" className="h-3.5 w-3.5" /> Detail</button><button type="button" disabled title="Tersedia setelah Backend selesai" className="cursor-not-allowed rounded-lg border border-slate-100 bg-slate-50 px-2 py-1.5 text-xs font-semibold text-slate-300">Edit</button><button type="button" disabled title="Tersedia setelah Backend selesai" className="cursor-not-allowed rounded-lg border border-slate-100 bg-slate-50 px-2 py-1.5 text-xs font-semibold text-slate-300">Hapus</button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={sortedBooks.length} itemsPerPage={ITEMS_PER_PAGE} />
        </div>
      )}

      <AdminBookDetailModal book={selectedBook} onClose={() => setSelectedBook(null)} />
    </div>
  );
}
