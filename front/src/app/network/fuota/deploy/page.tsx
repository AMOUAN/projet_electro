'use client';

import DashboardLayout from '@/components/DashboardLayout';

export default function FUOTADeployPage() {
  return (
    <DashboardLayout title="Déploiement FUOTA" userRole="super-admin">
      <div className="space-y-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Nouveau Déploiement FUOTA</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fichier firmware</label>
              <input
                type="file"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dispositifs cibles</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500">
                <option>Tous les dispositifs</option>
                <option>Groupe spécifique</option>
              </select>
            </div>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">
              Lancer le déploiement
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

