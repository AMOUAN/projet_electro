'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { apiClient } from '@/lib/api/client';

export default function ContractsPage() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getContracts();
        setContracts(data);
      } catch (error) {
        console.error('Error fetching contracts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Contrats" userRole="super-admin">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Chargement...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Contrats" userRole="super-admin">
      <div className="space-y-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gestion des Contrats</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Entreprise</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date début</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date fin</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Statut</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Jours restants</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((contract) => (
                  <tr key={contract.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{contract.company?.name || 'N/A'}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{new Date(contract.startDate).toLocaleDateString('fr-FR')}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{new Date(contract.endDate).toLocaleDateString('fr-FR')}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          contract.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : contract.status === 'expiring'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {contract.status === 'active' ? 'Actif' : contract.status === 'expiring' ? 'Expiration proche' : 'Expiré'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">{contract.daysLeft} jours</td>
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

