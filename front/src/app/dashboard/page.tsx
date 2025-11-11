'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { apiClient } from '@/lib/api/client';

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    totalDevices: 0,
    activeDevices: 0,
    gateways: 0,
    activeGateways: 0,
    dataPoints: 0,
    uptime: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, activityData] = await Promise.all([
          apiClient.getDashboardStats(),
          apiClient.getRecentActivity(10),
        ]);
        setStats(statsData);
        if (Array.isArray(activityData) && activityData.length > 0) {
          setRecentActivity(activityData.map((item: any) => ({
            id: item.id,
            device: item.device?.name || 'Dispositif inconnu',
            action: item.type === 'uplink' ? 'Données reçues' : 'Commande envoyée',
            time: new Date(item.timestamp).toLocaleString('fr-FR'),
            status: 'success',
          })));
        } else {
          // Données de démonstration si aucune activité
          setRecentActivity([]);
        }
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        // En cas d'erreur 404, afficher un message informatif
        if (error.response?.status === 404) {
          console.warn('Backend endpoint not found. Make sure the backend is running and migrations are applied.');
        }
        // En cas d'erreur, on garde les valeurs par défaut
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const deviceStatus = [
    { label: 'En ligne', value: stats.activeDevices, color: 'bg-green-500', percentage: stats.totalDevices > 0 ? (stats.activeDevices / stats.totalDevices) * 100 : 0 },
    { label: 'Hors ligne', value: stats.totalDevices - stats.activeDevices, color: 'bg-gray-400', percentage: stats.totalDevices > 0 ? ((stats.totalDevices - stats.activeDevices) / stats.totalDevices) * 100 : 0 },
  ];

  if (loading) {
    return (
      <DashboardLayout title="Tableau de Bord">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Chargement...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Tableau de Bord">
      <div className="space-y-6">
        {/* Header avec temps réel */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Monitoring Temps Réel</h2>
            <p className="text-gray-600 mt-1">Vue d'ensemble de votre infrastructure LoRaWAN</p>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">
              {currentTime.toLocaleTimeString('fr-FR')}
            </span>
          </div>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Dispositifs Totaux</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalDevices.toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-2">
              <span className="font-medium">{stats.activeDevices}</span> actifs
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Passerelles</p>
            <p className="text-3xl font-bold text-gray-900">{stats.gateways}</p>
            <p className="text-xs text-green-600 mt-2">
              <span className="font-medium">{stats.activeGateways}</span> opérationnelles
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Points de Données</p>
            <p className="text-3xl font-bold text-gray-900">{stats.dataPoints.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2">Aujourd'hui</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Uptime</p>
            <p className="text-3xl font-bold text-gray-900">{stats.uptime}%</p>
            <p className="text-xs text-green-600 mt-2">Système stable</p>
          </div>
        </div>

        {/* Graphiques et activité */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Graphique de statut des dispositifs */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statut des Dispositifs</h3>
            <div className="space-y-4">
              {deviceStatus.map((status) => (
                <div key={status.label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{status.label}</span>
                    <span className="text-sm font-semibold text-gray-900">{status.value}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full ${status.color} rounded-full transition-all duration-500`}
                      style={{ width: `${status.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activité récente */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité Récente</h3>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="p-3 rounded-xl bg-gray-50 border border-gray-200/50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{activity.device}</p>
                      <p className="text-xs text-gray-600 mt-1">{activity.action}</p>
                    </div>
                    <div className="ml-2 flex-shrink-0">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          activity.status === 'success'
                            ? 'bg-green-500'
                            : activity.status === 'warning'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                      ></div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{activity.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Graphique de données (simulé) */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Flux de Données (24h)</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {Array.from({ length: 24 }).map((_, i) => {
              const height = Math.random() * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-lg transition-all duration-300 hover:opacity-80"
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2">{i}h</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

