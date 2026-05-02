"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		setError("");

		const formData = new FormData(e.currentTarget);
		const res = await fetch("/api/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				nom: formData.get("nom"),
				prenom: formData.get("prenom"),
				email: formData.get("email"),
				password: formData.get("password"),
			}),
		});

		if (res.ok) {
			router.push("/login");
		} else {
			const data = await res.json();
			setError(data.error || "Erreur d'inscription");
		}
		setLoading(false);
	}

	return (
		<div className="flex items-center justify-center min-h-[85vh] px-4">
		<div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
		<h1 className="text-2xl font-extrabold text-teal-700 mb-6 text-center">
		Créer un compte
		</h1>

		{error && (
			<div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded mb-4 text-sm font-medium">
			{error}
			</div>
		)}

		<form onSubmit={handleSubmit} className="space-y-4">
		<div className="grid grid-cols-2 gap-4">
		<div>
		<label className="block text-xs font-semibold text-gray-500 uppercase mb-1 ml-1">Prénom</label>
		<input
		name="prenom"
		placeholder="Ex: Moussa"
		required
		className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
		/>
		</div>
		<div>
		<label className="block text-xs font-semibold text-gray-500 uppercase mb-1 ml-1">Nom</label>
		<input
		name="nom"
		placeholder="Ex: Diop"
		required
		className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
		/>
		</div>
		</div>

		<div>
		<label className="block text-xs font-semibold text-gray-500 uppercase mb-1 ml-1">Email</label>
		<input
		name="email"
		type="email"
		placeholder="votre@email.com"
		required
		className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
		/>
		</div>

		<div>
		<label className="block text-xs font-semibold text-gray-500 uppercase mb-1 ml-1">Mot de passe</label>
		<input
		name="password"
		type="password"
		placeholder="••••••••"
		required
		minLength={6}
		className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
		/>
		</div>

		<button
		type="submit"
		disabled={loading}
		className="w-full bg-teal-600 text-white py-3 rounded-lg font-bold hover:bg-teal-700 transition-colors disabled:opacity-50 shadow-md active:scale-[0.98] mt-2"
		>
		{loading ? "Création en cours..." : "S'inscrire"}
		</button>
		</form>

		<p className="text-sm text-gray-500 text-center mt-6">
		Déjà un compte ?{" "}
		<Link href="/login" className="text-teal-600 font-semibold hover:underline">
		Se connecter
		</Link>
		</p>
		</div>
		</div>
	);
}
