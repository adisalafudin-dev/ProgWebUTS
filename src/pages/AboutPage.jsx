export default function AboutPage() {
  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <article className="max-w-3xl">
          <p className="section-label">Tentang</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Tentang Folio Book Library
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Folio Book Library adalah project perpustakaan digital sederhana
            untuk menampilkan katalog buku, membantu pengguna mencari koleksi,
            dan mengenal rekomendasi bacaan melalui tampilan web yang rapi,
            responsif, dan mudah digunakan.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Pada tahap pengembangan ini, project berfokus pada penerapan
            Semantic HTML, komponen React, dan styling Tailwind CSS. Konten buku
            masih menggunakan data statis sebagai fondasi awal sebelum fitur
            lanjutan seperti API, penyimpanan data, dan pengelolaan koleksi
            ditambahkan.
          </p>
        </article>
      </div>
    </section>
  );
}
