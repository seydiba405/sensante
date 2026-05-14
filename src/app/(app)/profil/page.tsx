import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

function roleLabel(role: string | undefined) {
  switch (role) {
    case "MEDECIN":
      return "Médecin";
    case "ADMIN":
      return "Administrateur";
    case "AGENT":
    default:
      return "Agent de santé";
  }
}

export default async function ProfilPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/welcome");
  }

  const { user } = session;
  const role = (user as { role?: string }).role;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Mon profil
      </h1>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 max-w-md">
        <div className="space-y-4">
          <div className="flex flex-col border-b border-gray-50 pb-3">
            <span className="text-sm text-gray-400 uppercase font-semibold">Nom</span>
            <span className="text-lg text-gray-800 font-medium">
              {user.name ?? "—"}
            </span>
          </div>

          <div className="flex flex-col border-b border-gray-50 pb-3">
            <span className="text-sm text-gray-400 uppercase font-semibold">Rôle</span>
            <span className="text-lg text-gray-800 font-medium">
              {roleLabel(role)}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-gray-400 uppercase font-semibold">Email</span>
            <span className="text-lg text-gray-800 font-medium break-all">
              {user.email ?? "—"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
