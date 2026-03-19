'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Home, Settings as SettingsIcon, Bell, Shield, Plus, Loader2 } from 'lucide-react';
import { updateFarmInfo, createHouse } from '@/lib/actions/dashboard-actions';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface SettingsContentProps {
  farm: any;
}

export function SettingsContent({ farm }: SettingsContentProps) {
  const [activeTab, setActiveTab] = useState('farm');
  const [isUpdatingFarm, setIsUpdatingFarm] = useState(false);
  const [isAddingHouse, setIsAddingHouse] = useState(false);
  const [showHouseModal, setShowHouseModal] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleUpdateFarm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdatingFarm(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const location = formData.get('location') as string;
    const capacity = parseInt(formData.get('capacity') as string);

    try {
      const result = await updateFarmInfo({ name, location, capacity });
      if (result.success) {
        setMessage({ type: 'success', text: 'Farm information updated successfully!' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update farm info.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setIsUpdatingFarm(false);
    }
  };

  const handleAddHouse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsAddingHouse(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const houseNumber = formData.get('houseNumber') as string;
    const capacity = parseInt(formData.get('capacity') as string);

    try {
      const result = await createHouse({ houseNumber, capacity });
      if (result.success) {
        setMessage({ type: 'success', text: `House ${houseNumber} added successfully!` });
        setShowHouseModal(false);
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to add house.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setIsAddingHouse(false);
    }
  };

  const tabs = [
    { id: 'farm', label: 'Farm Info', icon: Home },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'preferences', label: 'App Preferences', icon: SettingsIcon },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1 space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full text-left px-4 py-3 rounded-2xl flex items-center transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-emerald-500/20 text-emerald-400 shadow-[inset_0_0_20px_rgba(16,185,129,0.1)] border border-emerald-500/30'
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4 mr-2" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="md:col-span-3 space-y-6">
        {message && (
          <div className={`p-4 rounded-2xl text-sm font-bold backdrop-blur-md border ${
            message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        {activeTab === 'farm' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Farm Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateFarm} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                      label="Farm Name"
                      name="name"
                      defaultValue={farm?.name}
                      required
                    />
                    <Input 
                      label="Location"
                      name="location"
                      defaultValue={farm?.location || ''}
                      required
                    />
                  </div>
                  <Input 
                    label="Total Capacity"
                    name="capacity"
                    type="number" 
                    defaultValue={farm?.capacity}
                    required
                  />
                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      isLoading={isUpdatingFarm}
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>House Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/60 mb-6 font-medium">Manage your poultry houses and their sensor configurations.</p>
                <Button 
                  onClick={() => setShowHouseModal(true)}
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add New House
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab !== 'farm' && (
          <Card>
            <CardHeader>
              <CardTitle>{tabs.find(t => t.id === activeTab)?.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Settings for {tabs.find(t => t.id === activeTab)?.label.toLowerCase()} are coming soon.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {showHouseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-50 p-4">
          <div className="glass-pill rounded-[2.5rem] max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-10">
              <h3 className="text-2xl font-black text-white mb-8 tracking-tighter italic">Add New <span className="text-emerald-400">House</span></h3>
              <form onSubmit={handleAddHouse} className="space-y-4">
                <Input 
                  label="House Number / Name"
                  name="houseNumber"
                  placeholder="e.g. House 01"
                  required
                />
                <Input 
                  label="Capacity (Birds)"
                  name="capacity"
                  type="number" 
                  placeholder="e.g. 1000"
                  required
                />
                <div className="flex justify-end space-x-4 pt-8">
                  <Button 
                    type="button" 
                    variant="ghost"
                    onClick={() => setShowHouseModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    isLoading={isAddingHouse}
                  >
                    Create House
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
