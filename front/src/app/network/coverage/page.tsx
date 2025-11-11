'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { apiClient } from '@/lib/api/client';

export default function CoverageAnalysisPage() {
  const [coverageData, setCoverageData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoverage = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getCoverageAnalysis();
        setCoverageData(data);
      } catch (error) {
        console.error('Error fetching coverage:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoverage();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Analyse de Couverture Réseau" userRole="super-admin">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Chargement...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Analyse de Couverture Réseau" userRole="super-admin">
      <div className="space-y-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Couverture par Région</h3>
          <div className="space-y-4">
            {coverageData.map((region) => (
              <div key={region.region}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{region.region}</p>
                    <p className="text-sm text-gray-600">{region.gateways} passerelles • {region.devices} dispositifs</p>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{region.coverage}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      region.coverage >= 90
                        ? 'bg-green-500'
                        : region.coverage >= 80
                        ? 'bg-yellow-500'
                        : 'bg-orange-500'
                    }`}
                    style={{ width: `${region.coverage}%` }}
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

