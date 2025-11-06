// src/components/tournees/TourneeForm.tsx

import React, { useState } from 'react';
import { TourneeDTO, StatutTournee } from '../../types/tournee';
import { Button } from '../ui/Button';

interface TourneeFormProps {
  tournee?: TourneeDTO;
  onSubmit: (data: TourneeDTO) => void;
  onCancel: () => void;
}

export const TourneeForm: React.FC<TourneeFormProps> = ({ tournee, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<TourneeDTO>(
    tournee || {
      codeTournee: '',
      libelle: '',
      codeAgence: 'AG001',
      statut: StatutTournee.ACTIVE
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Code Tournée *
          </label>
          <input
            type="text"
            required
            value={formData.codeTournee}
            onChange={e => setFormData({ ...formData, codeTournee: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Code Agence *
          </label>
          <input
            type="text"
            required
            value={formData.codeAgence}
            onChange={e => setFormData({ ...formData, codeAgence: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Libellé *
        </label>
        <input
          type="text"
          required
          value={formData.libelle}
          onChange={e => setFormData({ ...formData, libelle: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quartier
          </label>
          <input
            type="text"
            value={formData.quartier || ''}
            onChange={e => setFormData({ ...formData, quartier: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Commune
          </label>
          <input
            type="text"
            value={formData.commune || ''}
            onChange={e => setFormData({ ...formData, commune: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Compteurs estimés
          </label>
          <input
            type="number"
            value={formData.nombreCompteursEstime || ''}
            onChange={e => setFormData({ 
              ...formData, 
              nombreCompteursEstime: parseInt(e.target.value) || undefined 
            })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Durée estimée (h)
          </label>
          <input
            type="number"
            step="0.5"
            value={formData.dureeEstimeeHeures || ''}
            onChange={e => setFormData({ 
              ...formData, 
              dureeEstimeeHeures: parseFloat(e.target.value) || undefined 
            })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Observations
        </label>
        <textarea
          value={formData.observations || ''}
          onChange={e => setFormData({ ...formData, observations: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
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