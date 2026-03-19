'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Trash2 } from 'lucide-react';
import { createSale, deleteSale } from '@/lib/actions/sale-actions';
import { useRouter } from 'next/navigation';

interface SaleFormProps {
  sale?: any;
  mode: 'create' | 'delete';
  onClose: () => void;
}

export const SaleForm = ({ sale, mode, onClose }: SaleFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    items: [{ description: '', quantity: 1, unitPrice: 0, totalPrice: 0 }],
  });

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, unitPrice: 0, totalPrice: 0 }],
    });
  };

  const removeItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    (newItems[index] as any)[field] = value;
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].totalPrice = newItems[index].quantity * newItems[index].unitPrice;
    }
    setFormData({ ...formData, items: newItems });
  };

  const totalAmount = formData.items.reduce((acc, item) => acc + item.totalPrice, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (mode === 'create') {
        await createSale({
          customerName: formData.customerName,
          items: formData.items,
          totalAmount: totalAmount,
        });
      } else if (mode === 'delete') {
        await deleteSale(sale.id);
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
        <p className="text-gray-600">Are you sure you want to delete this sale record? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="danger" onClick={handleSubmit} isLoading={isLoading}>Delete Sale</Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Customer Name (Optional)"
        value={formData.customerName}
        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
      />
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Sale Items</h4>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="h-4 w-4 mr-1" /> Add Item
          </Button>
        </div>
        
        {formData.items.map((item, index) => (
          <div key={index} className="grid grid-cols-12 gap-3 items-end p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="col-span-12 sm:col-span-5">
              <Input
                label="Description"
                value={item.description}
                onChange={(e) => updateItem(index, 'description', e.target.value)}
                required
              />
            </div>
            <div className="col-span-4 sm:col-span-2">
              <Input
                label="Qty"
                type="number"
                value={item.quantity}
                onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                required
              />
            </div>
            <div className="col-span-4 sm:col-span-2">
              <Input
                label="Price"
                type="number"
                value={item.unitPrice}
                onChange={(e) => updateItem(index, 'unitPrice', Number(e.target.value))}
                required
              />
            </div>
            <div className="col-span-3 sm:col-span-2">
              <div className="text-xs text-gray-500 font-medium mb-1.5">Total</div>
              <div className="h-10 flex items-center font-bold text-gray-900">${item.totalPrice.toFixed(2)}</div>
            </div>
            <div className="col-span-1">
              {formData.items.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeItem(index)}
                  className="mb-2 p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="text-lg font-black text-gray-900">
          Grand Total: <span className="text-green-700">${totalAmount.toFixed(2)}</span>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isLoading}>Save Sale</Button>
        </div>
      </div>
    </form>
  );
};
