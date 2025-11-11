'use client';

import DashboardLayout from '@/components/DashboardLayout';

export default function FUOTATrackingPage() {
  const deployments = [
    { id: 1, name: 'Firmware v2.1.0', devices: 245, completed: 230, status: 'in-progress', started: '2024-11-10 10:00' },
    { id: 2, name: 'Firmware v2.0.5', devices: 156, completed: 156, status: 'completed', started: '2024-11-08 14:00' },
    { id: 3, name: 'Firmware v1.9.2', devices: 89, completed: 85, status: 'failed', started: '2024-11-05 09:00' },
  ];

  return (
    <DashboardLayout title="Suivi FUOTA" userRole="super-admin">
      <div className="space-y-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Déploiements en Cours</h3>
          <div className="space-y-4">
            {deployments.map((deployment) => (
              <div key={deployment.id} className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium text-gray-900">{deployment.name}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {deployment.completed}/{deployment.devices} dispositifs • Démarré le {deployment.started}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      deployment.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : deployment.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {deployment.status === 'completed'
                      ? 'Terminé'
                      : deployment.status === 'in-progress'
                      ? 'En cours'
                      : 'Échoué'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      deployment.status === 'completed'
                        ? 'bg-green-500'
                        : deployment.status === 'in-progress'
                        ? 'bg-blue-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${(deployment.completed / deployment.devices) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

