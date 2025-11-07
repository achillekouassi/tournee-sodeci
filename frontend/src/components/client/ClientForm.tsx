// src/components/client/ClientForm.tsx
import React, { useState, useEffect } from 'react';
import { ClientDTO, GroupeFacturation } from '../../types/ClientDTO';
import { AgenceDTO } from '../../types/agenceDTO';
import { Button } from '../ui/Button';
import { agenceService } from '../../api/agenceService';


interface ClientFormProps {
  client?: ClientDTO;
  onSubmit: (data: ClientDTO) => void;
  onCancel: () => void;
}

export const ClientForm: React.FC<ClientFormProps> = ({ client, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<ClientDTO>(
    client || {
      referenceContrat: '',
      nom: '',
      prenoms: '',
      telephone: '',
      email: '',
      adresseGeographique: '',
      latitude: undefined,
      longitude: undefined,
      groupeFacturation: GroupeFacturation.GF0,
      codeAgence: '',
      agenceId: 0,
      soldeCompte: 0,
      montantDu: 0
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agenceId || formData.agenceId === 0) {
      alert("Veuillez sélectionner une agence.");
      return;
    }

    onSubmit(formData);
  };

  const handleAgenceChange = (agenceId: number) => {
    const selectedAgence = agences.find(a => a.id === agenceId);
    setFormData({ 
      ...formData, 
      agenceId,
      codeAgence: selectedAgence?.code || ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Référence Contrat *
          </label>
          <input
            type="text"
            required
            value={formData.referenceContrat}
            onChange={e => setFormData({ ...formData, referenceContrat: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: CONT-2024-001"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Groupe Facturation *
          </label>
          <select
            required
            value={formData.groupeFacturation}
            onChange={e => setFormData({ ...formData, groupeFacturation: e.target.value as GroupeFacturation })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={GroupeFacturation.GF0}>Mensuel (GF0)</option>
            <option value={GroupeFacturation.GF1}>Trimestriel T1 (GF1)</option>
            <option value={GroupeFacturation.GF2}>Trimestriel T2 (GF2)</option>
            <option value={GroupeFacturation.GF3}>Trimestriel T3 (GF3)</option>
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
            Prénoms
          </label>
          <input
            type="text"
            value={formData.prenoms || ''}
            onChange={e => setFormData({ ...formData, prenoms: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Adresse Géographique
        </label>
        <textarea
          value={formData.adresseGeographique || ''}
          onChange={e => setFormData({ ...formData, adresseGeographique: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Adresse complète du client"
        />
      </div>

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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Agence *
        </label>
        <select
          required
          value={formData.agenceId || ''}
          onChange={e => handleAgenceChange(parseInt(e.target.value))}
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
        {formData.codeAgence && (
          <p className="text-xs text-green-600 mt-1">
            Code agence: {formData.codeAgence}
          </p>
        )}
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