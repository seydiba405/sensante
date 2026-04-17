export default function PatientCard() {
  const nom = "Ndeye Tening SENE";
  const role = "Medecin";
  const groupe = 3;

  return (
    // Fixed spaces in class names (e.g., "rounded-lg" instead of "rounded -lg")
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-teal-500 max-w-sm">
      <h3 className="text-xl font-bold text-gray-800">
        {nom}
      </h3>
      <p className="text-gray-600 mt-1">
        <span className="font-semibold">Rôle :</span> {role}
      </p>
      <p className="text-gray-500 text-sm mt-1">
        Groupe : {groupe}
      </p>
    </div>
  );
}
