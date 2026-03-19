'use client'

import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { EggForm } from './EggForm';

export const EggActionsHeader = ({ batches }: { batches: any[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Log New Production
      </Button>
      <Dialog isOpen={isOpen} onOpenChange={setIsOpen} title="Log Egg Production">
        <EggForm batches={batches} mode="create" onClose={() => setIsOpen(false)} />
      </Dialog>
    </>
  );
};

export const EggLogActions = ({ log, batches }: { log: any, batches: any[] }) => {
  const [mode, setMode] = useState<'edit' | 'delete' | null>(null);

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={() => setMode('edit')}
        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
      >
        <Edit2 className="h-4 w-4" />
      </button>
      <button 
        onClick={() => setMode('delete')}
        className="p-1 text-gray-400 hover:bg-gray-100 rounded transition-colors"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <Dialog 
        isOpen={mode !== null} 
        onOpenChange={(open) => !open && setMode(null)} 
        title={mode === 'edit' ? 'Edit Production Log' : 'Delete Log'}
      >
        {mode && (
          <EggForm 
            log={log} 
            batches={batches} 
            mode={mode} 
            onClose={() => setMode(null)} 
          />
        )}
      </Dialog>
    </div>
  );
};

export const LogProductionButton = ({ batchId, batches }: { batchId: number, batches: any[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-green-800 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition-colors"
      >
        Log Production
      </button>
      <Dialog isOpen={isOpen} onOpenChange={setIsOpen} title="Log Egg Production">
        <EggForm 
          batches={batches} 
          mode="create" 
          defaultBatchId={batchId} 
          onClose={() => setIsOpen(false)} 
        />
      </Dialog>
    </>
  );
};
