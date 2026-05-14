import PatientCard from "@/components/PatientCard";
import ConsultationCard from "@/components/ConsultationCard";
import AlerteIA from "@/components/AlerteIA";
import StatCard from "@/components/StatCard";
import { prisma } from "@/lib/prisma";

function ageFromBirth(d: Date): number {
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const md = today.getMonth() - d.getMonth();
  if (md < 0 || (md === 0 && today.getDate() < d.getDate())) {
    age--;
  }
  return age;
}

function formatSymptomes(value: unknown): string {
  if (Array.isArray(value)) {
    return (value as string[]).join(", ");
  }
  if (typeof value === "string") return value;
  return "—";
}

function niveauFromConfiance(c: number): "faible" | "moyen" | "urgent" {
  if (c >= 70) return "urgent";
  if (c >= 40) return "moyen";
  return "faible";
}

function statutConsultation(s: string): "en_attente" | "termine" {
  return s === "termine" ? "termine" : "en_attente";
}

export default async function Home() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const [totalPatients, consultationsCeMois, alertesUrgentes, derniereConsultation] =
    await Promise.all([
      prisma.patient.count(),
      prisma.consultation.count({
        where: { date: { gte: startOfMonth, lt: startNextMonth } },
      }),
      prisma.consultation.count({
        where: {
          statut: "termine",
          confiance: { gte: 60 },
          diagnosticIa: { not: null },
        },
      }),
      prisma.consultation.findFirst({
        orderBy: { date: "desc" },
        include: { patient: true },
      }),
    ]);

  const derniersPatients = await prisma.patient.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  const dateConsult =
    derniereConsultation &&
    new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(
      new Date(derniereConsultation.date)
    );

  const showAlerte =
    derniereConsultation?.diagnosticIa != null &&
    derniereConsultation.confiance != null;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Tableau de bord</h2>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          titre="Patients"
          valeur={totalPatients}
          unite="enregistrés"
          couleur="border-teal-500"
        />
        <StatCard
          titre="Consultations"
          valeur={consultationsCeMois}
          unite="ce mois"
          couleur="border-orange-500"
        />
        <StatCard
          titre="Alertes IA"
          valeur={alertesUrgentes}
          unite="urgentes"
          couleur="border-red-500"
        />
      </div>

      <h2 className="mb-4 text-xl font-semibold text-gray-700">
        Derniers patients
      </h2>
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {derniersPatients.length === 0 ? (
          <p className="col-span-full rounded-lg border border-dashed border-gray-200 bg-white p-6 text-center text-gray-500">
            Aucun patient enregistré pour le moment.
          </p>
        ) : (
          derniersPatients.map((p) => (
            <PatientCard
              key={p.id}
              nom={`${p.prenom} ${p.nom}`}
              region={p.region}
              age={ageFromBirth(new Date(p.dateNaissance))}
              sexe={p.sexe === "F" || p.sexe === "f" ? "F" : "M"}
            />
          ))
        )}
      </div>

      <h2 className="mb-4 text-xl font-semibold text-gray-700">
        Dernière consultation
      </h2>
      {!derniereConsultation ? (
        <p className="rounded-lg border border-dashed border-gray-200 bg-white p-6 text-center text-gray-500">
          Aucune consultation enregistrée.
        </p>
      ) : (
        <ConsultationCard
          patient={`${derniereConsultation.patient.prenom} ${derniereConsultation.patient.nom}`}
          date={dateConsult ?? ""}
          symptomes={formatSymptomes(derniereConsultation.symptomes)}
          statut={statutConsultation(derniereConsultation.statut)}
        />
      )}

      {showAlerte && derniereConsultation && (
        <div className="mt-6">
          <AlerteIA
            diagnostic={derniereConsultation.diagnosticIa ?? ""}
            confiance={Math.round(derniereConsultation.confiance ?? 0)}
            niveau={niveauFromConfiance(
              Math.round(derniereConsultation.confiance ?? 0)
            )}
          />
        </div>
      )}
    </div>
  );
}
