"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-teal-700 text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="hover:opacity-90 transition-opacity">
          <h1 className="text-xl font-extrabold tracking-tight">SénSanté</h1>
        </Link>

        <nav className="flex items-center gap-6">
          {session ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-xs text-teal-200 uppercase font-semibold">Connecté</span>
                <span className="text-sm font-medium">{session.user?.name}</span>
              </div>
              
              <button
                onClick={() => signOut({ callbackUrl: "/welcome" })}
                className="text-sm bg-teal-600 px-4 py-2 rounded-lg font-medium hover:bg-red-500 transition-colors duration-200 shadow-sm"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm bg-teal-600 px-5 py-2 rounded-lg font-medium hover:bg-teal-500 transition-all shadow-sm active:scale-95"
            >
              Se connecter
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}