"use client";



export default function PlanesAutos() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto text-center">
      <h2 className="text-3xl font-bold text-blue-400 mb-10">Planes para Patios de Autos</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {/* Plan Auto Start */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-green-500">
          <h3 className="text-xl font-bold text-white mb-2">🚗 Plan Auto Start</h3>
          <p className="text-green-400 text-3xl font-bold mb-4">$49<span className="text-sm text-gray-300">/mes</span></p>
          <ul className="text-sm text-white space-y-2 mb-6 text-left">
            <li>✔ Chatbot de autos por WhatsApp</li>
            <li>✔ Hasta 50 vehículos cargados</li>
            <li>✔ Panel de control simple</li>
            <li>✔ Registro de interesados</li>
            <li>✔ Envio de promociones por WhatsApp</li>
          </ul>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full font-bold transition">Elegir plan</button>
        </div>

        {/* Plan Concesionario Pro */}
        <div className="bg-yellow-600 p-6 rounded-xl shadow-lg border-4 border-yellow-300 transform scale-105">
          <h3 className="text-xl font-bold text-black mb-2">🏁 Plan Concesionario Pro</h3>
          <p className="text-black text-3xl font-bold mb-4">$69<span className="text-sm">/mes</span></p>
          <ul className="text-sm text-black space-y-2 mb-6 text-left">
             <li>✔ 1 Bot personalizado</li>
            <li>✔ Hasta 100 vehículos</li>
            <li>✔ Negociación automática por precio mínimo</li>
            <li>✔ Gestión de fotos y descripciones</li>
            <li>✔ Dashboard de estadísticas</li>
                  <li>✔ Envio de promociones por WhatsApp</li>
          </ul>
          <button className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded w-full font-bold transition">Recomendado</button>
        </div>

        {/* Plan Full Dealership */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-green-500">
          <h3 className="text-xl font-bold text-white mb-2">🛠️ Plan Full Dealership</h3>
          <p className="text-green-400 text-3xl font-bold mb-4">Desde $99<span className="text-sm text-gray-300">/mes</span></p>
          <ul className="text-sm text-white space-y-2 mb-6 text-left">
             <li>✔ 1 Bot personalizado</li>
            <li>✔ Vehículos ilimitados</li>
            <li>✔ Integración con CRM externo</li>
            <li>✔ Campañas automatizadas</li>
            <li>✔ Soporte dedicado + carga masiva</li>
                  <li>✔ Envio de promociones por WhatsApp</li>
          </ul>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full font-bold transition">Solicitar demo</button>
        </div>
      </div>
    </section>
  );
}
