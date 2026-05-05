"use client";

import { useState } from "react";

interface DiagnosticIAProps {
  consultationId: string | number; // Adapté selon ton type Prisma
  diagnosticExistant: string | null;
  confianceExistante: number | null;
  onDiagnostic: () => void;
}

export default function DiagnosticIA({
  consultationId,
  diagnosticExistant,
  confianceExistante,
  onDiagnostic,
}: DiagnosticIAProps) {
  const [loading, setLoading] = useState(false);
  const [resultat, setResultat] = useState<{
    diagnostic: string;
    confiance: number;
    recommandation: string;
    urgence: string;
  } | null>(null);

  async function lancer() {
    setLoading(true);
    try {
      const res = await fetch("/api/ia/diagnostic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Corrigé : suppression de l'espace dans le header
        },
        body: JSON.stringify({ consultationId }),
      });

      if (res.ok) {
        const data = await res.json();
        setResultat(data);
        onDiagnostic();
      } else {
        console.error("Erreur lors de l'appel API");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    } finally {
      setLoading(false);
    }
  }

  // Corrigé : suppression des espaces dans les classes Tailwind (ex: "border-green-500")
  const couleurs = {
    faible: "border-green-500 bg-green-50",
    moyen: "border-orange-500 bg-orange-50",
    urgent: "border-red-500 bg-red-50",
  };

  // 1. Affichage si le diagnostic est déjà stocké en base de données
  if (diagnosticExistant) {
    return (
      <div className="mt-3 p-4 rounded-lg border-l-4 border-teal-500 bg-teal-50">
        <p className="font-bold text-teal-800">Diagnostic IA (Archivé)</p>
        <p className="text-sm text-gray-700 mt-1">{diagnosticExistant}</p>
        <p className="text-xs text-gray-500 mt-1">
          Confiance : {confianceExistante}%
        </p>
        <p className="text-xs text-gray-400 italic mt-2">
          Ceci n'est pas un diagnostic médical.
        </p>
      </div>
    );
  }

  // 2. Affichage du bouton de lancement ou du résultat immédiat
  return (
    <div className="mt-3">
      {!resultat ? (
        <button
          onClick={lancer}
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 text-sm font-medium"
        >
          {loading ? "Analyse en cours..." : "Lancer le diagnostic IA"}
        </button>
      ) : (
        <div
          className={`p-4 rounded-lg border-l-4 ${
            couleurs[resultat.urgence as keyof typeof couleurs] || couleurs.moyen
          }`}
        >
          <div className="flex justify-between items-center">
            <p className="font-bold text-gray-800">Diagnostic IA</p>
            <span
              className={`text-xs px-2 py-1 rounded-full font-bold ${
                resultat.urgence === "urgent"
                  ? "bg-red-200 text-red-800"
                  : resultat.urgence === "moyen"
                  ? "bg-orange-200 text-orange-800"
                  : "bg-green-200 text-green-800"
              }`}
            >
              {resultat.urgence.toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-gray-700 mt-2 font-medium">
            {resultat.diagnostic}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {resultat.recommandation}
          </p>
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-500">Niveau de confiance</span>
              <span className="text-xs font-bold text-gray-700">
                {resultat.confiance}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${resultat.confiance}%` }}
              ></div>
            </div>
          </div>
          <p className="text-xs text-gray-400 italic mt-4">
            Avertissement : Cette analyse automatique ne remplace pas l'avis d'un médecin.
        </div>
      )}
    </div>
  );
}
