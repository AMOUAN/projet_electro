'use client';

import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { apiClient } from '@/lib/api/client';

export default function GatewayStatsPage() {
  const [gateways, setGateways] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [animatedStats, setAnimatedStats] = useState<{[key: string]: number}>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

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
    const animateValue = (start: number, end: number, duration: number, key: string) => {
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

    if (!loading && gateways.length > 0) {
      gateways.forEach((gateway, index) => {
        setTimeout(() => {
          animateValue(0, gateway.packets, 1500, `${gateway.id}-packets`);
          animateValue(0, gateway.uptime, 1500, `${gateway.id}-uptime`);
          animateValue(0, gateway.latency, 1500, `${gateway.id}-latency`);
          animateValue(0, gateway.errors, 1500, `${gateway.id}-errors`);
        }, index * 200);
      });
    }
  }, [gateways, loading]);

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
    <DashboardLayout title="Statistiques Détaillées des Passerelles" userRole="super-admin">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {gateways.map((gateway, index) => (
            <div
              key={gateway.id}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50 hover:shadow-lg transition-all duration-500 hover:scale-105 hover:border-blue-300 animate-on-scroll opacity-0"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">{gateway.name}</h3>
              <div className="space-y-4">
                <div className="group/item">
                  <p className="text-sm text-gray-600 group-hover/item:text-gray-700 transition-colors duration-300">Paquets traités</p>
                  <p className="text-2xl font-bold text-gray-900 group-hover/item:text-blue-600 transition-colors duration-300">
                    {animatedStats[`${gateway.id}-packets`]?.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="group/item">
                  <p className="text-sm text-gray-600 group-hover/item:text-gray-700 transition-colors duration-300">Uptime</p>
                  <p className="text-2xl font-bold text-gray-900 group-hover/item:text-green-600 transition-colors duration-300">
                    {animatedStats[`${gateway.id}-uptime`] || '0'}%
                  </p>
                </div>
                <div className="group/item">
                  <p className="text-sm text-gray-600 group-hover/item:text-gray-700 transition-colors duration-300">Latence moyenne</p>
                  <p className="text-2xl font-bold text-gray-900 group-hover/item:text-orange-600 transition-colors duration-300">
                    {animatedStats[`${gateway.id}-latency`] || '0'}ms
                  </p>
                </div>
                <div className="group/item">
                  <p className="text-sm text-gray-600 group-hover/item:text-gray-700 transition-colors duration-300">Erreurs</p>
                  <p className="text-2xl font-bold text-red-600 group-hover/item:text-red-700 transition-colors duration-300">
                    {animatedStats[`${gateway.id}-errors`] || '0'}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Statut</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse group-hover:scale-125 transition-transform duration-300"></div>
                    <span className="text-xs text-green-600 group-hover:text-green-700 transition-colors duration-300">En ligne</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
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

