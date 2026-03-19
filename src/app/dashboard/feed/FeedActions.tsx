'use client'

import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { FeedForm } from './FeedForm';
import { InventoryForm } from './InventoryForm';

export const FeedActionsHeader = ({ batches, inventory }: { batches: any[], inventory: any[] }) => {
  const [openFeed, setOpenFeed] = useState(false);
  const [openItem, setOpenItem] = useState(false);

  return (
    <div className="flex gap-3">
      <Button variant="outline" onClick={() => setOpenItem(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Item
      </Button>
      <Button onClick={() => setOpenFeed(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Log Feeding
      </Button>

      <Dialog isOpen={openFeed} onOpenChange={setOpenFeed} title="Log Feeding">
        <FeedForm batches={batches} inventory={inventory} mode="create" onClose={() => setOpenFeed(false)} />
      </Dialog>

      <Dialog isOpen={openItem} onOpenChange={setOpenItem} title="Add Inventory Item">
        <InventoryForm mode="create" onClose={() => setOpenItem(false)} />
      </Dialog>
    </div>
  );
};

export const FeedLogActions = ({ log, batches, inventory }: { log: any, batches: any[], inventory: any[] }) => {
  const [mode, setMode] = useState<'edit' | 'delete' | null>(null);

  return (
    <div className="flex items-center gap-2">
      <button onClick={() => setMode('edit')} className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors">
        <Edit2 className="h-4 w-4" />
      </button>
      <button onClick={() => setMode('delete')} className="p-1 text-gray-400 hover:bg-gray-100 rounded transition-colors">
        <Trash2 className="h-4 w-4" />
      </button>

      <Dialog isOpen={mode !== null} onOpenChange={(open) => !open && setMode(null)} title={mode === 'edit' ? 'Edit Feeding Log' : 'Delete Log'}>
        {mode && <FeedForm log={log} batches={batches} inventory={inventory} mode={mode} onClose={() => setMode(null)} />}
      </Dialog>
    </div>
  );
};

export const InventoryActions = ({ item }: { item: any }) => {
  const [mode, setMode] = useState<'edit' | 'delete' | null>(null);

  return (
    <div className="flex items-center gap-2">
      <button onClick={() => setMode('edit')} className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors">
        <Edit2 className="h-4 w-4" />
      </button>
      <button onClick={() => setMode('delete')} className="p-1 text-gray-400 hover:bg-gray-100 rounded transition-colors">
        <Trash2 className="h-4 w-4" />
      </button>

      <Dialog isOpen={mode !== null} onOpenChange={(open) => !open && setMode(null)} title={mode === 'edit' ? 'Edit Item' : 'Delete Item'}>
        {mode && <InventoryForm item={item} mode={mode} onClose={() => setMode(null)} />}
      </Dialog>
    </div>
  );
};
