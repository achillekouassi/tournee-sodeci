// src/components/agent/AgentForm.tsx
import React, { useState, useEffect } from 'react';
import { agenceService } from '../../../api/agenceService';
import { Button } from '../../ui/Button';
import { AgentDTO, RoleType } from '../../../types/agent';
import { AgenceDTO } from '../../../types/agenceDTO';

interface AgentFormProps {
  agent?: AgentDTO;
  onSubmit: (data: AgentDTO) => void;
  onCancel: () => void;
}

export const AgentForm: React.FC<AgentFormProps> = ({ agent, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<AgentDTO>(
    agent || {
      matricule: '',
      nom: '',
      prenoms: '',
      fonction: '',
      password: '',
      role: RoleType.AGENT_TERRAIN,
      telephone: '',
      email: '',
      agenceId: 0,
      // Ajout des propriétés optionnelles manquantes
      createdDate: undefined,
      lastModifiedDate: undefined,
      agenceLibelle: undefined,
      directionRegionaleLibelle: undefined,
      isLocked: false,
      failedLoginAttempts: 0
    }
  );

  const [agences, setAgences] = useState<AgenceDTO[]>([]);
  const [loadingAgences, setLoadingAgences] = useState(false);

  useEffect(() => {
    const fetchAgences = async () => {
      try {
        setLoadingAgences(true);
        const response = await agenceService.getAllAgences();
        if (Array.isArray(response)) {
          setAgences(response);
        } else if (response && Array.isArray(response.content)) {
          setAgences(response.content);
        }
      } catch (err) {
        console.error('Erreur de chargement des agences:', err);
      } finally {
        setLoadingAgences(false);
      }
    };

    fetchAgences();
  }, []);

  // Fonction pour déterminer si le champ Agence doit être affiché
  const shouldShowAgenceField = () => {
    return formData.role === RoleType.AGENT_TERRAIN || formData.role === RoleType.AGENT_ZONE;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation conditionnelle pour l'agence
    if (shouldShowAgenceField() && (!formData.agenceId || formData.agenceId === 0)) {
      alert("Veuillez sélectionner une agence.");
      return;
    }

    onSubmit(formData);
  };

  const handleRoleChange = (role: RoleType) => {
    setFormData(prev => ({ 
      ...prev, 
      role,
      // Réinitialiser l'agence si le rôle change pour un rôle qui ne nécessite pas d'agence
      ...(role !== RoleType.AGENT_TERRAIN && role !== RoleType.AGENT_ZONE ? { agenceId: 0 } : {})
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Matricule *
          </label>
          <input
            type="text"
            required
            value={formData.matricule}
            onChange={e => setFormData({ ...formData, matricule: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rôle *
          </label>
          <select
            required
            value={formData.role}
            onChange={e => handleRoleChange(e.target.value as RoleType)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >

            <option value={RoleType.AGENT_TERRAIN}>Agent Terrain</option>
            <option value={RoleType.AGENT_ZONE}>Agent Zone</option>
            <option value={RoleType.OPERATEUR_SUPERVISION}>Opérateur Supervision</option>
            <option value={RoleType.ADMIN}>Administrateur</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom *
          </label>
          <input
            type="text"
            required
            value={formData.nom}
            onChange={e => setFormData({ ...formData, nom: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prénoms *
          </label>
          <input
            type="text"
            required
            value={formData.prenoms}
            onChange={e => setFormData({ ...formData, prenoms: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fonction
        </label>
        <input
          type="text"
          value={formData.fonction || ''}
          onChange={e => setFormData({ ...formData, fonction: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Champ Agence conditionnel */}
      {shouldShowAgenceField() && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Agence *
          </label>
          <select
            required
            value={formData.agenceId || ''}
            onChange={e => setFormData({ ...formData, agenceId: parseInt(e.target.value) })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loadingAgences}
          >
            <option value="">Sélectionnez une agence</option>
            {agences.map(agence => (
              <option key={agence.id} value={agence.id}>
                {agence.code} - {agence.libelle}
              </option>
            ))}
          </select>
          {loadingAgences && (
            <p className="text-xs text-gray-500 mt-1">Chargement des agences...</p>
          )}
        </div>
      )}

      {!agent && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mot de passe *
          </label>
          <input
            type="password"
            required
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Téléphone
          </label>
          <input
            type="tel"
            value={formData.telephone || ''}
            onChange={e => setFormData({ ...formData, telephone: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={formData.email || ''}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
        <Button variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          Enregistrer
        </Button>
      </div>
    </form>
  );
};