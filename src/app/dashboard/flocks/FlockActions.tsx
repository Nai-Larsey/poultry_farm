'use client'

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Skull } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { FlockForm } from './FlockForm';

export const FlockActionsHeader = ({ houses }: { houses: any[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add New Batch
      </Button>
      <Dialog isOpen={isOpen} onOpenChange={setIsOpen} title="Add New Batch">
        <FlockForm houses={houses} mode="create" onClose={() => setIsOpen(false)} />
      </Dialog>
    </>
  );
};

export const FlockRowActions = ({ batch, houses }: { batch: any, houses: any[] }) => {
  const [mode, setMode] = useState<'edit' | 'delete' | 'mortality' | null>(null);

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={() => setMode('mortality')}
        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
        title="Log Mortality"
      >
        <Skull className="h-4 w-4" />
      </button>
      <button 
        onClick={() => setMode('edit')}
        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
        title="Edit Batch"
      >
        <Edit2 className="h-4 w-4" />
      </button>
      <button 
        onClick={() => setMode('delete')}
        className="p-1 text-gray-400 hover:bg-gray-100 rounded transition-colors"
        title="Delete Batch"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <Dialog 
        isOpen={mode !== null} 
        onOpenChange={(open) => !open && setMode(null)} 
        title={mode === 'edit' ? 'Edit Batch' : mode === 'delete' ? 'Delete Batch' : 'Log Mortality'}
      >
        {mode && (
          <FlockForm 
            batch={batch} 
            houses={houses} 
            mode={mode} 
            onClose={() => setMode(null)} 
          />
        )}
      </Dialog>
    </div>
  );
};
