'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { apiClient } from '@/lib/api/client';

export default function FramesPage() {
  const [frames, setFrames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFrames = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getFrames(100);
        setFrames(data);
      } catch (error) {
        console.error('Error fetching frames:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFrames();
    const interval = setInterval(fetchFrames, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Liste Globale des Trames" userRole="super-admin">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Chargement...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Liste Globale des Trames" userRole="super-admin">
      <div className="space-y-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Trames Récentes</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Dispositif</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Timestamp</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Taille</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">RSSI</th>
                </tr>
              </thead>
              <tbody>
                {frames.map((frame) => (
                  <tr key={frame.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{frame.device?.name || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          frame.type === 'uplink'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {frame.type === 'uplink' ? 'Uplink' : 'Downlink'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">{new Date(frame.timestamp).toLocaleString('fr-FR')}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{frame.size} bytes</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{frame.rssi ? `${frame.rssi} dBm` : '-'}</td>
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

