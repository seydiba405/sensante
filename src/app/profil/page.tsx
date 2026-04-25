export default function ProfilPage() {
  return (
    <div className="p-8">
      {/* Titre de la page avec correction de l'espacement */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Mon profil
      </h1>

      {/* Carte de profil avec ombres et bordures nettes */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 max-w-md">
        <div className="space-y-4">
          
          <div className="flex flex-col border-b border-gray-50 pb-3">
            <span className="text-sm text-gray-400 uppercase font-semibold">Nom</span>
            <span className="text-lg text-gray-800 font-medium">Moussa Diop</span>
          </div>

          <div className="flex flex-col border-b border-gray-50 pb-3">
            <span className="text-sm text-gray-400 uppercase font-semibold">Rôle</span>
            <span className="text-lg text-gray-800 font-medium">Agent de santé</span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-gray-400 uppercase font-semibold">Région</span>
            <span className="text-lg text-gray-800 font-medium">Dakar</span>
          </div>

        </div>
      </div>
    </div>
  );
}
