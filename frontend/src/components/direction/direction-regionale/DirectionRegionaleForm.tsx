// src/components/direction/DirectionForm.tsx
import React, { useState } from 'react';
import { DirectionRegionaleDTO } from '../../../types/directionRegionaleDRO';
import { Button } from '../../ui/Button';



interface DirectionRegionaleFormProps {
  direction?: DirectionRegionaleDTO;
  onSubmit: (data: DirectionRegionaleDTO) => void;
  onCancel: () => void;
}

export const DirectionRegionaleForm: React.FC<DirectionRegionaleFormProps> = ({ direction, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<DirectionRegionaleDTO>(
    direction || {
      code: '',
      libelle: '',
      adresse: '',
      telephone: '',
      email: ''
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