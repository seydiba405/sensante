import { prisma } from "@/lib/prisma";
import { analyserSymptomes } from "@/lib/groq";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const consultationId = Number(body?.consultationId);

    if (!consultationId) {
      return NextResponse.json(
        { error: "ID de consultation requis" },
        { status: 400 }
      );
    }

    // Récupérer la consultation avec le patient
    const consultation = await prisma.consultation.findUnique({
      where: { id: consultationId },
      include: { patient: true },
    });

    if (!consultation || !consultation.patient) {
      return NextResponse.json(
        { error: "Consultation ou patient introuvable" },
        { status: 404 }
      );
    }

    // --- Calcul de l'âge ---
    const naissance = new Date(consultation.patient.dateNaissance);
    const aujourdhui = new Date();
    let age = aujourdhui.getFullYear() - naissance.getFullYear();
    const m = aujourdhui.getMonth() - naissance.getMonth();
    if (m < 0 || (m === 0 && aujourdhui.getDate() < naissance.getDate())) {
      age--;
    }

    // --- Appel à l'IA ---
    const resultat = await analyserSymptomes(
      {
        nom: consultation.patient.nom,
        prenom: consultation.patient.prenom,
        age: age,
        sexe: consultation.patient.sexe,
        region: consultation.patient.region || "Non spécifiée",
      },
      Array.isArray(consultation.symptomes) ? (consultation.symptomes as string[]) : [],
      consultation.notes
    );

    const urgenceNormalisee =
      resultat.urgence === "faible" ||
      resultat.urgence === "moyen" ||
      resultat.urgence === "urgent"
        ? resultat.urgence
        : "moyen";

    // --- Mise à jour de la base de données ---
    await prisma.consultation.update({
      where: { id: consultationId },
      data: {
        diagnosticIa: resultat.diagnostic,
        confiance: resultat.confiance,
        statut: "termine",
      },
    });

    return NextResponse.json(
      {
        diagnostic: resultat.diagnostic,
        confiance: resultat.confiance,
        recommandation: resultat.recommandation,
        urgence: urgenceNormalisee,
      },
      { status: 200 }
    );

  } catch (error) {
    // Bloc de gestion d'erreur enfin propre
    console.error("Erreur Groq/Prisma:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'analyse IA" },
      { status: 500 }
    );
  }
}