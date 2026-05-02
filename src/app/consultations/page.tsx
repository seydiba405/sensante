"use client";

import { useEffect, useState } from "react";
import ConsultationForm from "@/components/ConsultationForm";

interface Consultation {
  id: number;
  date: string;
  symptomes: string[];
  diagnosticIa: string | null;
  confiance: number | null;
  statut: string;
  notes: string | null;
  patient: {
    nom: string;
    prenom: string;
    region: string;
  };
}

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  async function charger() {
    const res = await fetch("/api/consultations");
    const data = await res.json();
    setConsultations(data);
    setLoading(false);
  }

  useEffect(() => {
    charger();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Consultations
      </h1>

      <ConsultationForm onSuccess={charger} />

      <h2 className="text-xl font-semibold text-gray-700 mt-8 mb-4">
        Historique ({consultations.length})
      </h2>

      {loading ? (
        <p className="text-gray-500 animate-pulse">Chargement...</p>
      ) : consultations.length === 0 ? (
        <p className="text-gray-500 bg-gray-50 p-4 rounded-lg text-center">
          Aucune consultation enregistrée.
        </p>
      ) : (
        <div className="space-y-4">
          {consultations.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-400 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">
                    {c.patient.prenom} {c.patient.nom}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {c.patient.region} — {new Date(c.date).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    c.statut === "termine"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {c.statut === "termine" ? "Terminé" : "En attente"}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {c.symptomes.map((s, i) => (
                  <span
                    key={i}
                    className="bg-orange-50 text-orange-700 text-xs px-2 py-1 rounded-md border border-orange-100"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {c.notes && (
                <p className="text-sm text-gray-600 mt-4 p-3 bg-gray-50 rounded italic">
                  {c.notes}
                </p>
              )}

              {c.diagnosticIa ? (
                <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-bold text-red-700">
                      Diagnostic IA : {c.diagnosticIa}
                    </p>
                    <p className="text-xs font-semibold text-red-600">
                      {c.confiance}% de confiance
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-4 flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-400"></span>
                  </span>
                  <p className="text-xs text-gray-400 italic">
                    Diagnostic IA en attente (Lab IA — v0.5)
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}