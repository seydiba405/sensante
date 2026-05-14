import Header from "@/components/Header";

/** Évite le prérendu au build (getServerSession / NextAuth sur /welcome). */
export const dynamic = "force-dynamic";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
