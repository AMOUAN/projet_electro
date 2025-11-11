'use client';

import DashboardLayout from '@/components/DashboardLayout';

export default function NetworkMapPage() {
  return (
    <DashboardLayout title="Cartographie du Réseau" userRole="super-admin">
      <div className="space-y-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Carte Interactive du Réseau</h3>
          <div className="h-96 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <p className="text-gray-600">Carte interactive du réseau</p>
              <p className="text-sm text-gray-500 mt-2">Visualisation des passerelles et dispositifs</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

