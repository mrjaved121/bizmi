export function TopBar() {
  const items = [
    "Free shipping on orders over Rs 5,000",
    "Cash on delivery available",
    "Call us: +92 300 1234567",
  ];

  return (
    <div className="hidden bg-ink py-2 text-white sm:block">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-6 px-6 font-mono text-xs uppercase tracking-wide">
        {items.map((item, i) => (
          <span key={item} className="flex items-center gap-6">
            {item}
            {i < items.length - 1 && (
              <span className="text-white/30" aria-hidden>
                ·
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
