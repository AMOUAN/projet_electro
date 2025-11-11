'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { apiClient } from '@/lib/api/client';

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKeyName, setNewKeyName] = useState('');

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getApiKeys();
        setKeys(data);
      } catch (error) {
        console.error('Error fetching API keys:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKeys();
  }, []);

  const handleCreateKey = async () => {
    if (!newKeyName) return;
    try {
      const newKey = await apiClient.createApiKey(newKeyName);
      setKeys([newKey, ...keys]);
      setNewKeyName('');
    } catch (error) {
      console.error('Error creating API key:', error);
    }
  };

  const handleDeleteKey = async (id: string) => {
    try {
      await apiClient.deleteApiKey(id);
      setKeys(keys.filter(k => k.id !== id));
    } catch (error) {
      console.error('Error deleting API key:', error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Clés API" userRole="super-admin">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Chargement...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Clés API" userRole="super-admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-gray-600">Gérez vos clés API pour l'accès programmatique</p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="Nom de la clé"
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleCreateKey}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            >
              Générer une clé
            </button>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
          <div className="space-y-4">
            {keys.map((apiKey) => (
              <div key={apiKey.id} className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{apiKey.name}</p>
                    <p className="text-sm text-gray-600 mt-1 font-mono">{apiKey.key}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Créée le {new Date(apiKey.createdAt).toLocaleDateString('fr-FR')} • Dernière utilisation: {apiKey.lastUsed ? new Date(apiKey.lastUsed).toLocaleDateString('fr-FR') : 'Jamais'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      {apiKey.status}
                    </span>
                    <button
                      onClick={() => handleDeleteKey(apiKey.id)}
                      className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

