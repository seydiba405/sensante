import Groq from "groq-sdk";

const groq = new Groq({
  // Suppression de l'espace avant la virgule
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `Tu es un assistant médical pour le Sénégal. 
Tu analyses les symptômes signalés par un agent de santé communautaire et tu proposes un pré-diagnostic.

Règles :
- Tu donnes un niveau de confiance entre 0 et 100.
- Tu classes l'urgence : "faible", "moyen", "urgent".
- Tu dois calibrer la confiance selon la cohérence des symptômes, et éviter une valeur par défaut répétée.
- Tu recommandes TOUJOURS de consulter un professionnel de santé.
- Tu tiens compte du contexte sénégalais (paludisme, dengue, etc.).
- Tu NE poses PAS de diagnostic définitif.

Réponds UNIQUEMENT en JSON valide :
{
  "diagnostic": "description du pré-diagnostic",
  "confiance": nombre_entre_0_et_100,
  "recommandation": "conseil pour l'agent",
  "urgence": "faible" | "moyen" | "urgent"
}`;

type Urgence = "faible" | "moyen" | "urgent";

function normaliserUrgence(valeur: unknown): Urgence {
  if (typeof valeur !== "string") return "moyen";
  const u = valeur.toLowerCase().trim();
  if (u === "faible" || u === "moyen" || u === "urgent") return u;
  return "moyen";
}

function normaliserConfiance(
  confianceBrute: unknown,
  urgence: Urgence,
  nbSymptomes: number
): number {
  const parsed =
    typeof confianceBrute === "number"
      ? confianceBrute
      : typeof confianceBrute === "string"
      ? Number.parseFloat(confianceBrute.replace("%", "").trim())
      : NaN;

  if (Number.isFinite(parsed) && parsed !== 60) {
    return Math.max(0, Math.min(100, Math.round(parsed)));
  }

  // Evite le 60% systématique quand le modèle reste trop générique.
  const baseParUrgence: Record<Urgence, number> = {
    faible: 35,
    moyen: 55,
    urgent: 75,
  };
  const bonusSymptomes = Math.min(Math.max(nbSymptomes, 0), 10) * 2;
  return Math.max(0, Math.min(100, baseParUrgence[urgence] + bonusSymptomes));
}

export async function analyserSymptomes(
  patient: {
    nom: string;
    prenom: string;
    age: number;
    sexe: string;
    region: string;
  },
  symptomes: string[],
  notes: string | null
): Promise<{
  diagnostic: string;
  confiance: number;
  recommandation: string;
  urgence: string;
}> {
  const userMessage = `Patient : ${patient.prenom} ${patient.nom}
Âge : ${patient.age} ans | Sexe : ${patient.sexe}
Région : ${patient.region}
Symptômes : ${symptomes.join(", ")}
${notes ? `Notes : ${notes}` : ""}
Propose un pré-diagnostic.`;

  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
    // Correction du nom du modèle (suppression des espaces)
    model: "llama-3.3-70b-versatile", 
    temperature: 0.3,
    max_tokens: 500,
    // Optionnel : force la réponse au format JSON pour éviter les erreurs de parsing
    response_format: { type: "json_object" },
  });

  const response = completion.choices[0]?.message?.content || "{}";

  try {
    const brut = JSON.parse(response) as {
      diagnostic?: unknown;
      confiance?: unknown;
      recommandation?: unknown;
      urgence?: unknown;
    };

    const urgence = normaliserUrgence(brut.urgence);
    const confiance = normaliserConfiance(brut.confiance, urgence, symptomes.length);

    return {
      diagnostic:
        typeof brut.diagnostic === "string" && brut.diagnostic.trim().length > 0
          ? brut.diagnostic.trim()
          : "Pré-diagnostic non disponible.",
      confiance,
      recommandation:
        typeof brut.recommandation === "string" && brut.recommandation.trim().length > 0
          ? brut.recommandation.trim()
          : "Consultez un professionnel de santé pour confirmation.",
      urgence,
    };
  } catch (error) {
    return {
      diagnostic: "Erreur lors de l'analyse des données.",
      confiance: 0,
      recommandation: "Veuillez consulter immédiatement un professionnel de santé.",
      urgence: "moyen",
    };
  }
}
