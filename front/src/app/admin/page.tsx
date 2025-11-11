'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { apiClient } from '@/lib/api/client';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingUsers: 0,
    totalCompanies: 0,
    totalApplications: 0,
    totalContracts: 0,
    activeApiKeys: 0,
    totalRoles: 0,
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
        const [users, companies, applications, contracts, apiKeys, roles] = await Promise.all([
          apiClient.getUsers().catch(() => []),
          apiClient.getCompanies().catch(() => []),
          apiClient.getApplications().catch(() => []),
          apiClient.getContracts().catch(() => []),
          apiClient.getApiKeys().catch(() => []),
          apiClient.getRoles().catch(() => []),
        ]);

        // Calculer les statistiques
        const activeUsers = users.filter((u: any) => u.status === 'ACTIVE').length;
        const pendingUsers = users.filter((u: any) => u.status === 'PENDING').length;

        setStats({
          totalUsers: users.length,
          activeUsers,
          pendingUsers,
          totalCompanies: companies.length,
          totalApplications: applications.length,
          totalContracts: contracts.length,
          activeApiKeys: apiKeys.length,
          totalRoles: roles.length,
        });

        // Utilisateurs récents (5 derniers)
        setRecentUsers(
          users
            .slice(0, 5)
            .map((user: any) => ({
              id: user.id,
              name: `${user.firstName} ${user.lastName}`,
              email: user.email,
              company: user.company?.name || 'N/A',
              status: user.status,
              createdAt: user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'N/A',
            }))
        );
      } catch (error: any) {
        console.error('Error fetching admin dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Tableau de Bord Admin" userRole="super-admin">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Chargement...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Tableau de Bord Admin" userRole="super-admin">
      <div className="space-y-6">
        {/* Header avec temps réel */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Administration</h2>
            <p className="text-gray-600 mt-1">Vue d'ensemble de la plateforme</p>
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
          {/* Utilisateurs */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/admin/users')}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Utilisateurs</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-green-600">
                <span className="font-medium">{stats.activeUsers}</span> actifs
              </p>
              {stats.pendingUsers > 0 && (
                <p className="text-xs text-yellow-600">
                  <span className="font-medium">{stats.pendingUsers}</span> en attente
                </p>
              )}
            </div>
          </div>

          {/* Entreprises */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/admin/companies')}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Entreprises</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalCompanies}</p>
            <p className="text-xs text-gray-500 mt-2">Organisations</p>
          </div>

          {/* Applications */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/admin/applications')}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Applications</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalApplications}</p>
            <p className="text-xs text-gray-500 mt-2">Applications LoRaWAN</p>
          </div>

          {/* Contrats */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/admin/contracts')}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Contrats</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalContracts}</p>
            <p className="text-xs text-gray-500 mt-2">Contrats actifs</p>
          </div>
        </div>

        {/* Statistiques secondaires */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Clés API */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/admin/api-keys')}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Clés API</p>
            <p className="text-2xl font-bold text-gray-900">{stats.activeApiKeys}</p>
            <p className="text-xs text-gray-500 mt-2">Clés actives</p>
          </div>

          {/* Rôles */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push('/admin/roles')}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Rôles</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalRoles}</p>
            <p className="text-xs text-gray-500 mt-2">Rôles définis</p>
          </div>

          {/* Utilisateurs en attente */}
          <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50 hover:shadow-md transition-shadow ${stats.pendingUsers > 0 ? 'cursor-pointer border-yellow-300' : ''}`} onClick={() => stats.pendingUsers > 0 && router.push('/admin/users')}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stats.pendingUsers > 0 ? 'from-yellow-100 to-yellow-200' : 'from-gray-100 to-gray-200'} flex items-center justify-center`}>
                <svg className={`w-6 h-6 ${stats.pendingUsers > 0 ? 'text-yellow-600' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">En attente</p>
            <p className="text-2xl font-bold text-gray-900">{stats.pendingUsers}</p>
            <p className={`text-xs mt-2 ${stats.pendingUsers > 0 ? 'text-yellow-600 font-medium' : 'text-gray-500'}`}>
              {stats.pendingUsers > 0 ? 'Nécessite attention' : 'Aucune demande'}
            </p>
          </div>
        </div>

        {/* Graphiques et activité */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Graphique de répartition des utilisateurs */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition des Utilisateurs</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Utilisateurs actifs</span>
                  <span className="text-sm font-semibold text-gray-900">{stats.activeUsers}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${stats.totalUsers > 0 ? (stats.activeUsers / stats.totalUsers) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">En attente d'activation</span>
                  <span className="text-sm font-semibold text-gray-900">{stats.pendingUsers}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                    style={{ width: `${stats.totalUsers > 0 ? (stats.pendingUsers / stats.totalUsers) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Inactifs</span>
                  <span className="text-sm font-semibold text-gray-900">{stats.totalUsers - stats.activeUsers - stats.pendingUsers}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gray-400 rounded-full transition-all duration-500"
                    style={{ width: `${stats.totalUsers > 0 ? ((stats.totalUsers - stats.activeUsers - stats.pendingUsers) / stats.totalUsers) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Utilisateurs récents */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Utilisateurs Récents</h3>
            <div className="space-y-3">
              {recentUsers.length > 0 ? (
                recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="p-3 rounded-xl bg-gray-50 border border-gray-200/50 hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => router.push('/admin/users')}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-600 mt-1 truncate">{user.email}</p>
                        <p className="text-xs text-gray-500 mt-1">{user.company}</p>
                      </div>
                      <div className="ml-2 flex-shrink-0">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-800'
                              : user.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {user.status === 'ACTIVE' ? 'Actif' : user.status === 'PENDING' ? 'En attente' : user.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Créé le {user.createdAt}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">Aucun utilisateur récent</div>
              )}
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => router.push('/admin/users')}
              className="p-4 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="text-sm font-medium text-gray-900">Gérer les utilisateurs</span>
              </div>
            </button>
            <button
              onClick={() => router.push('/admin/companies')}
              className="p-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="text-sm font-medium text-gray-900">Gérer les entreprises</span>
              </div>
            </button>
            <button
              onClick={() => router.push('/admin/api-keys')}
              className="p-4 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <span className="text-sm font-medium text-gray-900">Gérer les clés API</span>
              </div>
            </button>
            <button
              onClick={() => router.push('/admin/settings')}
              className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm font-medium text-gray-900">Paramètres</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

