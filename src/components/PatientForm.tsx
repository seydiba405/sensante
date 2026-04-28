"use client";
import { useState } from "react";

export default function PatientForm({ onSuccess }: { onSuccess: () => void }) {
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget; // Sauvegarde pour le reset
    setLoading(true);

    const formData = new FormData(form);
    const data = {
        nom: formData.get("nom"),
        prenom: formData.get("prenom"),
        dateNaissance: formData.get("dateNaissance"),
        sexe: formData.get("sexe"),
        telephone: formData.get("telephone"),
        adresse: formData.get("adresse"),
        region: formData.get("region"),
    };

    try {
        const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        });

        if (res.ok) {
        form.reset();
        onSuccess();
        }
    } catch (error) {
        console.error("Erreur réseau:", error);
    } finally {
        setLoading(false);
    }
    }

    const regions = [
    "Dakar", "Thiès", "Saint-Louis", "Ziguinchor", "Tambacounda", 
    "Kaolack", "Louga", "Fatick", "Kolda", "Matam", 
    "Kaffrine", "Kédougou", "Sédhiou", "Diourbel",
    ];

    const inputStyle = "p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none bg-white";

    return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800">Nouveau patient</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="nom" placeholder="Nom" required className={inputStyle} />
        <input name="prenom" placeholder="Prénom" required className={inputStyle} />
        <input name="dateNaissance" type="date" required className={inputStyle} />
        
        <select name="sexe" required className={inputStyle}>
            <option value="">Sexe</option>
            <option value="F">Femme</option>
            <option value="M">Homme</option>
        </select>

        <input name="telephone" placeholder="Téléphone (optionnel)" className={inputStyle} />
        
        <select name="region" required className={inputStyle}>
            <option value="">Région</option>
            {regions.map((r) => (
            <option key={r} value={r}>{r}</option>
            ))}
        </select>
        </div>

        <input name="adresse" placeholder="Adresse (optionnel)" className={`${inputStyle} w-full`} />

        <button 
        type="submit" 
        disabled={loading} 
        className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition disabled:opacity-50 font-medium"
        >
        {loading ? "Enregistrement..." : "Enregistrer"}
        </button>
    </form>
    );
}