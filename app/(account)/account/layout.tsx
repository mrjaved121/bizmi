import { getCurrentProfile } from "@/lib/data/account";
import { AccountSidebar } from "@/components/features/auth/AccountSidebar";

export default async function AccountShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();
  const firstName = profile?.full_name?.split(" ")[0] || "there";

  return (
    <section className="py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-6">
        <h1 className="font-serif text-3xl text-ink">Hi, {firstName}.</h1>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
          <AccountSidebar />
          <div>{children}</div>
        </div>
      </div>
    </section>
  );
}
