"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-teal-700 text-white p-4 flex items-center justify-between">
      <div className="flex flex-col">
        <h1 className="text-xl font-bold">SénSanté</h1>
        <span className="text-xs text-teal-200">
          Assistant de santé communautaire
        </span>
      </div>

      <div className="flex items-center gap-4">
        {session ? (
          <>
            <span className="text-sm font-medium">
              {session.user?.name}
            </span>
            <button
              onClick={() => signOut()}
              className="text-sm bg-teal-600 px-3 py-1 rounded hover:bg-teal-500 transition shadow-sm"
            >
              Déconnexion
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="text-sm bg-teal-600 px-3 py-1 rounded hover:bg-teal-500 transition shadow-sm"
          >
            Se connecter
          </Link>
        )}
      </div>
    </header>
  );
}
