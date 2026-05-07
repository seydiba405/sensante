"use client";
import { useEffect, useState } from "react";
import StatCard from "@/components/StatCard";
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

interface Stats {
  kpi: {
    totalPatients: number;
    totalConsultations: number;
    consultationsTerminees: number;
    alertesUrgentes: number;
  };
  parRegion: { region: string; total: number }[];
  parMois: { mois: string; total: number }[];
  dernieresAlertes: {
    id: number;
    patient: string;
    region: string;
    diagnostic: string | null;
    confiance: number | null;
    date: string;
  }[];
}

const COULEURS_PIE = ["#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#6366f1"];

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        <p className="ml-4 text-gray-600 font-medium">Chargement du tableau de bord...</p>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Tableau de bord <span className="text-teal-600">Analytics</span>
        </h1>
        <p className="text-gray-500 mt-1">Aperçu en temps réel des activités médicales.</p>
      </header>

      {/* Zone 1 : KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard titre="Patients" valeur={stats.kpi.totalPatients} unite="enregistrés" couleur="border-teal-500 shadow-teal-50" />
        <StatCard titre="Consultations" valeur={stats.kpi.totalConsultations} unite="au total" couleur="border-orange-500 shadow-orange-50" />
        <StatCard titre="Diagnostics IA" valeur={stats.kpi.consultationsTerminees} unite="terminés" couleur="border-purple-500 shadow-purple-50" />
        <StatCard titre="Alertes" valeur={stats.kpi.alertesUrgentes} unite="urgentes" couleur="border-red-500 shadow-red-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Zone 2 : Graphique barres */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="w-2 h-6 bg-orange-500 rounded-full mr-3"></span>
            Consultations par mois
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.parMois}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="mois" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="total" fill="#f97316" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Zone 4 : Pie chart régions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="w-2 h-6 bg-teal-500 rounded-full mr-3"></span>
            Répartition par région
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={stats.parRegion} 
                  dataKey="total" 
                  nameKey="region" 
                  cx="50%" cy="50%" 
                  innerRadius={60}
                  outerRadius={100} 
                  paddingAngle={5}
                >
                  {stats.parRegion.map((_, i) => (
                    <Cell key={i} fill={COULEURS_PIE[i % COULEURS_PIE.length]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Zone 3 : Dernières alertes */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="w-2 h-6 bg-purple-500 rounded-full mr-3"></span>
          Derniers diagnostics IA
        </h2>
        <div className="overflow-hidden">
          <div className="grid grid-cols-1 gap-4">
            {stats.dernieresAlertes.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                    {a.patient.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{a.patient}</p>
                    <p className="text-sm text-gray-500 font-medium">
                      {a.region} • {new Date(a.date).toLocaleDateString("fr-FR", { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-700 italic">
                    {a.diagnostic ? `"${a.diagnostic.substring(0, 45)}..."` : "En attente"}
                  </p>
                  <div className="mt-1 flex items-center justify-end">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      (a.confiance || 0) > 80 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      Confiance : {a.confiance}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
