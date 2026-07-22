import { useEffect, useState } from "react";
import Icon from "../components/Icon";

export default function SettingsPage({ isDarkMode, onToggleTheme }) {
  const [themeLabel, setThemeLabel] = useState(isDarkMode ? "Gelap" : "Terang");

  useEffect(() => {
    setThemeLabel(isDarkMode ? "Gelap" : "Terang");
  }, [isDarkMode]);

  return (
    <section className="mx-auto min-h-[70vh] max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-borderSoft bg-white p-8 shadow-book">
        <p className="section-label mb-3">Pengaturan</p>
        <h1 className="font-playfair text-3xl font-bold text-textMain mb-6">
          Preferensi AksaraHub
        </h1>
        <div className="space-y-6 text-textSecondary text-sm">
          <div className="rounded-lg border border-borderSoft bg-cream p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-textMain">Tema Aplikasi</p>
                <p className="mt-1">Mode tampilan saat ini: {themeLabel}</p>
              </div>
              <button
                type="button"
                className="btn-primary inline-flex items-center gap-2"
                onClick={onToggleTheme}
              >
                <Icon name={isDarkMode ? "sun" : "moon"} className="h-4 w-4" />
                Ubah ke {isDarkMode ? "Terang" : "Gelap"}
              </button>
            </div>
          </div>
          <div className="rounded-lg border border-borderSoft bg-cream p-6">
            <p className="font-semibold text-textMain">Akses Cepat</p>
            <p className="mt-1">
              Gunakan panel navigasi untuk berpindah antar halaman buku,
              favorit, dan akun.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
