'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { apiClient } from '@/lib/api/client';

export default function GatewayStatsPage() {
  const [gateways, setGateways] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGateways = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getGateways();
        const statsPromises = data.map((gw: any) => apiClient.getGatewayStats(gw.id));
        const stats = await Promise.all(statsPromises);
        setGateways(stats.filter(Boolean));
      } catch (error) {
        console.error('Error fetching gateway stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGateways();
    const interval = setInterval(fetchGateways, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Statistiques Détaillées des Passerelles" userRole="super-admin">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Chargement...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Statistiques Détaillées des Passerelles" userRole="super-admin">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {gateways.map((gateway) => (
            <div
              key={gateway.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{gateway.name}</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Paquets traités</p>
                  <p className="text-2xl font-bold text-gray-900">{gateway.packets.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Uptime</p>
                  <p className="text-2xl font-bold text-gray-900">{gateway.uptime}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Latence moyenne</p>
                  <p className="text-2xl font-bold text-gray-900">{gateway.latency}ms</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Erreurs</p>
                  <p className="text-2xl font-bold text-red-600">{gateway.errors}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

