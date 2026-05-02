"use client";

import { useState, useEffect } from "react";

interface Patient {
  id: number;
  nom: string;
  prenom: string;
  region: string;
}

const SYMPTOMES_DISPONIBLES = [
  "Fièvre", "Toux", "Maux de tête",
  "Fatigue", "Diarrhée", "Vomissements",
  "Douleur abdominale", "Éruption cutanée",
  "Frissons", "Douleur thoracique",
  "Essoufflement", "Vertiges",
];

export default function ConsultationForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [symptomes, setSymptomes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/patients")
      .then((res) => res.json())
      .then(setPatients);
  }, []);

  function toggleSymptome(s: string) {
    setSymptomes((prev) =>
      prev.includes(s)
        ? prev.filter((x) => x !== s)
        : [...prev, s]
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    if (symptomes.length === 0) {
      alert("Cochez au moins un symptôme.");
      return;
    }

    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    const res = await fetch("/api/consultations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        patientId: Number(formData.get("patientId")),
        symptomes: symptomes,
        notes: formData.get("notes"),
      }),
    });

    if (res.ok) {
      setSymptomes([]);
      form.reset();
      onSuccess();
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 border-b pb-3">
        Nouvelle consultation
      </h3>

      {/* Section 1 : Patient */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Patient
        </label>
        <select 
          name="patientId" 
          required 
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
        >
          <option value="">Sélectionner un patient</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.prenom} {p.nom} — {p.region}
            </option>
          ))}
        </select>
      </div>

      {/* Section 2 : Symptômes */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Symptômes ({symptomes.length} sélectionnés)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {SYMPTOMES_DISPONIBLES.map((s) => (
            <label 
              key={s}
              className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${
                symptomes.includes(s)
                  ? "bg-orange-50 border-orange-400 text-orange-700 font-medium"
                  : "bg-white border-gray-200 hover:bg-gray-50 text-gray-600"
              }`}
            >
              <input 
                type="checkbox"
                checked={symptomes.includes(s)}
                onChange={() => toggleSymptome(s)}
                className="w-4 h-4 accent-orange-500" 
              />
              <span className="text-sm">{s}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Section 3 : Notes */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Notes (optionnel)
        </label>
        <textarea 
          name="notes" 
          rows={3}
          placeholder="Observations cliniques..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all" 
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full md:w-auto bg-orange-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-600 shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Enregistrement..." : "Enregistrer la consultation"}
      </button>
    </form>
  );
}