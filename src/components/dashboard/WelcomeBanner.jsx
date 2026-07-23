import Icon from "../Icon";

export default function WelcomeBanner({ currentUser, stats = {} }) {
  const name = currentUser?.name?.split(" ")[0] || "Pembaca";
  const hour = new Date().getHours();
  const greeting =
    hour < 11
      ? "Selamat pagi"
      : hour < 15
        ? "Selamat siang"
        : hour < 18
          ? "Selamat sore"
          : "Selamat malam";

  const items = [
    { icon: "bookOpen", label: "Sedang Dibaca", value: stats.reading ?? 0 },
    { icon: "heart", label: "Favorit", value: stats.favorites ?? 0 },
    { icon: "pen", label: "Ulasan Ditulis", value: stats.reviews ?? 0 },
  ];

  return (
    <section
      aria-labelledby="welcome-heading"
      className="relative overflow-hidden rounded-lg border border-accent/60 bg-primary px-6 py-8 text-white sm:px-8 sm:py-10"
    >
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(184,137,45,0.35),transparent_45%)]"
        aria-hidden="true"
      />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="section-label mb-2 text-accent">{greeting}</p>
          <h1
            id="welcome-heading"
            className="font-playfair text-3xl font-extrabold leading-tight sm:text-4xl"
          >
            Halo, {name} 👋
          </h1>
          <p className="mt-2 max-w-md font-crimson text-sm text-white/70 sm:text-base">
            Ini progres baca kamu hari ini. Yuk lanjutin cerita yang tertunda.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {items.map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-center backdrop-blur-sm"
            >
              <span className="mx-auto mb-1 flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-accent">
                <Icon name={item.icon} className="h-4 w-4" />
              </span>
              <span className="block font-playfair text-xl font-extrabold">
                {item.value}
              </span>
              <span className="block text-[11px] text-white/60">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
