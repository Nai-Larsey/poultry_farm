'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Plus, Edit2, Trash2, Skull } from 'lucide-react';
import { createBatch, updateBatch, deleteBatch, logMortality } from '@/lib/actions/batch-actions';
import { useRouter } from 'next/navigation';

interface FlockActionsProps {
  houses: { id: number; name: string }[];
  batch?: any;
  mode: 'create' | 'edit' | 'delete' | 'mortality';
  onClose: () => void;
}

export const FlockForm = ({ houses, batch, mode, onClose }: FlockActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    houseId: batch?.houseId || (houses[0]?.id || 0),
    breedType: batch?.breedType || '',
    initialCount: batch?.initialCount || 0,
    arrivalDate: batch?.arrivalDate ? new Date(batch.arrivalDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    status: batch?.status || 'active',
    mortalityCount: 0,
    reason: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (mode === 'create') {
        await createBatch({
          houseId: Number(formData.houseId),
          breedType: formData.breedType,
          initialCount: Number(formData.initialCount),
          arrivalDate: formData.arrivalDate,
        });
      } else if (mode === 'edit') {
        await updateBatch(batch.id, {
          houseId: Number(formData.houseId),
          breedType: formData.breedType,
          initialCount: Number(formData.initialCount),
          arrivalDate: formData.arrivalDate,
          status: formData.status,
        });
      } else if (mode === 'delete') {
        await deleteBatch(batch.id);
      } else if (mode === 'mortality') {
        await logMortality({
          batchId: batch.id,
          count: Number(formData.mortalityCount),
          reason: formData.reason,
          logDate: new Date().toISOString(),
        });
      }
      onClose();
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (mode === 'delete') {
    return (
      <div className="space-y-4">
        <p className="text-gray-600">Are you sure you want to delete this batch? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="danger" onClick={handleSubmit} isLoading={isLoading}>Delete Batch</Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === 'mortality' ? (
        <>
          <Input
            label="Mortality Count"
            type="number"
            value={formData.mortalityCount}
            onChange={(e) => setFormData({ ...formData, mortalityCount: Number(e.target.value) })}
            required
          />
          <Input
            label="Reason (Optional)"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          />
        </>
      ) : (
        <>
          <Select
            label="House"
            options={houses.map(h => ({ label: h.name, value: h.id }))}
            value={formData.houseId}
            onChange={(e) => setFormData({ ...formData, houseId: Number(e.target.value) })}
            required
          />
          <Input
            label="Breed Type"
            value={formData.breedType}
            onChange={(e) => setFormData({ ...formData, breedType: e.target.value })}
            required
          />
          <Input
            label="Initial Count"
            type="number"
            value={formData.initialCount}
            onChange={(e) => setFormData({ ...formData, initialCount: Number(e.target.value) })}
            required
          />
          <Input
            label="Arrival Date"
            type="date"
            value={formData.arrivalDate}
            onChange={(e) => setFormData({ ...formData, arrivalDate: e.target.value })}
            required
          />
          {mode === 'edit' && (
            <Select
              label="Status"
              options={[
                { label: 'Active', value: 'active' },
                { label: 'Completed', value: 'completed' },
              ]}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            />
          )}
        </>
      )}
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
        <Button type="submit" isLoading={isLoading}>
          {mode === 'create' ? 'Create Batch' : mode === 'edit' ? 'Update Batch' : 'Save'}
        </Button>
      </div>
    </form>
  );
};
