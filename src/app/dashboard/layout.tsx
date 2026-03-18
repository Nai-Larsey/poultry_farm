import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { ClimateWidget } from '@/components/ui/ClimateWidget';
import { mockClimateLogs } from '@/lib/mock-data';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 shadow-sm justify-between">
          <div className="flex items-center space-x-6">
            <h1 className="text-xl font-semibold text-gray-800">Poultry Farm Management</h1>
            <div className="hidden md:block">
              <ClimateWidget currentClimate={mockClimateLogs[0]} />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 font-medium">Farm Manager</span>
            <div className="w-8 h-8 rounded-full bg-green-800 flex justify-center items-center text-white font-bold text-sm">
              M
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
