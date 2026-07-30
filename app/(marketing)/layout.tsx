import { TopBar } from "@/components/features/home/TopBar";
import { Nav } from "@/components/features/home/Nav";
import { Footer } from "@/components/features/home/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopBar />
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
