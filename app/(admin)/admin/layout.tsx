import { AdminSidebar } from "@/components/features/admin/AdminSidebar";

export default function AdminShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[240px_1fr]">
      <div className="hidden lg:block">
        <div className="fixed inset-y-0 w-[240px]">
          <AdminSidebar />
        </div>
      </div>
      <main className="px-6 py-8 sm:px-10 sm:py-10">{children}</main>
    </div>
  );
}
