'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [animatedStats, setAnimatedStats] = useState({
    totalDevices: 0,
    activeDevices: 0,
    gateways: 0,
    activeGateways: 0,
    dataPoints: 0,
    uptime: 0,
  });
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    const animateValue = (start: number, end: number, duration: number, key: keyof typeof animatedStats) => {
      const startTime = Date.now();
      const animate = () => {
        const currentTime = Date.now();
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(start + (end - start) * easeOutQuart);
        
        setAnimatedStats(prev => ({ ...prev, [key]: currentValue }));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    };

    if (!loading) {
      animateValue(0, stats.totalDevices, 1500, 'totalDevices');
      animateValue(0, stats.activeDevices, 1500, 'activeDevices');
      animateValue(0, stats.gateways, 1500, 'gateways');
      animateValue(0, stats.activeGateways, 1500, 'activeGateways');
      animateValue(0, stats.dataPoints, 1500, 'dataPoints');
      animateValue(0, stats.uptime, 1500, 'uptime');
    }
  }, [stats, loading]);

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
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-500"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="ml-4 text-gray-600 animate-pulse">Chargement...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Tableau de Bord">
      <div className="space-y-6">
        {/* Header avec temps réel */}
        <div className="flex items-center justify-between animate-on-scroll opacity-0">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Monitoring Temps Réel</h2>
            <p className="text-gray-600 mt-1">Vue d'ensemble de votre infrastructure LoRaWAN</p>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:scale-105">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">
              {currentTime.toLocaleTimeString('fr-FR')}
            </span>
          </div>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50 hover:shadow-lg transition-all duration-500 hover:scale-105 hover:border-blue-300 animate-on-scroll opacity-0">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1 group-hover:text-blue-600 transition-colors duration-300">Dispositifs Totaux</p>
            <p className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{animatedStats.totalDevices.toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-2 group-hover:text-green-700 transition-colors duration-300">
              <span className="font-medium">{animatedStats.activeDevices}</span> actifs
            </p>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50 hover:shadow-lg transition-all duration-500 hover:scale-105 hover:border-indigo-300 animate-on-scroll opacity-0">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1 group-hover:text-indigo-600 transition-colors duration-300">Passerelles</p>
            <p className="text-3xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">{animatedStats.gateways}</p>
            <p className="text-xs text-green-600 mt-2 group-hover:text-green-700 transition-colors duration-300">
              <span className="font-medium">{animatedStats.activeGateways}</span> opérationnelles
            </p>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50 hover:shadow-lg transition-all duration-500 hover:scale-105 hover:border-purple-300 animate-on-scroll opacity-0">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1 group-hover:text-purple-600 transition-colors duration-300">Points de Données</p>
            <p className="text-3xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">{animatedStats.dataPoints.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2 group-hover:text-gray-600 transition-colors duration-300">Aujourd'hui</p>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50 hover:shadow-lg transition-all duration-500 hover:scale-105 hover:border-green-300 animate-on-scroll opacity-0">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1 group-hover:text-green-600 transition-colors duration-300">Uptime</p>
            <p className="text-3xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300">{animatedStats.uptime}%</p>
            <p className="text-xs text-green-600 mt-2 group-hover:text-green-700 transition-colors duration-300">Système stable</p>
          </div>
        </div>

        {/* Graphiques et activité */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Graphique de statut des dispositifs */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50 hover:shadow-lg transition-all duration-500 animate-on-scroll opacity-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statut des Dispositifs</h3>
            <div className="space-y-4">
              {deviceStatus.map((status, index) => (
                <div key={status.label} className="animate-on-scroll opacity-0" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-300">{status.label}</span>
                    <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{status.value}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full ${status.color} rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
                      style={{ width: `${status.percentage}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activité récente */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50 hover:shadow-lg transition-all duration-500 animate-on-scroll opacity-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité Récente</h3>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div
                  key={activity.id}
                  className="group p-3 rounded-xl bg-gray-50 border border-gray-200/50 hover:bg-gray-100 hover:shadow-md transition-all duration-300 hover:scale-105 animate-on-scroll opacity-0"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors duration-300">{activity.device}</p>
                      <p className="text-xs text-gray-600 mt-1 group-hover:text-gray-700 transition-colors duration-300">{activity.action}</p>
                    </div>
                    <div className="ml-2 flex-shrink-0">
                      <div
                        className={`w-2 h-2 rounded-full transition-all duration-300 group-hover:scale-125 ${
                          activity.status === 'success'
                            ? 'bg-green-500 group-hover:bg-green-600'
                            : activity.status === 'warning'
                            ? 'bg-yellow-500 group-hover:bg-yellow-600'
                            : 'bg-red-500 group-hover:bg-red-600'
                        }`}
                      ></div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 group-hover:text-gray-600 transition-colors duration-300">{activity.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Graphique de données (simulé) */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50 hover:shadow-lg transition-all duration-500 animate-on-scroll opacity-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Flux de Données (24h)</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {Array.from({ length: 24 }).map((_, i) => {
              const height = Math.random() * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center group">
                  <div
                    className="w-full bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-lg transition-all duration-500 hover:opacity-80 hover:scale-105 cursor-pointer animate-on-scroll opacity-0"
                    style={{ 
                      height: `${height}%`,
                      animationDelay: `${i * 0.05}s`
                    }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2 group-hover:text-gray-700 transition-colors duration-300">{i}h</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-on-scroll.animate-visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </DashboardLayout>
  );
}

