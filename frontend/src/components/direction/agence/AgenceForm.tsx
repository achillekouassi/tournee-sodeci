// src/components/agence/AgenceForm.tsx
import React, { useState, useEffect } from 'react';

import { directionRegionaleService } from '../../../api/directionRegionaleService';
import { Button } from '../../ui/Button';
import { AgenceDTO } from '../../../types/agenceDTO';
import { DirectionRegionaleDTO } from '../../../types/directionRegionaleDRO';

interface AgenceFormProps {
  agence?: AgenceDTO;
  onSubmit: (data: AgenceDTO) => void;
  onCancel: () => void;
}

export const AgenceForm: React.FC<AgenceFormProps> = ({ agence, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<AgenceDTO>(
    agence || {
      code: '',
      libelle: '',
      adresse: '',
      telephone: '',
      email: '',
      directionRegionaleId: 0
    }
  );

  const [directions, setDirections] = useState<DirectionRegionaleDTO[]>([]);
  const [loadingDirections, setLoadingDirections] = useState(false);

  useEffect(() => {
    const fetchDirections = async () => {
      try {
        setLoadingDirections(true);
        const response = await directionRegionaleService.getAllDirections();
        if (Array.isArray(response)) {
          setDirections(response);
        } else if (response && Array.isArray(response.content)) {
          setDirections(response.content);
        }
      } catch (err) {
        console.error('Erreur de chargement des directions:', err);
      } finally {
        setLoadingDirections(false);
      }
    };

    fetchDirections();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation de la direction régionale
    if (!formData.directionRegionaleId || formData.directionRegionaleId === 0) {
      alert("Veuillez sélectionner une direction régionale.");
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Code *
          </label>
          <input
            type="text"
            required
            value={formData.code}
            onChange={e => setFormData({ ...formData, code: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Direction Régionale *
        </label>
        <select
          required
          value={formData.directionRegionaleId || ''}
          onChange={e => setFormData({ ...formData, directionRegionaleId: parseInt(e.target.value) })}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loadingDirections}
        >
          <option value="">Sélectionnez une direction régionale</option>
          {directions.map(direction => (
            <option key={direction.id} value={direction.id}>
              {direction.code} - {direction.libelle}
            </option>
          ))}
        </select>
        {loadingDirections && (
          <p className="text-xs text-gray-500 mt-1">Chargement des directions...</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Adresse
        </label>
        <textarea
          value={formData.adresse || ''}
          onChange={e => setFormData({ ...formData, adresse: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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