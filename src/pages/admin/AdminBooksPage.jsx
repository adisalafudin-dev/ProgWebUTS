import Icon from "../../components/Icon";

const mockBooks = [
  { id: 1, title: "Sejarah Nusantara", author: "Anonim", category: "Sejarah", status: "Aktif" },
  { id: 2, title: "Petualangan di Hutan", author: "Rina Wijaya", category: "Fiksi", status: "Aktif" },
  { id: 3, title: "Panduan React", author: "Dev Team", category: "Teknologi", status: "Draft" },
  { id: 4, title: "Kumpulan Puisi Malam", author: "Sastra Kita", category: "Sastra", status: "Aktif" },
];

export default function AdminBooksPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-playfair text-2xl font-bold text-slate-900">
            Daftar Buku
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Kelola koleksi buku yang ditampilkan di aplikasi.
          </p>
        </div>
        <button type="button" className="btn-primary">
          <Icon name="bookOpen" className="h-4 w-4" />
          Tambah Buku
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Judul</th>
                <th className="px-5 py-3 font-semibold">Penulis</th>
                <th className="px-5 py-3 font-semibold">Kategori</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockBooks.map((book) => (
                <tr key={book.id} className="hover:bg-slate-50/80">
                  <td className="px-5 py-4 font-semibold text-slate-900">{book.title}</td>
                  <td className="px-5 py-4 text-slate-600">{book.author}</td>
                  <td className="px-5 py-4 text-slate-600">{book.category}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        book.status === "Aktif"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {book.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
