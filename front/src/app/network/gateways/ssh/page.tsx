'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { apiClient } from '@/lib/api/client';

export default function GatewaySSHPage() {
  const [gateways, setGateways] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGateways = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getGateways();
        setGateways(data);
      } catch (error) {
        console.error('Error fetching gateways:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGateways();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Accès SSH aux Passerelles" userRole="super-admin">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Chargement...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Accès SSH aux Passerelles" userRole="super-admin">
      <div className="space-y-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Liste des Passerelles</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Passerelle</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Adresse IP</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Statut</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Dernier accès</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {gateways.map((gateway) => (
                  <tr key={gateway.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{gateway.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-700 font-mono">{gateway.ip}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          gateway.status === 'online'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {gateway.status === 'online' ? 'En ligne' : 'Hors ligne'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">{gateway.lastSeen ? new Date(gateway.lastSeen).toLocaleString('fr-FR') : 'Jamais'}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end">
                        <button
                          disabled={gateway.status === 'offline'}
                          className="px-3 py-1 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Se connecter
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

