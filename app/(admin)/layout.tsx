export default function AdminRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-surface-2">{children}</div>;
}
