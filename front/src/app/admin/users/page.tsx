'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { apiClient } from '@/lib/api/client';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal, { ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal';
import Avatar from '@/components/ui/Avatar';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  role?: { name: string };
  company?: { name: string };
  createdAt: string;
  phone?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  
  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || '',
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    
    try {
      await apiClient.updateUser(selectedUser.id, editFormData);
      setShowEditModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Erreur lors de la mise à jour de l\'utilisateur');
    }
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      await apiClient.deleteUser(selectedUser.id);
      setShowDeleteModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Erreur lors de la suppression de l\'utilisateur');
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      if (user.status === 'ACTIVE') {
        await apiClient.deactivateUser(user.id);
      } else {
        await apiClient.activateUser(user.id);
      }
      fetchUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
      alert('Erreur lors du changement de statut');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Filtrer les utilisateurs
  const filteredUsers = users.filter((user) => {
    // Filtre de recherche (nom, email, entreprise)
    const matchesSearch = 
      searchTerm === '' ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.company?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtre de statut
    const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter;
    
    // Filtre de rôle
    const matchesRole = roleFilter === 'ALL' || user.role?.name === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Obtenir les rôles uniques pour le filtre
  const uniqueRoles = Array.from(new Set(users.map(u => u.role?.name).filter(Boolean)));

  // Réinitialiser les filtres
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setRoleFilter('ALL');
  };

  if (loading) {
    return (
      <DashboardLayout title="Utilisateurs" userRole="super-admin">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Utilisateurs" userRole="super-admin">
      <div className="space-y-6">
        {/* Filtres */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Filtres de recherche</h3>
              <p className="text-sm text-gray-500 mt-1">Affinez votre recherche d'utilisateurs</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              }
            >
              Réinitialiser
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Rechercher"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nom, email, entreprise..."
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />

            <Select
              label="Statut"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">Tous les statuts</option>
              <option value="ACTIVE">Actif</option>
              <option value="PENDING">En attente</option>
              <option value="INACTIVE">Inactif</option>
              <option value="REJECTED">Rejeté</option>
            </Select>

            <Select
              label="Rôle"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="ALL">Tous les rôles</option>
              {uniqueRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </Select>
          </div>

          <div className="mt-6 flex items-center justify-between px-4 py-3 bg-[#F0F8FF] rounded-xl">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-[#95C5F0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''} trouvé{filteredUsers.length > 1 ? 's' : ''}
              </span>
            </div>
            {(searchTerm || statusFilter !== 'ALL' || roleFilter !== 'ALL') && (
              <Badge variant="primary" size="sm">
                Filtré sur {users.length}
              </Badge>
            )}
          </div>
        </Card>

        <Card padding="none">
          <div className="px-6 py-5 border-b border-[#E8F4FD]">
            <h3 className="text-lg font-semibold text-gray-900">Liste des utilisateurs</h3>
            <p className="text-sm text-gray-500 mt-1">Visualisez et gérez tous les utilisateurs de la plateforme</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E8F4FD] bg-[#F8FBFE]">
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Utilisateur</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Entreprise</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Rôle</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Statut</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="text-gray-600">Aucun utilisateur trouvé</p>
                      {(searchTerm || statusFilter !== 'ALL' || roleFilter !== 'ALL') && (
                        <button
                          onClick={resetFilters}
                          className="mt-2 text-sm text-indigo-600 hover:text-indigo-700"
                        >
                          Réinitialiser les filtres
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#F8FBFE] transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <Avatar 
                          initials={`${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`}
                          size="md"
                        />
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{user.firstName} {user.lastName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{user.email}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{user.company?.name || '-'}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{user.role?.name || '-'}</td>
                    <td className="py-4 px-6">
                      <Badge
                        variant={
                          user.status === 'ACTIVE' ? 'success' :
                          user.status === 'PENDING' ? 'warning' : 'danger'
                        }
                        size="sm"
                      >
                        {user.status === 'ACTIVE' ? 'Actif' : user.status === 'PENDING' ? 'En attente' : 'Inactif'}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1">
                        {/* Voir */}
                        <button
                          onClick={() => handleViewUser(user)}
                          className="p-2 text-[#95C5F0] hover:bg-[#F0F8FF] rounded-xl transition-all"
                          title="Voir les détails"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        
                        {/* Modifier */}
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 text-[#6BA5D8] hover:bg-[#F0F8FF] rounded-xl transition-all"
                          title="Modifier"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        
                        {/* Activer/Désactiver */}
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`p-2 rounded-xl transition-all ${
                            user.status === 'ACTIVE'
                              ? 'text-orange-500 hover:bg-orange-50'
                              : 'text-green-500 hover:bg-green-50'
                          }`}
                          title={user.status === 'ACTIVE' ? 'Désactiver' : 'Activer'}
                        >
                          {user.status === 'ACTIVE' ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </button>
                        
                        {/* Supprimer */}
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          title="Supprimer"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Modal Voir */}
      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} size="lg">
        {selectedUser && (
          <>
            <ModalHeader onClose={() => setShowViewModal(false)}>
              <h3 className="text-xl font-semibold text-gray-900">Détails de l'utilisateur</h3>
            </ModalHeader>
            
            <ModalBody>
              <div className="flex items-center space-x-4 mb-6 p-4 bg-[#F8FBFE] rounded-xl">
                <Avatar 
                  initials={`${selectedUser.firstName?.[0]}${selectedUser.lastName?.[0]}`}
                  size="xl"
                />
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">{selectedUser.firstName} {selectedUser.lastName}</h4>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <p className="text-sm text-gray-900">{selectedUser.firstName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <p className="text-sm text-gray-900">{selectedUser.lastName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-sm text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <p className="text-sm text-gray-900">{selectedUser.phone || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Entreprise</label>
                  <p className="text-sm text-gray-900">{selectedUser.company?.name || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                  <p className="text-sm text-gray-900">{selectedUser.role?.name || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <Badge
                    variant={
                      selectedUser.status === 'ACTIVE' ? 'success' :
                      selectedUser.status === 'PENDING' ? 'warning' : 'danger'
                    }
                  >
                    {selectedUser.status === 'ACTIVE' ? 'Actif' : selectedUser.status === 'PENDING' ? 'En attente' : 'Inactif'}
                  </Badge>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de création</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedUser.createdAt)}</p>
                </div>
              </div>
            </ModalBody>
            
            <ModalFooter>
              <Button
                variant="secondary"
                onClick={() => setShowViewModal(false)}
              >
                Fermer
              </Button>
            </ModalFooter>
          </>
        )}
      </Modal>

      {/* Modal Modifier */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} size="lg">
        {selectedUser && (
          <>
            <ModalHeader onClose={() => setShowEditModal(false)}>
              <h3 className="text-xl font-semibold text-gray-900">Modifier l'utilisateur</h3>
            </ModalHeader>
            
            <ModalBody>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Prénom"
                  required
                  type="text"
                  value={editFormData.firstName}
                  onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                />
                <Input
                  label="Nom"
                  required
                  type="text"
                  value={editFormData.lastName}
                  onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                />
                <Input
                  label="Email"
                  required
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                />
                <Input
                  label="Téléphone"
                  type="tel"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                />
              </div>
            </ModalBody>
            
            <ModalFooter>
              <Button
                variant="secondary"
                onClick={() => setShowEditModal(false)}
              >
                Annuler
              </Button>
              <Button
                variant="primary"
                onClick={handleUpdateUser}
              >
                Enregistrer
              </Button>
            </ModalFooter>
          </>
        )}
      </Modal>

      {/* Modal Supprimer */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} size="sm">
        {selectedUser && (
          <>
            <ModalHeader onClose={() => setShowDeleteModal(false)}>
              <h3 className="text-xl font-semibold text-gray-900">Confirmer la suppression</h3>
            </ModalHeader>
            
            <ModalBody>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-gray-700">
                    Êtes-vous sûr de vouloir supprimer l'utilisateur <strong className="font-semibold text-gray-900">{selectedUser.firstName} {selectedUser.lastName}</strong> ?
                  </p>
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-600 font-medium">⚠️ Cette action est irréversible.</p>
                  </div>
                </div>
              </div>
            </ModalBody>
            
            <ModalFooter>
              <Button
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Annuler
              </Button>
              <Button
                variant="danger"
                onClick={confirmDeleteUser}
              >
                Supprimer définitivement
              </Button>
            </ModalFooter>
          </>
        )}
      </Modal>
    </DashboardLayout>
  );
}

