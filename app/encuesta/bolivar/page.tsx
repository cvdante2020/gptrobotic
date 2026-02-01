import EncuestaBolivar from "./encuesta";

export default function Page() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-10 text-white">
      <h1 className="text-3xl font-bold mb-3">Encuesta Alcaldía – Bolívar</h1>
      <p className="text-gray-300 mb-6">
        Anónima. No solicitamos datos personales. Toma 1–2 minutos.
      </p>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <EncuestaBolivar />
      </div>
    </main>
  );
}
