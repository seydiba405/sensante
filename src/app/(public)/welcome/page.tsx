import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function WelcomePage() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/");
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <div className="max-w-lg">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-600">
          Bienvenue
        </p>
        <h1 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
          SénSanté
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-gray-600">
          Connectez-vous pour accéder au tableau de bord, aux patients et aux
          consultations.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/login"
            className="rounded-lg bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-teal-700"
          >
            Se connecter
          </Link>
          <Link
            href="/register"
            className="rounded-lg border border-teal-600 px-6 py-3 text-sm font-semibold text-teal-700 transition hover:bg-teal-50"
          >
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  );
}
