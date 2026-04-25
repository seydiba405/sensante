import StatCard from "@/components/StatCard";

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Tableau de bord
      </h1>

      {/* Correction des classes de grille et des gaps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          titre="Patients" 
          valeur={127}
          unite="enregistrés"
          couleur="border-teal-500" 
        />
        <StatCard 
          titre="Consultations" 
          valeur={43}
          unite="ce mois"
          couleur="border-orange-500" 
        />
        <StatCard 
          titre="Alertes" 
          valeur={8}
          unite="urgentes"
          couleur="border-red-500" 
        />
      </div>
    </div>
  );
}
