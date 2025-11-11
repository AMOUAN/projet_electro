'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { apiClient } from '@/lib/api/client';

export default function NetworkHealthPage() {
  const [networkStats, setNetworkStats] = useState({
    totalGateways: 0,
    activeGateways: 0,
    totalDevices: 0,
    activeDevices: 0,
    coverage: 0,
    avgLatency: 0,
    packetLoss: 0,
  });
  const [gatewayHealth, setGatewayHealth] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [stats, health] = await Promise.all([
          apiClient.getNetworkHealth(),
          apiClient.getGatewayHealth(),
        ]);
        setNetworkStats(stats);
        setGatewayHealth(health);
      } catch (error) {
        console.error('Error fetching network health:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Santé Globale du Réseau" userRole="super-admin">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Chargement...</div>
        </div>
      </DashboardLayout>
    );
  }

  const alerts = [
    { id: 1, type: 'warning', message: `${gatewayHealth.filter(g => g.latency > 300).length} passerelles avec latence élevée`, count: gatewayHealth.filter(g => g.latency > 300).length },
    { id: 2, type: 'error', message: `${gatewayHealth.filter(g => g.status === 'offline').length} passerelle(s) hors ligne`, count: gatewayHealth.filter(g => g.status === 'offline').length },
  ];

  return (
    <DashboardLayout title="Santé Globale du Réseau" userRole="super-admin">
      <div className="space-y-6">
        {/* Alertes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border ${
                alert.type === 'error'
                  ? 'bg-red-50 border-red-200'
                  : alert.type === 'warning'
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                  <p className="text-xs text-gray-600 mt-1">{alert.count} élément(s)</p>
                </div>
                <div
                  className={`w-3 h-3 rounded-full ${
                    alert.type === 'error'
                      ? 'bg-red-500'
                      : alert.type === 'warning'
                      ? 'bg-yellow-500'
                      : 'bg-blue-500'
                  } animate-pulse`}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
            <p className="text-sm font-medium text-gray-600 mb-2">Passerelles</p>
            <p className="text-3xl font-bold text-gray-900">
              {networkStats.activeGateways}/{networkStats.totalGateways}
            </p>
            <p className="text-xs text-green-600 mt-2">Actives</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
            <p className="text-sm font-medium text-gray-600 mb-2">Dispositifs</p>
            <p className="text-3xl font-bold text-gray-900">
              {networkStats.activeDevices.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-2">Sur {networkStats.totalDevices.toLocaleString()}</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
            <p className="text-sm font-medium text-gray-600 mb-2">Couverture</p>
            <p className="text-3xl font-bold text-gray-900">{networkStats.coverage}%</p>
            <p className="text-xs text-green-600 mt-2">Excellente</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
            <p className="text-sm font-medium text-gray-600 mb-2">Latence Moyenne</p>
            <p className="text-3xl font-bold text-gray-900">{networkStats.avgLatency}ms</p>
            <p className="text-xs text-green-600 mt-2">Optimale</p>
          </div>
        </div>

        {/* Santé des passerelles */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Santé des Passerelles</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Passerelle</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Statut</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Uptime</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Latence</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Dispositifs</th>
                </tr>
              </thead>
              <tbody>
                {gatewayHealth.map((gateway) => (
                  <tr key={gateway.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{gateway.name}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          gateway.status === 'online'
                            ? 'bg-green-100 text-green-800'
                            : gateway.latency > 300
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {gateway.status === 'online' ? 'Sain' : gateway.status === 'offline' ? 'Hors ligne' : 'Alerte'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">{gateway.uptime?.toFixed(1) || 0}%</td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {gateway.latency > 0 ? `${gateway.latency}ms` : '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">{gateway._count?.frames || 0}</td>
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

