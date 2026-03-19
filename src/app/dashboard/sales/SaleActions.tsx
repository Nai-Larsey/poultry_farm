'use client'

import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { SaleForm } from './SaleForm';

export const SaleActionsHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        New Sale
      </Button>
      <Dialog isOpen={isOpen} onOpenChange={setIsOpen} title="Record New Sale" className="max-w-2xl">
        <SaleForm mode="create" onClose={() => setIsOpen(false)} />
      </Dialog>
    </>
  );
};

export const SaleRowActions = ({ sale }: { sale: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors">
        <Trash2 className="h-4 w-4" />
      </button>

      <Dialog isOpen={isOpen} onOpenChange={setIsOpen} title="Delete Sale Record">
        <SaleForm sale={sale} mode="delete" onClose={() => setIsOpen(false)} />
      </Dialog>
    </>
  );
};
