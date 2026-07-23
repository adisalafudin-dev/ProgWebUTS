import Icon from "../../components/Icon";

const mockCategories = [
  { id: 1, name: "Fiksi", slug: "fiksi", bookCount: 42 },
  { id: 2, name: "Sejarah", slug: "sejarah", bookCount: 18 },
  { id: 3, name: "Teknologi", slug: "teknologi", bookCount: 24 },
  { id: 4, name: "Sastra", slug: "sastra", bookCount: 31 },
  { id: 5, name: "Anak-anak", slug: "anak-anak", bookCount: 13 },
];

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-playfair text-2xl font-bold text-slate-900">
            Daftar Kategori
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Atur kategori untuk mengelompokkan buku.
          </p>
        </div>
        <button type="button" className="btn-primary">
          <Icon name="tag" className="h-4 w-4" />
          Tambah Kategori
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {mockCategories.map((category) => (
          <article
            key={category.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-playfair text-lg font-bold text-slate-900">
                  {category.name}
                </h3>
                <p className="mt-1 text-sm text-slate-500">/{category.slug}</p>
              </div>
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
                {category.bookCount} buku
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
