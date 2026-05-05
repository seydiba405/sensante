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
    const { consultationId } = body;

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

    // --- Correction du calcul de l'âge (plus précis) ---
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
      // Cast sécurisé des symptômes (s'assurer que c'est un tableau de strings)
      Array.isArray(consultation.symptomes) ? (consultation.symptomes as string[]) : [],
      consultation.notes
    );

    // --- Mise à jour de la base de données ---
    const updated = await prisma.consultation.update({
      where: { id: consultationId },
      data: {
        diagnosticIa: resultat.diagnostic,
        confiance: resultat.confiance,
        // Tu peux aussi enregistrer l'urgence si ton schéma le permet
        statut: "termine", 
      },
      include: { patient: true },
    });

    return NextResponse.json({
      consultation: updated,

    console.error("Erreur Groq/Prisma:", error); // Log utile pour le debug
}  }
      { status: 500 }
    );
      { error: "Erreur lors de l'analyse IA" },
    return NextResponse.json(
  } catch (error) {
    });

