import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

/** Pas de prérendu au build : Prisma / session nécessitent DATABASE_URL & co. au runtime. */
export const dynamic = "force-dynamic";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-gray-50 p-8">{children}</main>
      </div>
    </div>
  );
}
