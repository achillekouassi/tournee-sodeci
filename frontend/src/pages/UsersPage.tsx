import { useState, useEffect } from 'react';
import { User, Mail, FileText, Shield, MapPin, UserPlus, Upload, 
  X, Eye, Edit, Trash2, ChevronLeft, ChevronRight, 
  CheckSquare, Square, Search, Filter, Download } from 'lucide-react';

import { api } from '../services/api';

interface UserData {
  id: number;
  nom: string;
  matricule: string;
  email: string;
  role: string;
  zone?: string;
  statut: string;
  dateCreation?: string;
  dernierAcces?: string;
}

interface UsersPageProps {
  data: UserData[];
  token: string;
  reload: () => void;
  onViewUser?: (userId: number) => void;
}

interface ImportResult {
  success: boolean;
  message: string;
  lignesImportees?: number;
  nombreTournees?: number;
  nombreClients?: number;
}

export function UsersPage({ data, token, reload, onViewUser }: UsersPageProps) {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  
  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // États pour les modals
  const [showCreate, setShowCreate] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>('');

  // États pour l'import
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  // Formulaire de création
  const [formData, setFormData] = useState({
    nom: '',
    matricule: '',
    email: '',
    motDePasse: '',
    role: 'AGENT_RELEVEUR',
    zone: ''
  });

  // Debug logs
  useEffect(() => {
    console.log('📋 Utilisateurs sélectionnés:', selectedUsers);
  }, [selectedUsers]);

  // Calculs pour la pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  // Filtrage des données
  const filteredData = data.filter(user =>
    user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.zone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Gestion de la sélection multiple
  const toggleUserSelection = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === currentData.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(currentData.map(user => user.id));
    }
  };

  const isUserSelected = (userId: number) => {
    return selectedUsers.includes(userId);
  };

  const isAllSelected = () => {
    return currentData.length > 0 && selectedUsers.length === currentData.length;
  };

  const isSomeSelected = () => {
    return selectedUsers.length > 0 && selectedUsers.length < currentData.length;
  };

  // Gestion des statuts
  const handleStatusChange = async (userId: number, action: string) => {
    setLoading(userId);
    setError('');
    
    try {
      console.log(`🔄 Tentative ${action} sur utilisateur ${userId}`);

      // Implémentez ces appels API selon votre backend
      if (action === 'activer') {
        // await api.activateUser(token, userId);
      } else if (action === 'desactiver') {
        // await api.deactivateUser(token, userId);
      } else if (action === 'reinitialiser') {
        // await api.resetPassword(token, userId);
      }

      console.log(`✅ ${action} réussi pour utilisateur ${userId}`);
      reload();
      
    } catch (err: any) {
      console.error(`❌ Erreur ${action}:`, err);
      const errorMessage = err.message || `Erreur lors du ${action}`;
      setError(errorMessage);
      alert(`❌ ${errorMessage}`);
    } finally {
      setLoading(null);
    }
  };

  // Actions groupées
  const handleBulkAction = async () => {
    if (!selectedAction || selectedUsers.length === 0) return;

    setLoading(-1);
    try {
      for (const userId of selectedUsers) {
        await handleStatusChange(userId, selectedAction);
      }
      setShowActionModal(false);
      setSelectedUsers([]);
      setSelectedAction('');
    } finally {
      setLoading(null);
    }
  };

  // Gestion des actions
  const handleView = (user: UserData) => {
    console.log('Tentative de navigation vers utilisateur:', user.id);
    if (onViewUser) {
      onViewUser(user.id);
    } else {
      console.log('Voir utilisateur:', user);
      alert(`Détails de l'utilisateur: ${user.nom}\nID: ${user.id}\nEmail: ${user.email}`);
    }
  };

  const handleEdit = (user: UserData) => {
    console.log('Modifier utilisateur:', user);
    // Ouvrir le modal d'édition avec les données pré-remplies
    setFormData({
      nom: user.nom,
      matricule: user.matricule,
      email: user.email,
      motDePasse: '', // Mot de passe vide pour l'édition
      role: user.role,
      zone: user.zone || ''
    });
    setShowCreate(true);
  };

  const handleDelete = async (user: UserData) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.nom}" ?`)) {
      try {
        console.log('Suppression utilisateur:', user.id);
        // await api.deleteUser(token, user.id);
        reload();
      } catch (error) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleCreate = async () => {
    setLoading(-1);
    try {
      await api.createUtilisateur(token, formData);
      setShowCreate(false);
      setFormData({
        nom: '',
        matricule: '',
        email: '',
        motDePasse: '',
        role: 'AGENT_RELEVEUR',
        zone: ''
      });
      reload();
    } catch (err: any) {
      alert(`Erreur lors de la création: ${err.message}`);
    } finally {
      setLoading(null);
    }
  };

  const handleImport = async () => {
    if (!importFile) return;

    setLoading(-1);
    try {
      const result = await api.importExcel(token, importFile);
      setImportResult(result);
      reload();
    } catch (err: any) {
      setImportResult({
        success: false,
        message: `Erreur lors de l'importation: ${err.message}`
      });
    } finally {
      setLoading(null);
    }
  };

  // Fonctions utilitaires
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'SUPERVISEUR':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'AGENT_RELEVEUR':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Administrateur';
      case 'SUPERVISEUR': return 'Superviseur';
      case 'AGENT_RELEVEUR': return 'Agent Releveur';
      default: return role;
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'ACTIF':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'INACTIF':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'SUSPENDU':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (statut: string) => {
    switch (statut) {
      case 'ACTIF': return 'Actif';
      case 'INACTIF': return 'Inactif';
      case 'SUSPENDU': return 'Suspendu';
      default: return statut;
    }
  };

  const getActionButtons = (user: UserData) => {
    if (loading === user.id) {
      return (
        <div className="flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-1">
        {user.statut === 'INACTIF' && (
          <button
            onClick={() => handleStatusChange(user.id, 'activer')}
            className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
            title="Activer"
          >
            <User className="w-4 h-4" />
          </button>
        )}
        {user.statut === 'ACTIF' && (
          <button
            onClick={() => handleStatusChange(user.id, 'desactiver')}
            className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors"
            title="Désactiver"
          >
            <User className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => handleStatusChange(user.id, 'reinitialiser')}
          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
          title="Réinitialiser mot de passe"
        >
          <Shield className="w-4 h-4" />
        </button>
      </div>
    );
  };

  // Gestion de la pagination
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-800">Gestion des Utilisateurs</h1>
        <div className="text-xs text-gray-500">
          {data.length} utilisateurs • {selectedUsers.length} sélectionné(s) • Page {currentPage} sur {totalPages}
        </div>
      </div>

      {/* Barre d'actions principales */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {/* Barre de recherche */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher par nom, matricule, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowImport(true)}
            className="flex items-center space-x-2 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition text-xs"
          >
            <Upload className="w-4 h-4" />
            <span>Nouveau GF</span>
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition text-xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>Nouvel utilisateur</span>
          </button>

        </div>
      </div>

      {/* Barre d'actions pour la sélection multiple */}
      {selectedUsers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-blue-800">
                {selectedUsers.length} utilisateur(s) sélectionné(s)
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowActionModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded text-xs hover:bg-blue-700 transition-colors"
              >
                Actions groupées ({selectedUsers.length})
              </button>
              <button
                onClick={() => setSelectedUsers([])}
                className="bg-gray-100 text-gray-700 px-3 py-2 rounded text-xs hover:bg-gray-200 transition-colors"
              >
                Tout désélectionner
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-red-700">
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Contrôles de pagination en haut */}
      <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow">
        <div className="flex items-center space-x-4">
          <label className="text-xs text-gray-700">
            Afficher :
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="ml-2 border border-gray-300 rounded px-2 py-1 text-xs"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="p-1.5 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="text-xs text-gray-600">
            {startIndex + 1}-{Math.min(endIndex, data.length)} sur {data.length}
          </span>
          
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="p-1.5 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tableau des utilisateurs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-700 w-10">
                <button
                  onClick={toggleSelectAll}
                  className="flex items-center justify-center w-5 h-5 border border-gray-300 rounded hover:bg-gray-100"
                >
                  {isAllSelected() ? (
                    <CheckSquare className="w-4 h-4 text-blue-600" />
                  ) : isSomeSelected() ? (
                    <div className="w-3 h-3 bg-blue-600 rounded-sm" />
                  ) : (
                    <Square className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Utilisateur</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Matricule</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Email</th>
              <th className="px-4 py-3 text-center font-medium text-gray-700">Rôle</th>
              <th className="px-4 py-3 text-center font-medium text-gray-700">Zone</th>
              <th className="px-4 py-3 text-center font-medium text-gray-700">Statut</th>
              <th className="px-4 py-3 text-center font-medium text-gray-700">Dernier accès</th>
              <th className="px-4 py-3 text-center font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentData.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                {/* Case à cocher */}
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => toggleUserSelection(user.id)}
                    className="flex items-center justify-center w-5 h-5 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    {isUserSelected(user.id) ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </td>

                {/* Nom */}
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold text-gray-800">{user.nom}</span>
                  </div>
                </td>

                {/* Matricule */}
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <FileText  className="w-4 h-4 text-gray-400" />
                    <span className="font-mono text-gray-600">{user.matricule}</span>
                  </div>
                </td>

                {/* Email */}
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{user.email}</span>
                  </div>
                </td>

                {/* Rôle */}
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                    {getRoleText(user.role)}
                  </span>
                </td>

                {/* Zone */}
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      {user.zone || <span className="text-gray-400 italic">Non définie</span>}
                    </span>
                  </div>
                </td>

                {/* Statut */}
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(user.statut)}`}>
                    {getStatusText(user.statut)}
                  </span>
                </td>

                {/* Dernier accès */}
                <td className="px-4 py-3 text-center text-gray-600 text-xs">
                  {user.dernierAcces ? (
                    new Date(user.dernierAcces).toLocaleDateString()
                  ) : (
                    <span className="text-gray-400">Jamais</span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center space-x-2">
                    {/* Actions de statut */}
                    {getActionButtons(user)}
                    
                    {/* Icônes d'actions */}
                    <div className="flex space-x-1">
                      {/* Icône Voir */}
                      <button
                        onClick={() => handleView(user)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Icône Modifier */}
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      {/* Icône Supprimer */}
                      <button
                        onClick={() => handleDelete(user)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!data || data.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            Aucun utilisateur trouvé
          </div>
        )}
      </div>

      {/* Pagination en bas */}
      {data.length > 0 && (
        <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow">
          <div className="text-xs text-gray-500">
            {startIndex + 1}-{Math.min(endIndex, data.length)} sur {data.length} utilisateurs
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="flex items-center space-x-1 px-3 py-1.5 border border-gray-300 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Précédent</span>
            </button>
            
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`w-8 h-8 rounded text-xs ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="flex items-center space-x-1 px-3 py-1.5 border border-gray-300 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <span>Suivant</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal de création/édition d'utilisateur */}
      {showCreate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {formData.nom ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
              </h2>
              <button
                onClick={() => {
                  setShowCreate(false);
                  setFormData({
                    nom: '',
                    matricule: '',
                    email: '',
                    motDePasse: '',
                    role: 'AGENT_RELEVEUR',
                    zone: ''
                  });
                }}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Nom et prénom"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Matricule</label>
                <input
                  type="text"
                  value={formData.matricule}
                  onChange={(e) => setFormData({ ...formData, matricule: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Numéro de matricule"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="adresse@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.nom ? 'Nouveau mot de passe (laisser vide pour ne pas changer)' : 'Mot de passe'}
                </label>
                <input
                  type="password"
                  value={formData.motDePasse}
                  onChange={(e) => setFormData({ ...formData, motDePasse: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Mot de passe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="AGENT_RELEVEUR">Agent Releveur</option>
                  <option value="SUPERVISEUR">Superviseur</option>
                  <option value="ADMIN">Administrateur</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Zone</label>
                <input
                  type="text"
                  value={formData.zone}
                  onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Zone géographique"
                />
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowCreate(false);
                    setFormData({
                      nom: '',
                      matricule: '',
                      email: '',
                      motDePasse: '',
                      role: 'AGENT_RELEVEUR',
                      zone: ''
                    });
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCreate}
                  disabled={loading === -1}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading === -1 ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <span>{formData.nom ? 'Modifier' : 'Créer'}</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'import */}
      {showImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Importer des utilisateurs</h2>
              <button
                onClick={() => {
                  setShowImport(false);
                  setImportResult(null);
                  setImportFile(null);
                }}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {!importResult ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sélectionner un fichier Excel
                  </label>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                    className="w-full text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Format supporté: Excel (.xlsx, .xls)
                  </p>
                </div>

                {importFile && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">Fichier sélectionné:</p>
                    <p className="text-sm text-blue-600 mt-1">{importFile.name}</p>
                  </div>
                )}

                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowImport(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={!importFile || loading === -1}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {loading === -1 ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Importation...</span>
                      </>
                    ) : (
                      <span>Importer</span>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${importResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
                  <p className={`text-sm font-medium ${importResult.success ? 'text-green-800' : 'text-red-800'}`}>
                    {importResult.success ? '✓ Importation réussie' : '✗ Erreur d\'importation'}
                  </p>
                  <p className={`text-sm mt-1 ${importResult.success ? 'text-green-600' : 'text-red-600'}`}>
                    {importResult.message}
                  </p>
                </div>

                {importResult.success && importResult.lignesImportees && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lignes importées:</span>
                      <span className="font-medium text-gray-800">{importResult.lignesImportees}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    setShowImport(false);
                    setImportResult(null);
                    setImportFile(null);
                  }}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Fermer
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal d'actions groupées */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Actions groupées
              </h2>
              <button
                onClick={() => {
                  setShowActionModal(false);
                  setSelectedAction('');
                }}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700">Utilisateurs sélectionnés</p>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  {selectedUsers.length} utilisateur(s)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action à appliquer
                </label>
                <select
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner une action</option>
                  <option value="activer">Activer</option>
                  <option value="desactiver">Désactiver</option>
                  <option value="reinitialiser">Réinitialiser mots de passe</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowActionModal(false);
                    setSelectedAction('');
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={handleBulkAction}
                  disabled={!selectedAction || loading === -1}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading === -1 ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Application...</span>
                    </>
                  ) : (
                    <span>Appliquer</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}