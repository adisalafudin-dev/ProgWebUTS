import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmptyState from "../../components/EmptyState";
import Icon from "../../components/Icon";
import Pagination from "../../components/Pagination";
import { categoryService } from "../../services/categoryService";

const ITEMS_PER_PAGE = 9;
const SORT_OPTIONS = [
  { value: "count-desc", label: "Jumlah buku: terbanyak" },
  { value: "count-asc", label: "Jumlah buku: tersedikit" },
  { value: "name-asc", label: "Subject: A-Z" },
  { value: "name-desc", label: "Subject: Z-A" },
];

const percentageOf = (count, total) => (total ? (count / total) * 100 : 0);

function SkeletonBlock({ className = "" }) {
  return <div className={`animate-pulse rounded bg-slate-200 ${className}`} aria-hidden="true" />;
}

function CategoryPageSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Memuat kategori dari Open Library">
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <SkeletonBlock className="h-12 w-12 rounded-xl" />
            <div className="flex-1 space-y-2"><SkeletonBlock className="h-3 w-24" /><SkeletonBlock className="h-7 w-16" /></div>
          </div>
        ))}
      </div>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <SkeletonBlock className="h-3 w-16" /><SkeletonBlock className="mt-3 h-6 w-52" />
        <div className="mt-6 space-y-4">{Array.from({ length: 5 }).map((_, index) => <div key={index}><SkeletonBlock className="h-3 w-32" /><SkeletonBlock className="mt-2 h-2 w-full rounded-full" /></div>)}</div>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_260px]"><SkeletonBlock className="h-11 w-full rounded-xl" /><SkeletonBlock className="h-11 w-full rounded-xl" /></div></section>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => <div key={index} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex justify-between gap-3"><SkeletonBlock className="h-6 w-32" /><SkeletonBlock className="h-6 w-16 rounded-full" /></div><SkeletonBlock className="mt-4 h-3 w-40" /><SkeletonBlock className="mt-5 h-2 w-full rounded-full" /><SkeletonBlock className="mt-5 h-3 w-44" /></div>)}</div>
      <span className="sr-only">Mengambil Subject dari data buku Open Library...</span>
    </div>
  );
}

function CategoryChart({ categories, totalBooks }) {
  const chartItems = categories.slice(0, 5);
  if (!chartItems.length) return null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" aria-labelledby="category-chart-heading">
      <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Statistik</p><h3 id="category-chart-heading" className="mt-1 font-playfair text-xl font-bold text-slate-900">5 Subject paling populer</h3></div><Icon name="flame" className="h-5 w-5 text-amber-500" /></div>
      <div className="mt-5 space-y-3">{chartItems.map((category) => { const percentage = percentageOf(category.bookCount, totalBooks); return <div key={category.id}><div className="mb-1 flex items-center justify-between gap-3 text-xs"><span className="truncate font-semibold text-slate-700">{category.name}</span><span className="shrink-0 font-bold text-slate-900">{category.bookCount} buku</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label={`${category.name}: ${percentage.toFixed(1)} persen`} aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100"><div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: `${Math.max(percentage, 2)}%` }} /></div></div>; })}</div>
    </section>
  );
}

function CategoryErrorState({ message, onRetry }) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center shadow-sm" role="alert">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600"><Icon name="info" className="h-6 w-6" /></div>
      <h3 className="mt-3 font-playfair text-xl font-bold text-slate-900">Gagal memuat kategori</h3>
      <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600">{message}</p>
      <p className="mt-1 text-xs text-slate-500">Periksa koneksi internet Anda, lalu coba muat data kembali.</p>
      <button type="button" onClick={onRetry} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"><Icon name="refresh" className="h-4 w-4" /> Coba lagi</button>
    </div>
  );
}

export default function AdminCategoriesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("count-desc");
  const [currentPage, setCurrentPage] = useState(1);

  const loadCategories = async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await categoryService.getCategories();
      setCategories(result.categories || []);
      setTotalBooks(result.totalBooks || 0);
      setCurrentPage(1);
    } catch (requestError) {
      setCategories([]);
      setTotalBooks(0);
      setError(requestError?.message || "Data Subject dari Open Library tidak dapat dimuat.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadCategories(); }, []);

  const processedCategories = useMemo(() => {
    const keyword = searchTerm.trim().toLocaleLowerCase();
    const result = keyword ? categories.filter((category) => category.name.toLocaleLowerCase().includes(keyword)) : [...categories];
    return result.sort((first, second) => {
      if (sortBy === "count-asc") return first.bookCount - second.bookCount || first.name.localeCompare(second.name);
      if (sortBy === "name-asc") return first.name.localeCompare(second.name);
      if (sortBy === "name-desc") return second.name.localeCompare(first.name);
      return second.bookCount - first.bookCount || first.name.localeCompare(second.name);
    });
  }, [categories, searchTerm, sortBy]);

  const totalPages = Math.max(1, Math.ceil(processedCategories.length / ITEMS_PER_PAGE));
  const paginatedCategories = processedCategories.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const popularCategory = useMemo(() => [...categories].sort((first, second) => second.bookCount - first.bookCount)[0], [categories]);

  useEffect(() => { if (currentPage > totalPages) setCurrentPage(totalPages); }, [currentPage, totalPages]);

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><div className="flex flex-wrap items-center gap-2"><h2 className="font-playfair text-2xl font-bold text-slate-900 sm:text-3xl">Kategori berdasarkan Subject</h2><span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700"><span className="h-1.5 w-1.5 rounded-full bg-indigo-500" /> Open Library API</span></div><p className="mt-1 text-sm text-slate-600">Subject memakai koleksi buku default yang sama dengan Manajemen Buku dan Dashboard Admin.</p></div><button type="button" onClick={loadCategories} disabled={isLoading} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"><Icon name="refresh" className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} /> Perbarui data</button></div>
      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4 text-sm text-indigo-900"><div className="flex items-start gap-2"><Icon name="info" className="mt-0.5 h-4 w-4 shrink-0" /><p>Open Library tidak menyediakan endpoint kategori khusus. Jumlah setiap Subject dihitung dari buku yang berhasil dimuat; satu buku dapat termasuk ke beberapa Subject.</p></div></div>

      {isLoading ? <CategoryPageSkeleton /> : error ? <CategoryErrorState message={error} onRetry={loadCategories} /> : <>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="rounded-xl border border-indigo-100 bg-indigo-50 p-3 text-indigo-600"><Icon name="tag" className="h-6 w-6" /></div><div><p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total Subject</p><p className="mt-0.5 font-playfair text-2xl font-bold text-slate-900">{categories.length}</p></div></div>
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-amber-600"><Icon name="bookOpen" className="h-6 w-6" /></div><div><p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total buku sumber</p><p className="mt-0.5 font-playfair text-2xl font-bold text-slate-900">{totalBooks}</p></div></div>
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-emerald-600"><Icon name="flame" className="h-6 w-6" /></div><div className="min-w-0"><p className="text-xs font-medium uppercase tracking-wide text-slate-500">Subject terpopuler</p><p className="mt-0.5 truncate font-playfair text-xl font-bold text-slate-900">{popularCategory?.name || "-"}</p><p className="text-xs text-slate-500">{popularCategory ? `${popularCategory.bookCount} buku - ${percentageOf(popularCategory.bookCount, totalBooks).toFixed(1)}%` : "Belum ada data"}</p></div></div>
        </div>
        <CategoryChart categories={[...categories].sort((first, second) => second.bookCount - first.bookCount)} totalBooks={totalBooks} />
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_260px]"><label className="relative block"><span className="sr-only">Cari Subject</span><Icon name="search" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="search" value={searchTerm} onChange={(event) => { setSearchTerm(event.target.value); setCurrentPage(1); }} placeholder="Cari Subject..." className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-9 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />{searchTerm && <button type="button" onClick={() => { setSearchTerm(""); setCurrentPage(1); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700" aria-label="Hapus pencarian"><Icon name="close" className="h-4 w-4" /></button>}</label><label className="relative block"><span className="sr-only">Urutkan Subject</span><select value={sortBy} onChange={(event) => { setSortBy(event.target.value); setCurrentPage(1); }} className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-9 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">{SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select><Icon name="sort" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /></label></div></section>
        {processedCategories.length ? <div className="space-y-4"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{paginatedCategories.map((category) => { const percentage = percentageOf(category.bookCount, totalBooks); return <button key={category.id} type="button" onClick={() => navigate(`/admin/books?subject=${encodeURIComponent(category.name)}`)} className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"><div className="flex items-start justify-between gap-3"><h3 className="font-playfair text-lg font-bold text-slate-900 group-hover:text-indigo-700">{category.name}</h3><span className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800">{category.bookCount} buku</span></div><p className="mt-2 text-xs text-slate-500">{percentage.toFixed(1)}% dari {totalBooks} buku sumber</p><div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-indigo-500 transition-all group-hover:bg-violet-500" style={{ width: `${Math.max(percentage, 2)}%` }} /></div><span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-indigo-700">Lihat buku dengan Subject ini <Icon name="chevronRight" className="h-3.5 w-3.5" /></span></button>; })}</div><div className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={processedCategories.length} itemsPerPage={ITEMS_PER_PAGE} /></div></div> : <div className="rounded-2xl border border-slate-200 bg-white p-8"><EmptyState icon="tag" title="Subject tidak ditemukan" description={searchTerm ? `Tidak ada Subject yang cocok dengan "${searchTerm}".` : "Open Library belum mengembalikan Subject dari data buku ini."} /></div>}
      </>}
    </div>
  );
}
