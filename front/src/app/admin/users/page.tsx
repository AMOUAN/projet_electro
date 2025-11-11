'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { apiClient } from '@/lib/api/client';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Utilisateurs" userRole="super-admin">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Chargement...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Utilisateurs" userRole="super-admin">
      <div className="space-y-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gestion des Utilisateurs</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Nom</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Entreprise</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Rôle</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Statut</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{user.email}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{user.company?.name || 'N/A'}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{user.role?.name || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          user.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {user.status === 'ACTIVE' ? 'Actif' : user.status === 'PENDING' ? 'En attente' : user.status}
                      </span>
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

